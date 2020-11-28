import { ApiState } from '@/store/modules/api'
import { colors } from '@/styles'
import { GlobalStyle } from '@/styles/global'
import { useAppStore } from '@/utils/hooks'
import React from 'react'
import styled from 'styled-components'
import { Main } from '../Main/Main'
import { ApiErrorMessage } from './components/ApiErrorMessage'
import { AppLoader } from './components/AppLoader'
import { LocalStorage } from './components/LocalStorage'
import { NoConnection } from './components/NoConnection'

export const App = () => {
	const apiState = useAppStore(state => state.api.state)

	const isConnecting =
		apiState === ApiState.Reconnecting || apiState === ApiState.Connecting

	return (
		<AppContainer>
			<GlobalStyle />

			<LocalStorage />

			{apiState !== ApiState.Error && <Main />}

			{apiState === ApiState.Error && <NoConnection />}

			{isConnecting && <AppLoader text="Connecting..." />}

			<ApiErrorMessage />
		</AppContainer>
	)
}

const AppContainer = styled.div`
	width: 100%;
	height: 100%;
	overflow: auto;
	background-color: #000;
	color: ${colors.text};
`
