export class PageNotFound extends Error {
	constructor() {
		super()

		Object.setPrototypeOf(this, PageNotFound.prototype)
	}
}
