import { Loader } from '@/components'
import { useErrorHandler } from '@/context/ErrorHandlerContext'
import { useRest } from '@/context/RestContext'
import { setCanvasState } from '@/store/modules/canvas'
import { useAppDispatch, useAppStore, useDocumentEvent } from '@/utils/hooks'
import { CanvasInfo } from '@shared/rest'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { AppLoader } from '../App/components/AppLoader'
import { Controls } from './components/Controls/Controls'
import { PaintCanvas } from './components/PaintCanvas/PaintCanvas'
import { SessionModal } from './components/SessionModal'
import { Social } from './components/Social/Social'
import { Welcome } from './components/Welcome'

type Props = {}

export const Main = ({}: Props) => {
	const rest = useRest()

	const dispatch = useAppDispatch()
	const session = useAppStore(state => state.session.id)
	const { catchErrors } = useErrorHandler()

	const [info, setInfo] = useState(undefined as CanvasInfo | undefined)
	const [zoom, setZoom] = useState(3)
	const [sessionModal, setSessionModal] = useState(false)

	const handleSessionRequest = () => {
		setSessionModal(true)
	}

	useEffect(() => {
		catchErrors(rest.getCanvasInfo()).then(info => {
			if (info) {
				dispatch(
					setCanvasState({
						width: info.width,
						height: info.height,
						palette: info.palette.map(c => c.toLowerCase())
					})
				)

				setInfo(info)
			}
		})
	}, [])

	useDocumentEvent('wheel', (e: WheelEvent) => {
		if (e.deltaY > 0) {
			setZoom(zoom => Math.max(0.1, zoom * 0.85))
		} else {
			setZoom(zoom => Math.min(20, zoom * 1.25))
		}
	})

	return (
		<MainContainer>
			{info ? (
				<>
					<ScreenCenter>
						<Flexed>
							<Small style={{ marginLeft: 'auto' }}>
								<Welcome />
							</Small>
							<Big>
								<Controls />
							</Big>
							<Small style={{ marginRight: 'auto' }}>
								<Social />
							</Small>
						</Flexed>
					</ScreenCenter>
					<PaintCanvas
						info={info}
						zoom={zoom}
						onSessionRequested={handleSessionRequest}
					/>
					{!session && sessionModal && (
						<SessionModal onClose={() => setSessionModal(false)} />
					)}
				</>
			) : (
				<AppLoader />
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

const ScreenCenter = styled.div`
	position: absolute;
	bottom: 0;
	left: 50%;
	width: 700px;
	margin-left: -350px;
	z-index: 1;
`

const Flexed = styled.div`
	display: flex;
	align-items: flex-end;
`

const Small = styled.div`
	flex: 1;
`

const Big = styled.div`
	margin: 0 1rem;
`
