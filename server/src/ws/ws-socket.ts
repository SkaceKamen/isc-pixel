import { IncomingMessage } from 'http'
import { Socket } from 'net'
import { UserSessionInfo } from '@shared/models'
import WebSocket from 'ws'
import { AppContext } from '../context'
import { Pixel } from '@shared/models'
import { WsClient } from './ws-client'
import { newPixel, serverInfo, sessionChange } from '@shared/ws'

export class WsSocket {
	socket: WebSocket.Server
	clients = [] as WsClient[]
	context: AppContext

	constructor(context: AppContext) {
		this.context = context

		this.socket = new WebSocket.Server({ noServer: true })
		this.socket.on('connection', this.handleConnection)

		this.context.bus.newPixel.listen(this.handleNewPixel)
		this.context.bus.sessionChanged.listen(this.handleSessionChange)
	}

	handleNewPixel = (pixel: Pixel) => {
		this.clients.forEach((client) => {
			client.send(newPixel(pixel))
		})
	}

	handleSessionChange = (session: UserSessionInfo) => {
		this.clients.forEach((client) => {
			if (client.session === session.id) {
				client.send(sessionChange(session))
			}
		})
	}

	handleUpgrade = (
		request: IncomingMessage,
		socket: Socket,
		upgradeHead: Buffer
	) => {
		this.socket.handleUpgrade(request, socket, upgradeHead, (ws) => {
			this.socket.emit('connection', ws)
		})
	}

	handleConnection = (s: WebSocket) => {
		const client = new WsClient(this, s)
		s.onclose = () => this.handleRemove(s)
		this.clients.push(client)
		client.send(this.serverInfo())
	}

	handleRemove = (s: WebSocket) => {
		this.clients = this.clients.filter((c) => c.socket !== s)

		this.clients.forEach((c) => {
			c.send(this.serverInfo())
		})
	}

	serverInfo() {
		return serverInfo({
			users: this.clients.length,
		})
	}
}
