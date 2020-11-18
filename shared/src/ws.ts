import { Pixel, ServerInfo, UserSessionInfo } from './models'

export enum WsMessageType {
	NewPixel,
	SessionChange,
	IncomingChatMessage,
	SendChatMessage,
	SetSession,
	ServerInfo,
}

export const newPixel = (pixel: Pixel) =>
	({
		type: WsMessageType.NewPixel,
		pixel,
	} as const)

export const sessionChange = (session: UserSessionInfo) =>
	({
		type: WsMessageType.SessionChange,
		session,
	} as const)

export const setSession = (session: string) =>
	({
		type: WsMessageType.SetSession,
		session,
	} as const)

export const serverInfo = (info: ServerInfo) =>
	({
		type: WsMessageType.ServerInfo,
		info,
	} as const)

export const sendChatMessage = (message: string) =>
	({
		type: WsMessageType.SendChatMessage,
		message,
	} as const)

export const incomingChatMessage = (from: string, message: string) =>
	({
		type: WsMessageType.IncomingChatMessage,
		from,
		message,
	} as const)

export type WsMessage =
	| ReturnType<typeof newPixel>
	| ReturnType<typeof sessionChange>
	| ReturnType<typeof setSession>
	| ReturnType<typeof serverInfo>
	| ReturnType<typeof incomingChatMessage>
	| ReturnType<typeof sendChatMessage>
