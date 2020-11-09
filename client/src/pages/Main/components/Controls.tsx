import { SessionModal } from '@/pages/Main/components/SessionModal'
import { setApiState } from '@/store/modules/api'
import { useAppDispatch, useAppStore, useInterval } from '@/utils/hooks'
import React, { useEffect, useState } from 'react'
import { HexColorInput, HexColorPicker } from 'react-colorful'
import styled from 'styled-components'

type Props = {
	color: string
	setColor: (color: string) => void
}

export const Controls = ({ color, setColor }: Props) => {
	const dispatch = useAppDispatch()
	const session = useAppStore(state => state.api.session)
	const pixels = useAppStore(state => state.api.sessionPixels)
	const reloadsAt = useAppStore(state => state.api.sessionPixelsReloadAt)

	const [reloadsIn, setReloadsIn] = useState(0)
	const [sessionModal, setSessionModal] = useState(false)

	const updateReload = () => {
		const reloadsIn = reloadsAt
			? Math.max(0, Math.round((reloadsAt.getTime() - Date.now()) / 1000))
			: 0

		setReloadsIn(reloadsIn)

		if (reloadsIn === 0) {
			dispatch(
				setApiState({
					sessionPixels: 10
				})
			)
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

	return (
		<C>
			{session ? (
				<>
					{picker && (
						<Picker>
							<HexColorPicker onChange={setColor} color={color} />
							<HexColorInput onChange={setColor} color={color} />
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
					<SessionButton onClick={() => setSessionModal(true)}>
						Click here to start painting
					</SessionButton>
					{sessionModal && (
						<SessionModal onClose={() => setSessionModal(false)} />
					)}
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
