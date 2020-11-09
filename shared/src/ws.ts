export type Pixel = {
	x: number
	y: number
	color: number
}

export type WsMessage = {
	pixel?: Pixel
}
