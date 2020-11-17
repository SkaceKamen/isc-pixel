import { setCanvasState } from '@/store/modules/canvas'
import { useAppDispatch, useAppStore } from '@/utils/hooks'
import React from 'react'
import styled, { css } from 'styled-components'

type Props = {}

export const Palette = ({}: Props) => {
	const dispatch = useAppDispatch()

	const selected = useAppStore(state => state.canvas.selectedColor)
	const palette = useAppStore(state => state.canvas.palette)

	return (
		<C>
			{palette.map((f, i) => (
				<Favourite
					selected={i === selected}
					key={i}
					style={{ backgroundColor: f }}
					onClick={() => {
						dispatch(setCanvasState({ selectedColor: i }))
					}}
				/>
			))}
		</C>
	)
}

const C = styled.div`
	display: flex;
	flex-wrap: wrap;
	width: 256px;
	background: #fff;
	padding: 1px;
`

const Favourite = styled.div<{ selected: boolean }>`
	position: relative;
	width: 32px;
	height: 32px;
	box-sizing: border-box;
	border: 1px solid #fff;

	${props =>
		props.selected &&
		css`
			position: relative;
			transform: scale(1.25);
			box-shadow: 1px 1px 3px #333;
			z-index: 1;
		`}
`
