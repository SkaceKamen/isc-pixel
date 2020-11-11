type State = Readonly<typeof initialState>

export enum CanvasTool {
	Paint = 1,
	Pick
}

const initialState = {
	color: '#000000',
	tool: CanvasTool.Paint
}

export default (state = initialState, action: Actions): State => {
	switch (action.type) {
		case CANVAS_SET_STATE: {
			return {
				...state,
				...action.state
			}
		}

		default:
			return state
	}
}

const CANVAS_SET_STATE = 'CANVAS_SET_STATE'

export const setCanvasState = (state: Partial<State>) =>
	({
		type: CANVAS_SET_STATE,
		state
	} as const)

type Actions = ReturnType<typeof setCanvasState>
