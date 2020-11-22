import React from 'react'
import styled, { keyframes, css } from 'styled-components'

interface Props {
	loaded: boolean
	message?: string
	absolute?: boolean
}

const getInnerSpinners = () => {
	const rows = []

	for (let i = 0; i < 12; i++) {
		rows.push(<SpinnerDiv key={i} rotate={30 * i} delay={1.1 - i * 0.1} />)
	}

	return rows
}

export const Loader = ({ loaded, message, absolute }: Props) => (
	<>
		{!loaded && (
			<Container absolute={!!absolute}>
				<Spinner>{getInnerSpinners()}</Spinner>
				{message && <Message>{message}</Message>}
			</Container>
		)}
	</>
)

const Container = styled.div<{ absolute: boolean }>`
	${props =>
		props.absolute &&
		css`
			position: absolute;
			top: 0px;
			left: 0px;
			width: 100%;
			height: 100%;
			background: rgba(255, 255, 255, 0.8);
			display: flex;
			justify-content: center;
			align-items: center;

			z-index: 3;
		`}
`

const Spinner = styled.div`
	color: #eee;
	text-align: center;
	position: relative;
	margin: auto;
	width: 64px;
	height: 64px;
`

const spinnerKeyframes = keyframes`
	from {
		opacity: 1;
	}
	to {
		opacity: 0;
	}
`

const SpinnerDiv = styled.div<{ rotate: number; delay: number }>`
	transform-origin: 32px 32px;
	animation: ${spinnerKeyframes} 1.2s linear infinite;
	transform: rotate(${props => props.rotate}deg);
	animation-delay: -${props => props.delay}s;

	&:after {
		content: ' ';
		display: block;
		position: absolute;
		top: 3px;
		left: 29px;
		width: 5px;
		height: 14px;
		border-radius: 20%;
		background-color: #eee;
		box-shadow: 0px 0px 5px 0px rgba(200, 200, 200, 0.1);
	}
`

const Message = styled.div``
