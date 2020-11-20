import { UserSessionInfo } from '@shared/models'
import { v4 as uuidv4 } from 'uuid'
import { AppContext } from './context'
import { hours, seconds } from './lib/time'
import { UserSession } from './models/db/user-session'
import { userSessionToInfo } from './serializers/user-session'

export class Sessions {
	interval?: ReturnType<typeof setInterval>

	private _context?: AppContext

	private expiry = hours(1)

	get context() {
		if (!this._context) {
			throw new Error('Trying to access context before initialization')
		}

		return this._context
	}

	async initialize(context: AppContext) {
		this._context = context

		const existing = await UserSession.findAll()

		existing.forEach((session) => {
			if (session.reloadsAt) {
				setTimeout(
					this.refreshSessionAction(session),
					Math.max(0, session.reloadsAt.getTime() - Date.now())
				)
			}
		})

		return this
	}

	async create() {
		const session = {
			id: uuidv4(),
			pixels: this.context.config.drawing.pixels,
			expiresAt: Date.now() + this.expiry,
		}

		await UserSession.create(session)

		return session
	}

	async get(id: string): Promise<UserSessionInfo | undefined> {
		const record = await this.getRecord(id)

		if (record) {
			if (record.expiresAt.getTime() < Date.now()) {
				await record.destroy()

				return undefined
			}

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
		session.expiresAt = new Date(Date.now() + this.expiry)

		if (!session.reloadsAt) {
			session.reloadsAt = new Date(
				Date.now() + seconds(this.context.config.drawing.timeout)
			)

			setTimeout(
				this.refreshSessionAction(session),
				seconds(this.context.config.drawing.timeout)
			)
		}

		await session.save()

		this.context.bus.sessionChanged.dispatch(userSessionToInfo(session))
	}

	refreshSessionAction = (session: UserSession) => async () => {
		session.pixels = this.context.config.drawing.pixels
		session.reloadsAt = (null as unknown) as undefined

		await session.save()

		this.context.bus.sessionChanged.dispatch(userSessionToInfo(session))
	}
}
