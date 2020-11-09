export type CanvasInfo = {
	width: number
	height: number
	path: string
}

export type CaptchaFinishResponse = {
	ok: boolean
	session?: string
	pixels?: number
}

export type CaptchaFinishRequest = {
	captcha: string
	results: {
		x: number
		y: number
	}[]
}

export type PixelResponse = {
	id: string
	pixels: number
	expiresAt: string
	reloadsAt?: string
}
