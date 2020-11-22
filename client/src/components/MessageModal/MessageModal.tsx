import React, { useState } from 'react'
import { Modal } from '../Modal/Modal'
import { Button } from '../Button/Button'
import styled from 'styled-components'
import { colors } from '@/styles'

type MessageModalType = 'info' | 'warn' | 'error'

export const MessageModal = ({
	title,
	type,
	message,
	opened,
	onClose
}: {
	title: string
	type: MessageModalType
	message: string
	opened?: boolean
	onClose?: () => void
}) => {
	const [open, setOpen] = useState(true)
	const handleClose = () => setOpen(false)

	return (
		<Modal
			header={
				<Header>
					<span>{title}</span>
				</Header>
			}
			bodyStyle={{ paddingTop: '1rem' }}
			headerStyle={{
				background: colors.message[type].background,
				color: colors.message[type].color
			}}
			footer={
				<Button onClick={onClose ?? handleClose} schema="primary">
					OK
				</Button>
			}
			open={opened ?? open}
			onClose={onClose ?? handleClose}
			contentStyle={{ width: 400, border: '0' }}
		>
			{message}
		</Modal>
	)
}

const Header = styled.div`
	font-size: 14px;
	text-align: left;
	display: flex;
	align-items: center;

	> span {
		margin-left: 10px;
	}
`
