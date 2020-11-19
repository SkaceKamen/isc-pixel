import { promises as fs } from 'fs'
import { join } from 'path'
import { zeroed } from './utils/string'

export class AppStorage {
	protected path: string

	constructor(path: string) {
		this.path = path
	}

	async initialize() {
		await fs.mkdir(this.path, { recursive: true })
		await fs.mkdir(join(this.path, 'snapshots'), { recursive: true })
	}

	get canvasPath() {
		return join(this.path, 'canvas.png')
	}

	get snapshotPath() {
		const now = new Date()
		const year = now.getFullYear()
		const day = zeroed(now.getDate())
		const month = zeroed(now.getMonth())
		const hour = zeroed(now.getHours())
		const minute = zeroed(now.getMinutes())
		const second = zeroed(now.getMinutes())

		return join(
			this.path,
			'snapshots',
			`${day}-${month}-${year}-${hour}-${minute}-${second}-${Date.now()}.png`
		)
	}

	async saveCanvas(data: Buffer) {
		await fs.writeFile(this.canvasPath, data)
	}

	async saveSnapshot(data: Buffer) {
		await fs.writeFile(this.snapshotPath, data)
	}

	async hasCanvas() {
		try {
			await fs.stat(this.canvasPath)

			return true
		} catch {
			return false
		}
	}

	async loadCanvas() {
		return await fs.readFile(this.canvasPath)
	}
}
