import {
	CanvasInfo,
	CaptchaFinishRequest,
	CaptchaFinishResponse
} from '@shared/rest'

export class RestClient {
	url: string
	session?: string

	constructor(url: string, session?: string) {
		this.url = url
		this.session = session
	}

	async getCanvasInfo() {
		const res = await fetch(`${this.url}/canvas`)

		return (await res.json()) as CanvasInfo
	}

	putPixel(x: number, y: number, color: number) {
		return fetch(`${this.url}/pixel`, {
			method: 'PUT',
			headers: {
				'Content-type': 'application/json',
				...(this.session ? { 'x-session': this.session } : {})
			},
			body: JSON.stringify({ x, y, color })
		})
	}

	async requestSession() {
		const res = await fetch(`${this.url}/session`, {
			method: 'POST'
		})

		return (await res.json()) as {
			captcha: string
		}
	}

	async requestSessionFromCaptcha(request: CaptchaFinishRequest) {
		const res = await fetch(`${this.url}/session/captcha`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(request)
		})

		return (await res.json()) as CaptchaFinishResponse
	}
}
