import { v4 as uuidv4 } from 'uuid'
import { hours, minutes, seconds } from './lib/time'
import { UserSessionInfo } from '@shared/models'
import { AppContext } from './context'
import { UserSession } from './models/db/user-session'
import { userSessionToInfo } from './serializers/user-session'

export class Sessions {
	interval?: ReturnType<typeof setInterval>

	private _context?: AppContext

	get context() {
		if (!this._context) {
			throw new Error('Trying to access context before initialization')
		}

		return this._context
	}

	initialize(context: AppContext) {
		this._context = context

		return this
	}

	async create() {
		const session = {
			id: uuidv4(),
			pixels: this.context.config.drawing.pixels,
			expiresAt: Date.now() + hours(1),
		}

		await UserSession.create(session)

		return session
	}

	async get(id: string): Promise<UserSessionInfo | undefined> {
		const record = await this.getRecord(id)

		if (record) {
			return userSessionToInfo(record)
		}

		return undefined
	}

	async getRecord(id: string): Promise<UserSession | null> {
		return await UserSession.findByPk(id)
	}

	async pixelUsed(id: string) {
		const session = await this.getRecord(id)

		if (!session) {
			throw new Error(`Invalid session ${id}`)
		}

		session.pixels -= 1
		session.expiresAt = new Date(Date.now() + hours(1))

		if (!session.reloadsAt) {
			session.reloadsAt = new Date(
				Date.now() + seconds(this.context.config.drawing.timeout)
			)
		}

		await session.save()

		this.context.bus.sessionChanged.dispatch(userSessionToInfo(session))
	}

	start() {
		if (this.interval) {
			this.stop()
		}

		this.interval = setInterval(() => this.tick(), 1000)
	}

	stop() {
		if (this.interval) {
			clearInterval(this.interval)

			this.interval = undefined
		}
	}

	async tick() {
		const items = await UserSession.findAll()

		items.forEach(async (item) => {
			if (Date.now() >= item.expiresAt.getTime()) {
				item.destroy()
			} else {
				if (item.reloadsAt && Date.now() >= item.reloadsAt?.getTime()) {
					item.pixels = this.context.config.drawing.pixels
					item.reloadsAt = (null as unknown) as undefined

					await item.save()

					console.log('Updated, pixels are at', item.pixels)

					this.context.bus.sessionChanged.dispatch(userSessionToInfo(item))
				}
			}
		})
	}
}
