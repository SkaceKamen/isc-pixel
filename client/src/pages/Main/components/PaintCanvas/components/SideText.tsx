import { Button } from '@/components'
import React from 'react'
import styled from 'styled-components'

type Props = {
	onDownload: () => void
}

export const SideText = ({ onDownload }: Props) => {
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

			<Buttons>
				<Button schema="secondary" onClick={onDownload}>
					&#10515; Download
				</Button>
			</Buttons>
		</C>
	)
}

const C = styled.div`
	position: absolute;
	left: 100%;
	top: 0;
	width: 100%;
	height: 100%;
	color: #fff;
	padding-left: 1rem;
	display: flex;
	flex-direction: column;
`

const NoStyleList = styled.ul`
	list-style-type: none;
`

const Buttons = styled.div`
	margin-top: auto;
	padding-bottom: 1rem;
`
