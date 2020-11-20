import React from 'react'
import styled from 'styled-components'

type Props = {}

export const SideText = ({}: Props) => {
	return (
		<C>
			<h3>Controls</h3>
			<NoStyleList>
				<li>
					<b>Left Mouse Button</b> - Paint
				</li>
				<li>
					<b>Right Mouse Button</b> - Move
				</li>
				<li>
					<b>Mouse Wheel</b> - Zoom in/out
				</li>
			</NoStyleList>

			<h3>Rules</h3>
			<NoStyleList>
				<li>Don&apos;t be an ass</li>
			</NoStyleList>
		</C>
	)
}

const C = styled.div`
	position: absolute;
	left: 100%;
	top: 0;
	width: 100%;
	color: #fff;
	padding-left: 1rem;
`

const NoStyleList = styled.ul`
	list-style-type: none;
`
