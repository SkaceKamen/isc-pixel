export type Pixel = {
	x: number
	y: number
	color: number
}

export type UserSessionInfo = {
	id: string
	pixels: number
	reloadsIn?: number
	expiresAt: string
}

export type ServerInfo = {
	users: number
}
