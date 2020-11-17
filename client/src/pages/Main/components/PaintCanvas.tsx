import { getRestUrl } from '@/api/utils'
import { useRest } from '@/context/RestContext'
import { useWs } from '@/context/WsContext'
import { CanvasTool, setCanvasState } from '@/store/modules/canvas'
import { setSessionState } from '@/store/modules/session'
import { hexToRgb, intToRGBA, rgbToHex } from '@/utils/color'
import { relativeMousePosition } from '@/utils/dom'
import { useAppDispatch, useAppStore } from '@/utils/hooks'
import { CanvasInfo } from '@shared/rest'
import { Pixel } from '@shared/models'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import pickerIcon from '@/assets/picker-icon.png'

type Props = {
	info: CanvasInfo
	zoom: number
	onSessionRequested: () => void
}

export const PaintCanvas = ({ info, zoom, onSessionRequested }: Props) => {
	const rest = useRest()
	const ws = useWs()
	const dispatch = useAppDispatch()

	const session = useAppStore(state => state.session.id)
	const pixels = useAppStore(state => state.session.pixels)
	const selectedColor = useAppStore(state => state.canvas.selectedColor)
	const tool = useAppStore(state => state.canvas.tool)
	const palette = useAppStore(state => state.canvas.palette)

	const dragRef = useRef({
		dragging: false,
		start: { x: 0, y: 0 }
	})

	const mouseRef = useRef({
		x: 0,
		y: 0,
		zoom
	})

	const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

	const [offset, setOffset] = useState({
		x: 0,
		y: 0
	})

	const [actualZoom, setActualZoom] = useState(zoom)

	const canvasRef = useRef<HTMLCanvasElement>(null)

	const paletteIndexAt = (x: number, y: number) => {
		if (!canvasRef.current) {
			console.warn('Palette index requested before canvas is initialized')

			return -1
		}

		const ctx = canvasRef.current.getContext('2d')

		if (!ctx) {
			throw new Error('Failed to get 2D context')
		}

		const data = ctx.getImageData(x, y, 1, 1).data
		const color = '#' + rgbToHex(data[0], data[1], data[2])
		const index = palette.indexOf(color)

		if (index < 0) {
			console.warn('Color', color, 'has no index in palette', palette)
		}

		return index
	}

	const handleClick = async (e: React.MouseEvent) => {
		if (!session) {
			onSessionRequested()
		}

		const pos = relativeMousePosition(e)
		const x = Math.floor(pos.x / zoom)
		const y = Math.floor(pos.y / zoom)

		switch (tool) {
			case CanvasTool.Pick: {
				const index = paletteIndexAt(x, y)

				if (index >= 0) {
					dispatch(setCanvasState({ selectedColor: index }))
				}

				break
			}

			case CanvasTool.Paint: {
				if (pixels <= 0 || paletteIndexAt(x, y) === selectedColor) {
					return
				}

				const res = await rest.putPixel(x, y, selectedColor)

				dispatch(
					setSessionState({
						id: res.id,
						pixels: res.pixels,
						pixelsReloadAt: res.reloadsAt ? new Date(res.reloadsAt) : undefined
					})
				)

				break
			}
		}
	}

	const handleMouseDown = (e: React.MouseEvent) => {
		if (e.button === 2) {
			dragRef.current = {
				dragging: true,
				start: {
					x: -offset.x + e.clientX,
					y: -offset.y + e.clientY
				}
			}
		}
	}

	const handleMouseUp = (e: React.MouseEvent) => {
		if (e.button === 2) {
			dragRef.current = {
				dragging: false,
				start: {
					x: 0,
					y: 0
				}
			}
		}
	}

	const handleMouseMove = (e: React.MouseEvent) => {
		const pos = relativeMousePosition(e)
		const x = Math.floor(pos.x / zoom)
		const y = Math.floor(pos.y / zoom)

		mouseRef.current = {
			...mouseRef.current,
			x,
			y
		}

		setMousePos({ x, y })

		if (dragRef.current.dragging) {
			setOffset({
				x: e.clientX - dragRef.current.start.x,
				y: e.clientY - dragRef.current.start.y
			})
		}
	}

	const blockContext = (e: React.MouseEvent) => {
		e.preventDefault()
	}

	const handlePixel = useCallback((pixel: Pixel) => {
		const ctx = canvasRef.current?.getContext('2d')

		if (ctx) {
			const color = hexToRgb(palette[pixel.color].substr(1))
			const id = ctx.createImageData(1, 1)
			const d = id.data
			d[0] = color.r
			d[1] = color.g
			d[2] = color.b
			d[3] = 255
			ctx.putImageData(id, pixel.x, pixel.y)
		}
	}, [])

	useEffect(() => {
		if (canvasRef.current) {
			const canvas = canvasRef.current

			canvas.width = info.width
			canvas.height = info.height

			const image = document.createElement('img')
			image.crossOrigin = 'anonymous'
			image.src = `${getRestUrl()}${info.path}?t=${Date.now()}`
			image.className = 'image'

			image.onload = () => {
				canvas.getContext('2d')?.drawImage(image, 0, 0)
			}
		}
	}, [info])

	useEffect(() => {
		ws.onPixel.on(handlePixel)

		return () => {
			ws.onPixel.off(handlePixel)
		}
	}, [handlePixel, ws])

	useEffect(() => {
		const mouse = mouseRef.current
		const diff = zoom - mouse.zoom

		mouse.zoom = zoom

		setOffset({
			x: offset.x + (info.width / 2 - mouse.x) * diff,
			y: offset.y + (info.height / 2 - mouse.y) * diff
		})

		setActualZoom(zoom)
	}, [zoom])

	return (
		<CanvasContainer>
			<Translate
				style={{
					transform: `translate(${offset.x}px, ${offset.y}px)`,
					width: info.width,
					height: info.height
				}}
			>
				<Scale
					style={{
						transform: `scale(${actualZoom})`,
						width: info.width,
						height: info.height
					}}
					onClick={handleClick}
					onMouseDown={handleMouseDown}
					onMouseUp={handleMouseUp}
					onMouseMove={handleMouseMove}
					onContextMenu={blockContext}
				>
					<StyledCanvas ref={canvasRef} />
				</Scale>
				<ClickPreview
					style={{
						transform: `translate(
							${info.width / 2 + (mousePos.x - info.width / 2) * actualZoom}px,
							${info.height / 2 + (mousePos.y - info.height / 2) * actualZoom}px)`,
						width: zoom,
						height: zoom
					}}
				>
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
			</Translate>
		</CanvasContainer>
	)
}

const CanvasContainer = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
`

const Translate = styled.div`
	position: relative;
`

const Scale = styled.div`
	cursor: crosshair;
	image-rendering: optimizeSpeed;
	-ms-interpolation-mode: nearest-neighbor;
	image-rendering: -webkit-optimize-contrast;
	image-rendering: -webkit-crisp-edges;
	image-rendering: -moz-crisp-edges;
	image-rendering: -o-crisp-edges;
	image-rendering: pixelated;
	image-rendering: crisp-edges;
`

const StyledCanvas = styled.canvas`
	image-rendering: optimizeSpeed;
	-ms-interpolation-mode: nearest-neighbor;
	image-rendering: -webkit-optimize-contrast;
	image-rendering: -webkit-crisp-edges;
	image-rendering: -moz-crisp-edges;
	image-rendering: -o-crisp-edges;
	image-rendering: pixelated;
	image-rendering: crisp-edges;
`

const ClickPreview = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	border: 1px solid #000;
	pointer-events: none;
	box-sizing: border-box;
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
