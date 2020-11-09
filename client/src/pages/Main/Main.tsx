import { Loader } from '@/components'
import { useRest } from '@/context/RestContext'
import { useDocumentEvent } from '@/utils/hooks'
import { CanvasInfo } from '@shared/rest'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Controls } from './components/Controls'
import { PaintCanvas } from './components/PaintCanvas'

type Props = {}

export const Main = ({}: Props) => {
	const rest = useRest()
	const [info, setInfo] = useState(undefined as CanvasInfo | undefined)
	const [zoom, setZoom] = useState(3)
	const [color, setColor] = useState('#000000')

	useEffect(() => {
		rest.getCanvasInfo().then(info => setInfo(info))
	}, [])

	useDocumentEvent('wheel', (e: WheelEvent) => {
		if (e.deltaY > 0) {
			setZoom(zoom => Math.max(0.1, zoom * 0.85))
		} else {
			setZoom(zoom => Math.min(10, zoom * 1.25))
		}
	})

	return (
		<MainContainer>
			{info ? (
				<>
					<Controls color={color} setColor={setColor} />
					<PaintCanvas color={color} info={info} zoom={zoom} />
				</>
			) : (
				<Loader loaded={false} />
			)}
		</MainContainer>
	)
}

const MainContainer = styled.div`
	width: 100%;
	height: 100%;
	overflow: hidden;
	position: relative;
`
