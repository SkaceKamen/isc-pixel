import { setCanvasState } from '@/store/modules/canvas'
import { setSessionState } from '@/store/modules/session'
import { useAppDispatch, useAppStore, useInterval } from '@/utils/hooks'
import React, { useEffect, useState } from 'react'
import { HexColorInput, HexColorPicker } from 'react-colorful'
import styled from 'styled-components'

type Props = {
	onSessionRequested: () => void
}

export const Controls = ({ onSessionRequested }: Props) => {
	const dispatch = useAppDispatch()
	const session = useAppStore(state => state.session.id)
	const pixels = useAppStore(state => state.session.pixels)
	const reloadsAt = useAppStore(state => state.session.pixelsReloadAt)
	const color = useAppStore(state => state.canvas.color)
	const tool = useAppStore(state => state.canvas.tool)

	const [reloadsIn, setReloadsIn] = useState(0)

	const updateReload = () => {
		const reloadsIn = reloadsAt
			? Math.max(0, Math.round((reloadsAt.getTime() - Date.now()) / 1000))
			: 0

		setReloadsIn(reloadsIn)

		if (reloadsIn === 0 && pixels !== 10) {
			dispatch(setSessionState({ pixels: 10 }))
		}
	}

	useEffect(() => {
		updateReload()
	}, [pixels, reloadsAt])

	useInterval(() => {
		updateReload()
	}, 1000)

	const [picker, setPicker] = useState(false)

	const togglePicker = () => setPicker(picker => !picker)

	const handleColor = (color: string) => {
		setCanvasState({ color })
	}

	return (
		<C>
			{session ? (
				<>
					{picker && (
						<Picker>
							<HexColorPicker onChange={handleColor} color={color} />
							<HexColorInput onChange={handleColor} color={color} />
						</Picker>
					)}
					<ButtonsRow>
						<CurrentColor
							onClick={togglePicker}
							style={{ backgroundColor: color }}
						>
							<span>{reloadsIn === 0 ? 10 : pixels}</span>
						</CurrentColor>
						{reloadsIn > 0 && <ReloadsIn>Reloads in {reloadsIn} s</ReloadsIn>}
					</ButtonsRow>
				</>
			) : (
				<>
					<SessionButton onClick={() => onSessionRequested()}>
						Click here to start painting
					</SessionButton>
				</>
			)}
		</C>
	)
}

const C = styled.div`
	position: absolute;
	left: 0;
	bottom: 0;
	padding: 1rem;
	z-index: 1;
	background: rgb(0, 0, 0, 0.9);
`

const ButtonsRow = styled.div`
	display: flex;
	align-items: center;

	text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
		1px 1px 0 #000;
`

const Picker = styled.div`
	padding: 0.5rem;
	background: rgb(0, 0, 0, 0.9);
	color: #fff;
	border-radius: 8px;
	border-bottom-left-radius: 0;

	input {
		color: #fff;
		padding: 0.5rem;
		text-align: center;
		margin: auto;
		box-sizing: border-box;
		width: 200px;
	}
`

const CurrentColor = styled.div`
	width: 3rem;
	height: 3rem;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 2px solid #fff;
`

const ReloadsIn = styled.div`
	margin-left: 1rem;
`

const SessionButton = styled.div`
	cursor: pointer;

	&:hover {
		color: #fff;
	}
`
