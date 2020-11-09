import { createApp } from './app'
import { CanvasSaver } from './canvas-saver'
import { appContext } from './context'
import { config } from './lib/config'
import { attachWsServer } from './server'

async function main() {
	const context = appContext(config)
	await context.sequelize.sync()

	await context.storage.initialize()

	if (await context.storage.hasCanvas()) {
		context.canvas.load(await context.storage.loadCanvas())
	}

	context.sessions.start()

	const saver = new CanvasSaver(context)
	saver.start()

	const app = await createApp(context)

	attachWsServer(app, context).listen(+config.port, () => {
		console.log('Listening on', config.port)
	})
}

main().catch(console.error)
