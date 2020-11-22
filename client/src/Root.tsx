import * as styles from '@/styles'
import React, { useMemo } from 'react'
import { hot } from 'react-hot-loader/root'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { ErrorHandlerContextProvider } from './context/ErrorHandlerContext'
import { LocaleContextProvider } from './context/LocaleContext'
import { RestContextProvider } from './context/RestContext'
import { WsContextProvider } from './context/WsContext'
import { App } from './pages/App/App'
import { buildStore } from './store'

const RootComponent = () => {
	const store = useMemo(() => buildStore(), [])

	return (
		<Provider store={store}>
			<LocaleContextProvider language={'en'}>
				<ErrorHandlerContextProvider>
					<RestContextProvider>
						<WsContextProvider>
							<ThemeProvider theme={styles}>
								<App />
							</ThemeProvider>
						</WsContextProvider>
					</RestContextProvider>
				</ErrorHandlerContextProvider>
			</LocaleContextProvider>
		</Provider>
	)
}

export const Root = RootComponent
