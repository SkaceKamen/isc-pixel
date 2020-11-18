import { Button } from '@/components'
import { Modal } from '@/components/Modal/Modal'
import { colors } from '@/styles'
import { darken, lighten } from 'polished'
import React, { useState } from 'react'
import styled from 'styled-components'

type Props = {}

export const Welcome = ({}: Props) => {
	const [opened, setOpened] = useState(true)

	return (
		<Modal
			open={opened}
			header={<h2>Welcome to ISC Pixel</h2>}
			onClose={() => setOpened(false)}
			footer={close => <Button onClick={close}>Ok</Button>}
			bodyStyle={{
				width: '400px'
			}}
		>
			<p>Shared PixelArt canvas, inspired by /r/place</p>
			<Title>How it works?</Title>
			<p>
				You can paint whatever you want, but you can only paint one pixel per 5
				seconds and you can only use predefined set of colors.
			</p>
			<Title>Controls</Title>
			<ul>
				<li>
					<b>Left Mouse Button</b> - Paint
				</li>
				<li>
					<b>Right Mouse Button</b> - Move
				</li>
				<li>
					<b>Mouse Wheel</b> - Zoom in/out
				</li>
			</ul>
		</Modal>
	)
}

const Title = styled.h3`
	margin: 1rem 0 0.5rem 0;
	color: ${darken(0.2, colors.text)};
	font-size: 115%;
`
