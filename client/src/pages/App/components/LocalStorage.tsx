import { useErrorHandler } from '@/context/ErrorHandlerContext'
import { useRest } from '@/context/RestContext'
import { setCanvasState } from '@/store/modules/canvas'
import { setSessionState } from '@/store/modules/session'
import { useAppDispatch, useAppStore } from '@/utils/hooks'
import React, { useEffect } from 'react'

type Props = {}

const SESSION_KEY = 'isc-pixel-session'
const CANVAS_KEY = 'isc-pixel-canvas'

export const LocalStorage = ({}: Props) => {
	const dispatch = useAppDispatch()
	const rest = useRest()

	const session = useAppStore(state => state.session.id)
	const selectedColor = useAppStore(state => state.canvas.selectedColor)
	const { catchErrors } = useErrorHandler()

	useEffect(() => {
		const sessionStored = localStorage.getItem(SESSION_KEY)

		if (sessionStored) {
			catchErrors(() => rest.getSession(sessionStored)).then(info => {
				if (info) {
					dispatch(
						setSessionState({
							id: sessionStored,
							pixels: info.pixels,
							pixelsReloadAt: info.reloadsAt
								? new Date(info.reloadsAt)
								: undefined
						})
					)
				}
			})
		}

		const canvasStored = localStorage.getItem(CANVAS_KEY)

		if (canvasStored) {
			try {
				const { selectedColor } = JSON.parse(canvasStored)

				dispatch(setCanvasState({ selectedColor }))
			} catch (e) {
				console.error('Failed to load stored canvas options', e)
			}
		}
	}, [])

	useEffect(() => {
		localStorage.setItem(CANVAS_KEY, JSON.stringify({ selectedColor }))
	}, [selectedColor])

	useEffect(() => {
		localStorage.setItem(SESSION_KEY, session ?? '')
	}, [session])

	return <></>
}
