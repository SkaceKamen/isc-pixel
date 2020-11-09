export type CanvasInfo = {
	width: number
	height: number
	path: string
}

export type CaptchaFinishResponse = {
	ok: boolean
	session?: string
}

export type CaptchaFinishRequest = {
	captcha: string
	results: {
		x: number
		y: number
	}[]
}
