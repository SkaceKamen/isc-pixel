type State = Readonly<typeof initialState>

const initialState = {
	id: undefined as string | undefined,
	pixels: 0,
	pixelsReloadAt: undefined as Date | undefined
}

export default (state = initialState, action: Actions): State => {
	switch (action.type) {
		case SESSION_SET_STATE: {
			return {
				...state,
				...action.state
			}
		}

		default:
			return state
	}
}

const SESSION_SET_STATE = 'SESSION_SET_STATE'

type SessionSetState = {
	type: typeof SESSION_SET_STATE
	state: Partial<State>
}

type Actions = SessionSetState

export const setSessionState = (state: Partial<State>) =>
	({
		type: SESSION_SET_STATE,
		state
	} as SessionSetState)
