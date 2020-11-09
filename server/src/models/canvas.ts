import Jimp from 'jimp'

export class Canvas {
	private image: Jimp

	dirty = false

	get width() {
		return this.image.getWidth()
	}

	get height() {
		return this.image.getHeight()
	}

	constructor(width: number, height: number) {
		this.image = new Jimp(width, height, 0xffffffff)
	}

	async load(buffer: Buffer) {
		this.image = await Jimp.read(buffer)
	}

	put(x: number, y: number, color: number) {
		this.image.setPixelColour(color, x, y)
		this.dirty = true
	}

	async png() {
		return this.image.getBufferAsync(Jimp.MIME_PNG)
	}
}
