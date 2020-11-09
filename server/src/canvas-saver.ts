import { AppContext } from './context'

export class CanvasSaver {
	private context: AppContext
	private handle?: ReturnType<typeof setInterval>

	private interval: number

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
			} catch (e) {
				console.error('Failed to save canvas!')
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
