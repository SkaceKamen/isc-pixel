export type Pixel = {
	x: number
	y: number
	color: number
}

export type UserSession = {
	id: string
	pixels: number
	reloadsAt?: number
	expiresAt: number
}
