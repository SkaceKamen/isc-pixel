import { Button } from '@/components'
import { Modal } from '@/components/Modal/Modal'
import { colors } from '@/styles'
import { darken } from 'polished'
import React, { useState } from 'react'
import styled from 'styled-components'
import discordLogo from '@/assets/discord.svg'
import iscLogo from '@/assets/isc.svg'

type Props = {}

export const Welcome = ({}: Props) => {
	const [opened, setOpened] = useState(true)

	return (
		<>
			<OpenButton
				onMouseDownCapture={e => {
					e.nativeEvent.preventDefault()
					e.nativeEvent.stopPropagation()
					e.preventDefault()
					e.stopPropagation()
					setOpened(true)
				}}
			>
				Help &amp; Info
			</OpenButton>
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
					You can paint whatever you want, but you can only paint one pixel per
					5 seconds and you can only use predefined set of colors.
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

				<Title>Communication</Title>
				<p>We have a Discord server! You can chat there.</p>

				<Brands>
					<BrandLink href="https://discord.gg/Db87jMczMb">
						<img src={discordLogo} title="Discord invite link" />
					</BrandLink>
					<BrandLink href="https://isc.cvut.cz">
						<img src={iscLogo} title="ISC Webpage" />
					</BrandLink>
				</Brands>
			</Modal>
		</>
	)
}

const Title = styled.h3`
	margin: 1rem 0 0.5rem 0;
	color: ${darken(0.2, colors.text)};
	font-size: 115%;
`

const OpenButton = styled.div`
	background: rgba(0, 0, 0, 0.75);
	padding: 0.5rem;
	cursor: pointer;
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;
	text-align: center;
`

const Brands = styled.div`
	display: flex;
	align-items: center;
`

const BrandLink = styled.a`
	flex: 1;
	margin: 0 0.5rem;
`
