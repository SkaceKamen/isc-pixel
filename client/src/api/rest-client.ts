import { UserSessionInfo } from '@shared/models'
import {
	CanvasInfo,
	CaptchaFinishRequest,
	CaptchaFinishResponse,
	PixelResponse
} from '@shared/rest'

export class InvalidResponseError extends Error {
	res: Response

	constructor(res: Response) {
		super(`Invalid server response: ${res.status} ${res.statusText}`)

		this.res = res

		Object.setPrototypeOf(this, InvalidResponseError.prototype)
	}
}

export class RestClient {
	url: string
	session?: string

	constructor(url: string, session?: string) {
		this.url = url
		this.session = session
	}

	async getCanvasInfo() {
		return this.request<CanvasInfo>('/canvas')
	}

	async putPixel(x: number, y: number, colorIndex: number) {
		return this.request<UserSessionInfo>(`/pixel`, {
			method: 'PUT',
			headers: {
				'Content-type': 'application/json',
				...(this.session ? { 'x-session': this.session } : {})
			},
			body: JSON.stringify({ x, y, color: colorIndex })
		})
	}

	async requestSession() {
		return this.request<{ captcha: string }>(`/session`, {
			method: 'POST'
		})
	}

	async requestSessionFromCaptcha(request: CaptchaFinishRequest) {
		return this.request<CaptchaFinishResponse>(`/session/captcha`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(request)
		})
	}

	async getSession(id: string) {
		try {
			return await this.request<UserSessionInfo>(`/session/${id}`)
		} catch (e) {
			return undefined
		}
	}

	protected async request<T>(url: string, init?: RequestInit) {
		const res = await fetch(`${this.url}${url}`, init)

		if (!res.ok) {
			throw new InvalidResponseError(res)
		}

		return (await res.json()) as T
	}
}
