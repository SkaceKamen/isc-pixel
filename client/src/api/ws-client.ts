import { MyEvent } from '@/utils/events'
import { Pixel, UserSessionInfo } from '@shared/models'
import { setSession, WsMessage, WsMessageType } from '@shared/ws'

export class WsClient {
	url: string
	session?: string

	socket?: WebSocket

	onOpen?: () => void
	onClose?: () => void
	onMessage?: (msg: WsMessage) => void

	onPixel = new MyEvent<Pixel>()
	onSession = new MyEvent<UserSessionInfo>()

	constructor(url: string, session?: string) {
		this.url = url
		this.session = session
	}

	connect() {
		if (this.socket) {
			this.socket.close()
			this.socket = undefined
		}

		this.socket = new WebSocket(this.url)

		this.socket.onopen = () => {
			if (this.session) {
				this.send(setSession(this.session))
			}

			this.onOpen?.()
		}

		this.socket.onclose = () => {
			this.onClose?.()
		}

		this.socket.onmessage = e => {
			const msg = JSON.parse(e.data) as WsMessage

			this.onMessage?.(msg)

			switch (msg.type) {
				case WsMessageType.NewPixel: {
					this.onPixel.emit(msg.pixel)
					break
				}

				case WsMessageType.SessionChange: {
					this.onSession.emit(msg.session)
					break
				}

				/*
				default: {
					throw new Error(
						`Unknown message type: ${msg.type} (${WsMessageType[msg.type]})`
					)
				}
				*/
			}
		}
	}

	send(msg: WsMessage) {
		if (!this.socket) {
			throw new Error("Can't send message: Socket not connected")
		}

		this.socket.send(JSON.stringify(msg))
	}

	disconnect() {
		if (this.socket) {
			this.socket.close()
			this.socket = undefined
		}
	}
}
