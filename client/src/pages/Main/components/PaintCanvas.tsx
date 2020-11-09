import { getRestUrl } from '@/api/utils'
import { useRest } from '@/context/RestContext'
import { useWs } from '@/context/WsContext'
import { setApiState } from '@/store/modules/api'
import { intToRGBA } from '@/utils/color'
import { relativeMousePosition } from '@/utils/dom'
import { useAppDispatch, useAppStore } from '@/utils/hooks'
import { CanvasInfo } from '@shared/rest'
import { Pixel } from '@shared/ws'
import { off } from 'process'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

type Props = {
	info: CanvasInfo
	zoom: number
	color: string
}

export const PaintCanvas = ({ info, zoom, color }: Props) => {
	const rest = useRest()
	const ws = useWs()
	const dispatch = useAppDispatch()
	const pixels = useAppStore(state => state.api.sessionPixels)

	const dragRef = useRef({
		dragging: false,
		start: { x: 0, y: 0 }
	})

	const mouseRef = useRef({
		x: 0,
		y: 0,
		zoom
	})

	const [offset, setOffset] = useState({
		x: 0,
		y: 0
	})

	const [actualZoom, setActualZoom] = useState(zoom)

	const canvasRef = useRef<HTMLCanvasElement>(null)

	const handleClick = async (e: React.MouseEvent) => {
		if (pixels <= 0) {
			return
		}

		const pos = relativeMousePosition(e)
		const x = Math.floor(pos.x / zoom)
		const y = Math.floor(pos.y / zoom)

		const res = await rest.putPixel(x, y, parseInt(color.slice(1), 16))

		dispatch(
			setApiState({
				session: res.id,
				sessionPixels: res.pixels,
				sessionPixelsReloadAt: res.reloadsAt
					? new Date(res.reloadsAt)
					: undefined
			})
		)
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
			const color = intToRGBA(pixel.color * 0x100 + 0xff)
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
			image.src = `${getRestUrl()}${info.path}`
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
	}, [handlePixel])

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
			style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
		>
			<StyledCanvas
				style={{ transform: `scale(${actualZoom})` }}
				ref={canvasRef}
				onClick={handleClick}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
				onMouseMove={handleMouseMove}
				onContextMenu={blockContext}
			/>
		</CanvasContainer>
	)
}

const CanvasContainer = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
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
	cursor: crosshair;
`
