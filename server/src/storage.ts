import { promises as fs } from 'fs'
import { join } from 'path'

export class AppStorage {
	protected path: string

	constructor(path: string) {
		this.path = path
	}

	async initialize() {
		await fs.mkdir(this.path, { recursive: true })
	}

	get canvasPath() {
		return join(this.path, 'canvas.png')
	}

	async saveCanvas(data: Buffer) {
		await fs.writeFile(this.canvasPath, data)
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
