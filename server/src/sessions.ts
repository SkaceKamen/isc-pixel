import { v4 as uuidv4 } from 'uuid'
import { hours } from './lib/time'

export type Session = {
	id: string
	pixels: number
	reloadsAt?: number
	expiresAt: number
}

export class Sessions {
	items = {} as Record<string, Session>

	interval?: ReturnType<typeof setInterval>

	async create() {
		const session = {
			id: uuidv4(),
			pixels: 10,
			expiresAt: Date.now() + hours(1),
		}

		this.items[session.id] = session

		return session
	}

	async get(id: string): Promise<Session | undefined> {
		return this.items[id]
	}

	async prolong(id: string) {
		const session = await this.get(id)

		if (!session) {
			throw new Error(`Invalid session ${id}`)
		}

		session.expiresAt = Date.now() + hours(1)
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

	tick() {
		Object.values(this.items).forEach((item) => {
			if (Date.now() >= item.expiresAt) {
				delete this.items[item.id]
			} else {
				if (item.reloadsAt !== undefined && Date.now() >= item.reloadsAt) {
					item.pixels = 10
					item.reloadsAt = undefined
				}
			}
		})
	}
}
