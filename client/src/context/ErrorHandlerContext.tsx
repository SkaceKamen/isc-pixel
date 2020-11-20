import { InvalidResponseError } from '@/api/rest-client'
import { setApiError } from '@/store/modules/api'
import { setSessionState } from '@/store/modules/session'
import { useAppDispatch } from '@/utils/hooks'
import React, { useCallback, useContext } from 'react'

type Handler = {
	catchErrors: <T>(cb: () => Promise<T>) => Promise<T | undefined>
}

export const ErrorHandlerContext = React.createContext<Handler | null>(null)

export const ErrorHandlerContextProvider = ({
	children
}: {
	children: React.ReactNode
}) => {
	const dispatch = useAppDispatch()

	const catchErrors = useCallback(async <T,>(cb: () => Promise<T>) => {
		try {
			return await cb()
		} catch (e) {
			if (e instanceof InvalidResponseError) {
				if (e.res.status === 401) {
					dispatch(
						setSessionState({
							id: undefined
						})
					)

					return undefined
				}
			}

			dispatch(setApiError(e.message))

			return undefined
		}
	}, [])

	return (
		<ErrorHandlerContext.Provider value={{ catchErrors }}>
			{children}
		</ErrorHandlerContext.Provider>
	)
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useErrorHandler = () => useContext(ErrorHandlerContext)!
