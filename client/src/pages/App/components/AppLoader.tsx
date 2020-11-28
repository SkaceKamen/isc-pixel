import React from 'react'
import styled, { keyframes } from 'styled-components'
import background from '@/assets/background.png'

type Props = {
	text?: string
}

export const AppLoader = ({ text }: Props) => {
	return (
		<C>
			<L>
				{[
					['#2E3091', 0] as const,
					['#EC008C', 1] as const,
					['#00AEEF', 3] as const,
					['#7AC143', 2] as const
				].map(([color, index]) => (
					<B
						key={color}
						style={{
							backgroundColor: color,
							animationDelay: `${index * 300}ms`
						}}
					/>
				))}
			</L>

			<span>{text ?? 'Loading ISC Pixel'}</span>
		</C>
	)
}

const PopAnim = keyframes`
	0% { opacity: 0.5; }
	20% { opacity: 1; }
	35% { opacity: 0.5; }
`

const L = styled.div`
	width: 128px;
	height: 128px;
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 1rem;
`

const B = styled.div`
	width: 50%;
	height: 50%;
	animation-name: ${PopAnim};
	animation-duration: 1200ms;
	animation-iteration-count: infinite;
	position: relative;
	z-index: 0;
	opacity: 0.5;
`

const C = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 2;
	background-image: url('${background}');
	flex-direction: column;
`
