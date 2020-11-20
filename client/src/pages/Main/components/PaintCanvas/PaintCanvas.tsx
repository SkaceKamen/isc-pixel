import { getRestUrl } from '@/api/utils'
import background from '@/assets/background.png'
import { useErrorHandler } from '@/context/ErrorHandlerContext'
import { useRest } from '@/context/RestContext'
import { useWs } from '@/context/WsContext'
import { CanvasTool, setCanvasState } from '@/store/modules/canvas'
import { setSessionState } from '@/store/modules/session'
import { hexToRgb } from '@/utils/color'
import { relativeMousePosition } from '@/utils/dom'
import {
	useAnimation,
	useAppDispatch,
	useAppStore,
	useWindowEvent
} from '@/utils/hooks'
import { Pixel } from '@shared/models'
import { CanvasInfo } from '@shared/rest'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useCanvas } from './canvas'
import { Cursor } from './components/Cursor'
import { SideText } from './components/SideText'

type Props = {
	info: CanvasInfo
	zoom: number
	onSessionRequested: () => void
}

export const PaintCanvas = ({ info, zoom, onSessionRequested }: Props) => {
	const rest = useRest()
	const ws = useWs()
	const dispatch = useAppDispatch()
	const { catchErrors } = useErrorHandler()

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

	const [dragging, setDragging] = useState(false)
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

	const [offset, setOffset] = useState({
		x: window.innerWidth / 2 - info.width / 2,
		y: window.innerHeight / 2 - info.height / 2
	})

	const [actualZoom, setActualZoom] = useState(zoom)

	const anim = useAnimation('click-animation', 200)

	const canvasRef = useRef<HTMLCanvasElement>(null)
	const canvas = useCanvas(canvasRef)

	// Calculate pixel index at specified position
	const paletteIndexAt = (x: number, y: number) => {
		return canvas.colorIndexAt(x, y, palette)
	}

	// User clicked canvas
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

				anim.trigger()

				const res = await catchErrors(() => rest.putPixel(x, y, selectedColor))

				if (res) {
					dispatch(
						setSessionState({
							id: res.id,
							pixels: res.pixels,
							pixelsReloadAt: res.reloadsAt
								? new Date(res.reloadsAt)
								: undefined
						})
					)
				}

				break
			}
		}
	}

	// Dragging handler - mouse down
	const handleMouseDown = (e: React.MouseEvent) => {
		if (e.button === 2 || e.button === 1) {
			setDragging(true)

			dragRef.current = {
				dragging: true,
				start: {
					x: -offset.x + e.clientX,
					y: -offset.y + e.clientY
				}
			}
		}
	}

	// Dragging handler - mouse up
	useWindowEvent('mouseup', (e: MouseEvent) => {
		if (e.button === 2 || e.button === 1) {
			setDragging(false)

			dragRef.current = {
				dragging: false,
				start: {
					x: 0,
					y: 0
				}
			}
		}
	})

	// Dragging and mouse position handler
	const handleMouseMove = (e: React.MouseEvent) => {
		const pos = relativeMousePosition(e)
		const x = Math.floor(pos.x / zoom)
		const y = Math.floor(pos.y / zoom)

		if (e.target instanceof HTMLCanvasElement) {
			mouseRef.current = {
				...mouseRef.current,
				x,
				y
			}

			setMousePos({ x, y })
		}

		if (dragRef.current.dragging) {
			setOffset({
				x: e.clientX - dragRef.current.start.x,
				y: e.clientY - dragRef.current.start.y
			})
		}
	}

	// Stop context menu - handled in mouseDown
	const blockContext = (e: React.MouseEvent) => {
		e.preventDefault()
	}

	// Handle new pixels from WS
	const handlePixel = useCallback(
		(pixel: Pixel) => {
			const color = hexToRgb(palette[pixel.color].substr(1))
			canvas.setPixel(pixel.x, pixel.y, color)
		},
		[canvas]
	)

	// Load the initial canvas
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

	// Hook the pixel handler
	useEffect(() => {
		ws.onPixel.on(handlePixel)

		return () => {
			ws.onPixel.off(handlePixel)
		}
	}, [handlePixel, ws])

	// Move the canvas to compensate zooming
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
		<CanvasContainer
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onContextMenu={blockContext}
			style={{
				backgroundPosition: `${offset.x}px ${offset.y}px`,
				backgroundSize: `${(actualZoom / 1) * 128}px ${(actualZoom / 1) *
					128}px`
			}}
		>
			<Translate
				style={{
					transform: `translate(${offset.x}px, ${offset.y}px)`,
					width: info.width,
					height: info.height
				}}
			>
				<Scale
					className="pixel-perfect"
					style={{
						transform: `scale(${actualZoom})`,
						width: info.width,
						height: info.height,
						cursor: dragging ? 'move' : undefined
					}}
					onClick={handleClick}
				>
					<StyledCanvas className="pixel-perfect" ref={canvasRef} />
					<SideText />
				</Scale>
				<Cursor
					x={info.width / 2 + (mousePos.x - info.width / 2) * actualZoom}
					y={info.height / 2 + (mousePos.y - info.height / 2) * actualZoom}
					zoom={actualZoom}
					mousePos={mousePos}
					tool={tool}
					animation={anim.className}
				/>
			</Translate>
		</CanvasContainer>
	)
}

const CanvasContainer = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
	user-select: none;
	background: url('${background}');
`

const Translate = styled.div`
	position: relative;
`

const Scale = styled.div`
	cursor: crosshair;
	box-shadow: 0px 0px 10px #333;
`

const StyledCanvas = styled.canvas``
