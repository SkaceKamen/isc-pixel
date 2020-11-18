export type Pixel = {
	x: number
	y: number
	color: number
}

export type UserSessionInfo = {
	id: string
	pixels: number
	reloadsAt?: number
	expiresAt: number
}

export type ServerInfo = {
	users: number
}
