import { MyEvent } from '@/utils/events'
import { Pixel, WsMessage } from '@shared/ws'

export class WsClient {
	url: string

	socket?: WebSocket

	onOpen?: () => void
	onClose?: () => void
	onMessage?: (msg: WsMessage) => void

	onPixel = new MyEvent<Pixel>()

	constructor(url: string) {
		this.url = url
	}

	connect() {
		if (this.socket) {
			this.socket.close()
			this.socket = undefined
		}

		this.socket = new WebSocket(this.url)

		this.socket.onopen = () => {
			this.onOpen?.()
		}

		this.socket.onclose = () => {
			this.onClose?.()
		}

		this.socket.onmessage = e => {
			const msg = JSON.parse(e.data) as WsMessage

			this.onMessage?.(msg)

			if (msg.pixel) {
				this.onPixel.emit(msg.pixel)
			}
		}
	}

	disconnect() {
		if (this.socket) {
			this.socket.close()
			this.socket = undefined
		}
	}
}
