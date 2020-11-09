import WebSocket from 'ws'
import { WsSocket } from './ws-socket'

export class WsClient {
	parent: WsSocket
	socket: WebSocket

	constructor(parent: WsSocket, socket: WebSocket) {
		this.parent = parent
		this.socket = socket
	}
}
