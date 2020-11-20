import pickerIcon from '@/assets/picker-icon.png'
import { CanvasTool } from '@/store/modules/canvas'
import { useAppStore } from '@/utils/hooks'
import React from 'react'
import styled, { css, keyframes } from 'styled-components'

type Props = {
	x: number
	y: number
	mousePos: { x: number; y: number }
	zoom: number
	tool: CanvasTool
	animation?: string
}

export const Cursor = ({ x, y, zoom, tool, mousePos, animation }: Props) => {
	const colorIndex = useAppStore(state => state.canvas.selectedColor)
	const palette = useAppStore(state => state.canvas.palette)
	const color = palette[colorIndex]

	return (
		<ClickPreview
			style={{
				transform: `translate(${x}px, ${y}px)`,
				width: zoom,
				height: zoom
			}}
		>
			{animation && <ClickAnimation style={{ backgroundColor: color }} />}
			{tool === CanvasTool.Pick && (
				<Icon
					style={{
						transform: 'translate(-110%,-110%)'
					}}
				>
					<img src={pickerIcon} />
				</Icon>
			)}
			{zoom > 10 && (
				<Position
					style={{
						top: zoom,
						left: zoom * 1.5
					}}
				>
					{mousePos.x},{mousePos.y}
				</Position>
			)}
		</ClickPreview>
	)
}

const ClickPreview = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	pointer-events: none;
	box-sizing: border-box;
	border: 1px solid #000;
	pointer-events: none;
	box-sizing: border-box;
	user-select: none;
`

const Position = styled.div`
	text-shadow: 1px 1px 0 #000;
	color: #fff;
	position: absolute;
	font-size: 8px;
`

const Icon = styled.div`
	text-shadow: 1px 1px 0 #000;
	color: #fff;
	position: absolute;
`

const usedAnimation = keyframes`
	0% { transform: scale(1); opacity: 1; }
	100% { transform: scale(2); opacity: 0; }
`

const ClickAnimation = styled.div`
	animation-name: ${usedAnimation};
	animation-duration: 200ms;
	opacity: 0;
	box-sizing: border-box;
	width: 100%;
	height: 100%;
`
