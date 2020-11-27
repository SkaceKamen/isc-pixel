import Jimp from 'jimp'
import SimplexNoise from 'simplex-noise'
import gen, { RandomSeed } from 'random-seed'
import { v4 } from 'uuid'
import crypto from 'crypto'

export interface KaptchaRandomModel {
	seed(seed: string): void
	get(purpose: string): number
}

export interface KaptchaRecord {
	id: string
	seed: string
}

export interface KaptchaModel {
	save(record: KaptchaRecord): Promise<void>
	remove(id: string): Promise<void>
	get(id: string): Promise<KaptchaRecord | null>
}

export type KaptchaOptions = {
	model: KaptchaModel
	random?: KaptchaRandomModel
	font1: string
	font2: string
	steps?: number
	alphabet?: string
}

export class DefaultKaptchaRandomModel implements KaptchaRandomModel {
	generator?: RandomSeed

	seed(seed: string) {
		this.generator = gen.create(seed)
	}

	get() {
		if (!this.generator) {
			throw new Error('Trying to get random number from unseeded model')
		}

		return this.generator.random()
	}
}

export class Kaptcha {
	model: KaptchaModel
	random: KaptchaRandomModel
	steps: number
	font1: string
	font2: string
	alphabet: string
	border = 20
	width = 256
	height = 256
	targetRadius = 15

	constructor({
		model,
		steps = 2,
		alphabet = 'ABHKLMNOSTUVYZ4567',
		font1,
		font2,
		random = new DefaultKaptchaRandomModel(),
	}: KaptchaOptions) {
		this.model = model
		this.random = random
		this.steps = steps
		this.font1 = font1
		this.font2 = font2
		this.alphabet = alphabet
	}

	protected targetLetter(record: KaptchaRecord, step: number) {
		this.random.seed(`${record.seed}${step}`)

		return this.alphabet.charAt(
			Math.round(this.random.get('target-letter') * (this.alphabet.length - 1))
		)
	}

	protected targetLetterPosition(record: KaptchaRecord, step: number) {
		this.random.seed(`${record.seed}${step}pos`)

		return {
			x:
				this.border +
				this.random.get('target-letter-pos-x') * (this.width - this.border * 2),
			y:
				this.border +
				this.random.get('target-letter-pos-y') *
					(this.height - this.border * 2),
		}
	}

	async prompt(id: string, step: number) {
		const record = await this.model.get(id)

		if (!record) {
			throw new Error('Failed to find')
		}

		if (step >= this.steps) {
			throw new Error('Invalid step')
		}

		const font1 = await Jimp.loadFont(this.font1)
		const font2 = await Jimp.loadFont(this.font2)

		this.random.seed(`${record.seed}${step}-prompt`)

		const font =
			this.random.get('main-letter-font-prompt') > 0.5 ? font2 : font1

		const letter = this.targetLetter(record, step)
		const letterImage = await this.createRandomLetterImage(font, letter)

		const width = letterImage.getWidth()
		const height = letterImage.getHeight()

		const image = await Jimp.create(width, height)

		await this.simplexBackground(image, record.seed)

		letterImage.fade(0.5)
		image.blit(letterImage, 0, 0)

		return await image.getBufferAsync(Jimp.MIME_JPEG)
	}

	protected async createRandomLetterImage(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		font: any,
		letter: string,
		main = false
	) {
		const border = 5
		const width = Jimp.measureText(font, letter)
		const height = Jimp.measureTextHeight(font, letter, Infinity)

		const letterImage = await Jimp.create(
			width + border * 2,
			height + border * 2
		)

		letterImage.print(font, border, border, letter)

		letterImage.rotate(this.random.get('letter-rotation') * 360)

		letterImage.color(
			(['red', 'green', 'blue'] as const).map((color) => ({
				apply: color,
				params: [
					(main ? 30 : 30) +
						Math.round(
							this.random.get(`letter-color-${color}`) * (main ? 20 : 35)
						),
				],
			}))
		)

		return letterImage
	}

	protected async simplexBackground(image: Jimp, seed: string) {
		const simplex = new SimplexNoise(seed)

		const { width, height, data } = image.bitmap

		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				const r = simplex.noise2D(x / 40, y / 40)
				const g = simplex.noise2D((10 + x) / 40, (10 + y) / 40)
				const b = simplex.noise2D((20 + x) / 40, (20 + y) / 40)
				data[(x + y * width) * 4 + 0] = 128 + r * 128
				data[(x + y * width) * 4 + 1] = 128 + g * 128
				data[(x + y * width) * 4 + 2] = 128 + b * 128
				data[(x + y * width) * 4 + 3] = 255
			}
		}
	}

	async image(id: string, step: number) {
		const record = await this.model.get(id)

		if (!record) {
			throw new Error('Failed to find')
		}

		if (step >= this.steps) {
			throw new Error('Invalid step')
		}

		const width = this.height
		const height = this.width

		const targetLetter = this.targetLetter(record, step)
		const targetLetterPos = this.targetLetterPosition(record, step)

		this.random.seed(`${record.seed}${step}`)

		const letters = this.alphabet.replace(targetLetter, '')
		const image = await Jimp.create(width, height, 0xffffffff)

		await this.simplexBackground(image, record.seed)

		const font1 = await Jimp.loadFont(this.font1)
		const font2 = await Jimp.loadFont(this.font2)

		const randomLetterPosition = () => ({
			x:
				this.border +
				this.random.get('letter-pos-x') * (width - this.border * 2),
			y:
				this.border +
				this.random.get('letter-pos-y') * (height - this.border * 2),
		})

		const filled = {} as Record<string, number>

		for (let i = 0; i < width / 2.5; i++) {
			const letter = letters.charAt(
				Math.round((letters.length - 1) * this.random.get('letter'))
			)

			const font = this.random.get('letter-font') > 0.5 ? font2 : font1
			const letterImage = await this.createRandomLetterImage(font, letter)

			letterImage.fade(0.5 + this.random.get('letter-fade') * 0.3)

			let tries = 0

			while (tries++ < 10) {
				const pos = randomLetterPosition()
				const posKey = `${Math.floor(pos.x / 32)}-${Math.floor(pos.y / 32)}`

				if ((filled[posKey] ?? 0) < 1) {
					image.blit(
						letterImage,
						pos.x - letterImage.getWidth() / 2,
						pos.y - letterImage.getHeight() / 2
					)

					filled[posKey] = filled[posKey] ?? 0 + 1

					break
				}
			}
		}

		const font = this.random.get('main-letter-font') > 0.5 ? font2 : font1
		const main = await this.createRandomLetterImage(font, targetLetter, true)

		main.fade(0.3)

		image.blit(
			main,
			targetLetterPos.x - main.getWidth() / 2,
			targetLetterPos.y - main.getHeight() / 2
		)

		await this.wobble(image, record.seed)

		image.quality(50)

		return await image.getBufferAsync(Jimp.MIME_JPEG)
	}

	protected async wobble(image: Jimp, seed: string) {
		const simplex = new SimplexNoise(seed)

		const { width, height, data } = image.bitmap

		const dataOrRandom = (x: number, y: number) => {
			if (x >= width) {
				x = x % width
			}

			if (y >= height) {
				y = y % height
			}

			if (x < 0 || x >= width || y < 0 || y >= height) {
				return [
					this.random.get('distort-r') * 255,
					this.random.get('distort-g') * 255,
					this.random.get('distort-b') * 255,
				]
			}

			return [
				data[(x + y * width) * 4 + 0],
				data[(x + y * width) * 4 + 1],
				data[(x + y * width) * 4 + 2],
			]
		}

		for (let x = 0; x < width; x++) {
			const move = Math.round(((1 + simplex.noise2D(x / 10, 0)) / 2) * 5)

			for (let y = 0; y < height; y++) {
				const px = dataOrRandom(x, y + move)
				data[(x + y * width) * 4 + 0] = px[0]
				data[(x + y * width) * 4 + 1] = px[1]
				data[(x + y * width) * 4 + 2] = px[2]
				data[(x + y * width) * 4 + 3] = 255
			}
		}
	}

	async validate(id: string, step: number, x: number, y: number) {
		const record = await this.model.get(id)

		if (!record) {
			throw new Error('Failed to find')
		}

		if (step >= this.steps) {
			throw new Error('Invalid step')
		}

		const pos = this.targetLetterPosition(record, step)

		return (
			Math.abs(pos.x - x) < this.targetRadius &&
			Math.abs(pos.y - y) < this.targetRadius
		)
	}

	async create() {
		const record = {
			id: v4(),
			seed: crypto.randomBytes(32).toString('utf8'),
		}

		await this.model.save(record)

		return record
	}

	async clear(id: string) {
		return await this.model.remove(id)
	}
}
