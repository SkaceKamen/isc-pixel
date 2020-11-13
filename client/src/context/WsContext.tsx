import { getWebsocketUrl } from '@/api/utils'
import { WsClient } from '@/api/ws-client'
import { ApiState, setApiState } from '@/store/modules/api'
import { useAppStore } from '@/utils/hooks'
import React, { useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

export const WsContext = React.createContext<WsClient | null>(null)

export const WsContextProvider = ({
	children
}: {
	children: React.ReactNode
}) => {
	const dispatch = useDispatch()
	const state = useAppStore(state => state.api.state)
	const session = useAppStore(state => state.session.id)
	const [reconnectCount, setReconnectCount] = useState(0)
	const [client, setClient] = useState(null as WsClient | null)

	useEffect(() => {
		if (state === ApiState.Connecting || session !== client?.session) {
			if (client) {
				client.onClose = undefined
				client.onOpen = undefined
				client.disconnect()
			}

			setClient(new WsClient(getWebsocketUrl(), session))
		}
	}, [state, session])

	useEffect(() => {
		if (client) {
			client.connect()

			client.onOpen = () => {
				setReconnectCount(0)

				if (session) {
					client.send
				}

				dispatch(
					setApiState({
						state: ApiState.Connected
					})
				)
			}

			client.onClose = () => {
				if (reconnectCount < 5) {
					dispatch(
						setApiState({
							state: ApiState.Connecting
						})
					)

					setReconnectCount(reconnectCount + 1)

					setTimeout(() => {
						client.connect()
					}, 100 + reconnectCount * 300)
				} else {
					dispatch(
						setApiState({
							state: ApiState.Error
						})
					)
				}
			}
		}
	}, [client])

	return (
		<WsContext.Provider value={client as WsClient}>
			{children}
		</WsContext.Provider>
	)
}

export const useWs = () => {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return useContext(WsContext)!
}
