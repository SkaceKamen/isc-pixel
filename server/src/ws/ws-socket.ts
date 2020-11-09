import { IncomingMessage } from 'http'
import { Socket } from 'net'
import WebSocket from 'ws'
import { AppContext } from '../context'
import { Pixel } from '../models/pixel'
import { WsClient } from './ws-client'

export class WsSocket {
	socket: WebSocket.Server
	clients = [] as WsClient[]
	context: AppContext

	constructor(context: AppContext) {
		this.context = context

		this.socket = new WebSocket.Server({ noServer: true })
		this.socket.on('connection', this.handleConnection)

		this.context.bus.newPixel.listen(this.handleNewPixel)
	}

	handleNewPixel = (pixel: Pixel) => {
		this.clients.forEach((client) => {
			client.socket.send(
				JSON.stringify({
					pixel,
				})
			)
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
	}

	handleRemove = (s: WebSocket) => {
		this.clients = this.clients.filter((c) => c.socket !== s)
	}
}
