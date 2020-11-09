import { RestClient } from '@/api/rest-client'
import { getRestUrl } from '@/api/utils'
import { useAppStore } from '@/utils/hooks'
import React, { useContext, useMemo } from 'react'

export const RestContext = React.createContext<RestClient | null>(null)

export const RestContextProvider = ({
	children
}: {
	children: React.ReactNode
}) => {
	const session = useAppStore(state => state.api.session)
	const client = useMemo(() => new RestClient(getRestUrl(), session), [session])

	return <RestContext.Provider value={client}>{children}</RestContext.Provider>
}

export const useRest = () => {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return useContext(RestContext)!
}
