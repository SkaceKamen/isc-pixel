import { Pixel, UserSession } from './models'

export enum WsMessageType {
	NewPixel,
	SessionChange,
	ChatMessage,
	SetSession,
}

export const newPixel = (pixel: Pixel) =>
	({
		type: WsMessageType.NewPixel,
		pixel,
	} as const)

export const sessionChange = (session: UserSession) =>
	({
		type: WsMessageType.SessionChange,
		session,
	} as const)

export const setSession = (session: string) =>
	({
		type: WsMessageType.SetSession,
		session,
	} as const)

export type WsMessage =
	| ReturnType<typeof newPixel>
	| ReturnType<typeof sessionChange>
	| ReturnType<typeof setSession>
