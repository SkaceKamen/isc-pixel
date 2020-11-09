import { Session } from '../sessions'
import WebSocket from 'ws'
import { WsSocket } from './ws-socket'

export class WsClient {
	parent: WsSocket
	socket: WebSocket
	session?: Session

	constructor(parent: WsSocket, socket: WebSocket) {
		this.parent = parent
		this.socket = socket
	}

	setSession(session: Session) {
		this.session = session
	}
}
