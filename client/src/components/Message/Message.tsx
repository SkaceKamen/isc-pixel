import React from 'react'
import styled, { css } from 'styled-components'

export type MessageType = 'info' | 'warn' | 'error' | 'success'

type Props = {
	message: React.ReactNode
	type?: MessageType
	header?: React.ReactNode
}

export const Message = ({ type = 'info', message, header }: Props) => {
	return (
		<MessageContainer>
			<MessageTitle type={type} header={!!header}>
				<span>{header ? header : message}</span>
			</MessageTitle>
			{header && <HeaderMessage>{message}</HeaderMessage>}
		</MessageContainer>
	)
}

const MessageContainer = styled.div`
	margin: 5px 0px 15px 0px;

	ul li {
		list-style-type: disc;
		margin-left: 20px;
	}

	code {
		background: #f5f5f5;
		padding: 0 5px;
		border-radius: 2px;
	}
`

const MessageTitle = styled.div<{ type: MessageType; header: boolean }>`
	${props => css`
		display: flex;
		align-items: center;
		justify-content: center;
		background: ${props.theme.colors.message[props.type].background};
		color: ${props.theme.colors.message[props.type].color};

		span {
			flex-grow: 1;
			padding: 8px 8px 8px 0;
		}
	`}
`

const HeaderMessage = styled.div`
	padding: 8px;
`
