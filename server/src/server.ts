import { createServer, IncomingMessage } from 'http'
import { Socket } from 'net'
import { AppContext } from './context'
import { WsSocket } from './ws/ws-socket'

export const attachWsServer = (
	app: Express.Application,
	context: AppContext
) => {
	const server = createServer(app)
	const wsSocket = new WsSocket(context)

	server.on(
		'upgrade',
		async (request: IncomingMessage, socket: Socket, head: Buffer) => {
			wsSocket.handleUpgrade(request, socket, head)
		}
	)

	return server
}
