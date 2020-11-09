import { KaptchaModel, KaptchaRecord } from '../lib/kaptcha/kaptcha'

export class MemoryKaptchaModel implements KaptchaModel {
	records = {} as Record<string, KaptchaRecord>
	queue = [] as string[]

	async save(record: KaptchaRecord) {
		if (Object.values(this.records).length > 1000) {
			let removed = 0

			while (this.queue.length > 0 && removed < 100) {
				const id = this.queue.unshift()

				if (this.records[id]) {
					delete this.records[id]
					removed++
				}
			}
		}

		this.records[record.id] = record
		this.queue.push(record.id)
	}

	async remove(id: string) {
		const index = this.queue.indexOf(id)

		if (index >= 0) {
			this.queue.splice(index, 1)
		}

		delete this.records[id]
	}

	async get(id: string) {
		return this.records[id]
	}
}
