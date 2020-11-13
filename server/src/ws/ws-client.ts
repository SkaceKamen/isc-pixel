import { WsMessage, WsMessageType } from '@shared/ws'
import WebSocket, { MessageEvent } from 'ws'
import { WsSocket } from './ws-socket'

export class WsClient {
	parent: WsSocket
	socket: WebSocket
	session?: string

	constructor(parent: WsSocket, socket: WebSocket) {
		this.parent = parent
		this.socket = socket

		this.socket.onmessage = this.handleMessage
	}

	handleMessage = (msg: MessageEvent) => {
		try {
			const data = msg.data

			if (typeof data !== 'string') {
				throw new Error('Only strings are accepted')
			}

			const message = JSON.parse(data) as WsMessage

			switch (message.type) {
				case WsMessageType.SetSession: {
					this.session = message.session
					break
				}
			}
		} catch (e) {
			console.error('Failed to parse user message')
			console.error(e)
		}
	}

	send(msg: WsMessage) {
		this.socket.send(JSON.stringify(msg))
	}
}
