import { ServerInfo } from '@shared/models'

type State = Readonly<typeof initialState>

const initialState = {
	info: undefined as ServerInfo | undefined
}

export default (state = initialState, action: Actions): State => {
	switch (action.type) {
		case SERVER_SET_STATE: {
			return {
				...state,
				...action.state
			}
		}

		default:
			return state
	}
}

const SERVER_SET_STATE = 'SERVER_SET_STATE'

export const setServerState = (state: Partial<State>) =>
	({
		type: SERVER_SET_STATE,
		state
	} as const)

type Actions = ReturnType<typeof setServerState>
