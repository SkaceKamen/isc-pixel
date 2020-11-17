import { appController } from '../app-controller'
import { CanvasInfo } from '@shared/rest'
import { asyncRoute } from '../async-route'

export const canvasApi = appController((router, { canvas, config }) => {
	router.get(
		'/image.png',
		asyncRoute(async (_req, res) => {
			const data = await canvas.png()
			res.contentType('image/png')
			res.send(data)
		})
	)

	router.get('/', (_req, res) => {
		res.json({
			width: config.canvas.width,
			height: config.canvas.height,
			path: '/canvas/image.png',
			palette: config.canvas.palette,
		} as CanvasInfo)
	})
})
