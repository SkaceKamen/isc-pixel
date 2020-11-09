import { Session } from '../sessions'
import { appController } from '../app-controller'
import { pixelValidator } from '../validator/pixel'

export const pixelApi = appController((router, { canvas, bus, storage }) => {
	let debounceTimeout = undefined as ReturnType<typeof setTimeout> | undefined

	const debouncedSave = () => {
		if (debounceTimeout) {
			clearTimeout(debounceTimeout)
		}

		debounceTimeout = setTimeout(async () => {
			debounceTimeout = undefined
			storage.saveCanvas(await canvas.png())
		}, 10000)
	}

	router.put('/', (req, res) => {
		const session = res.locals.session as Session

		if (!session) {
			throw new Error(`Session is required`)
		}

		if (session.pixels <= 0) {
			throw new Error(`You're out of pixels`)
		}

		const { value: pixelData, error } = pixelValidator.validate(req.body)

		if (error || !pixelData) {
			throw error
		}

		if (pixelData.x < 0 || pixelData.x >= canvas.width) {
			throw new Error(`x is out of bounds`)
		}

		if (pixelData.y < 0 || pixelData.y >= canvas.height) {
			throw new Error(`x is out of bounds`)
		}

		canvas.put(pixelData.x | 0, pixelData.y | 0, pixelData.color * 0x100 + 0xff)
		bus.newPixel.dispatch(pixelData)

		debouncedSave()

		return res.json(pixelData)
	})
})
