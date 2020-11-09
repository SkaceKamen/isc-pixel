type BusListener<Data> = (data: Data) => void

export class BusDispatcher<Data> {
	protected listeners = [] as BusListener<Data>[]

	dispatch(data: Data) {
		this.listeners.forEach((l) => l(data))
	}

	listen(listener: BusListener<Data>) {
		this.listeners.push(listener)

		return listener
	}

	stopListening(listener: BusListener<Data>) {
		const index = this.listeners.indexOf(listener)

		if (index < 0) {
			return false
		}

		this.listeners.splice(index, 1)
	}
}
