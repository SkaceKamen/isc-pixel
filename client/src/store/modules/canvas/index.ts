type State = Readonly<typeof initialState>

export enum CanvasTool {
	Paint = 1,
	Pick
}

const initialState = {
	tool: CanvasTool.Paint,
	selectedColor: 0,
	palette: [] as string[],
	width: 0,
	height: 0
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
