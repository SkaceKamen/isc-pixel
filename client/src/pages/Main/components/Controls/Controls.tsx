import { CanvasTool, setCanvasState } from '@/store/modules/canvas'
import {
	useAppDispatch,
	useAppStore,
	useInterval,
	useWindowEvent
} from '@/utils/hooks'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Palette } from './components/Palette'

type Props = {}

export const Controls = () => {
	const dispatch = useAppDispatch()
	const session = useAppStore(state => state.session.id)
	const pixels = useAppStore(state => state.session.pixels)
	const reloadsAt = useAppStore(state => state.session.pixelsReloadAt)

	const [reloadsIn, setReloadsIn] = useState(0)

	useWindowEvent('keydown', (e: KeyboardEvent) => {
		if (!e.repeat && e.key === 'Control') {
			dispatch(setCanvasState({ tool: CanvasTool.Pick }))
		}
	})

	useWindowEvent('keyup', (e: KeyboardEvent) => {
		if (e.key === 'Control') {
			dispatch(setCanvasState({ tool: CanvasTool.Paint }))
		}
	})

	const updateReload = () => {
		const reloadsIn = reloadsAt
			? Math.max(0, Math.ceil((reloadsAt.getTime() - Date.now()) / 1000))
			: 0

		setReloadsIn(reloadsIn)
	}

	useEffect(() => {
		updateReload()
	}, [pixels, reloadsAt])

	useInterval(() => {
		updateReload()
	}, 100)

	return (
		<C>
			{session ? (
				<>
					{reloadsIn > 0 && <ReloadsIn>Wait {reloadsIn} s</ReloadsIn>}
					<ButtonsRow>
						<Palette />
					</ButtonsRow>
				</>
			) : (
				<ButtonsRow>Click anywhere to start painting</ButtonsRow>
			)}
		</C>
	)
}

const C = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`

const ButtonsRow = styled.div`
	display: flex;
	align-items: center;
	border-radius: 5px;
	border-bottom-left-radius: 0;
	border-bottom-right-radius: 0;

	padding: 0.5rem;
	background: rgb(0, 0, 0, 0.75);
`

const ReloadsIn = styled.div`
	margin-bottom: 1rem;
	padding: 1rem;
	background: rgb(0, 0, 0, 0.5);
	border-radius: 5px;
`
