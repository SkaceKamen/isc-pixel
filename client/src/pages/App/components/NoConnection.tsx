import { Button } from '@/components'
import { Modal } from '@/components/Modal/Modal'
import { ApiState, setApiState } from '@/store/modules/api'
import { useAppDispatch } from '@/utils/hooks'
import React from 'react'

type Props = {}

export const NoConnection = ({}: Props) => {
	const dispatch = useAppDispatch()

	const handleReconnect = () => {
		dispatch(
			setApiState({
				state: ApiState.Connecting
			})
		)
	}

	return (
		<Modal
			open={true}
			allowClose={false}
			footer={<Button onClick={handleReconnect}>Reconnect</Button>}
		>
			<p>Failed to connect to server</p>
		</Modal>
	)
}
