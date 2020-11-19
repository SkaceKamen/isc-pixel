import { AppContext } from './context'
import { minutes } from './lib/time'

export class CanvasSaver {
	private context: AppContext
	private handle?: ReturnType<typeof setInterval>

	private interval: number

	private takeSnapshot = false
	private lastSnapshot = 0

	constructor(context: AppContext, interval = 10000) {
		this.context = context
		this.interval = interval
	}

	start() {
		if (this.handle) {
			this.stop()
		}

		this.handle = setInterval(() => this.tick(), this.interval)
	}

	async tick() {
		if (this.context.canvas.dirty) {
			try {
				await this.context.storage.saveCanvas(await this.context.canvas.png())

				this.context.canvas.dirty = false
				this.takeSnapshot = true
			} catch (e) {
				console.error('Failed to save canvas!')
				console.error(e)
			}
		}

		if (this.takeSnapshot && this.lastSnapshot < Date.now() - minutes(5)) {
			try {
				await this.context.storage.saveSnapshot(await this.context.canvas.png())

				this.takeSnapshot = false
				this.lastSnapshot = Date.now()
			} catch (e) {
				console.error('Failed to save canvas snapshot!')
				console.error(e)
			}
		}
	}

	stop() {
		if (this.handle) {
			clearInterval(this.handle)
		}

		this.handle = undefined
	}
}
