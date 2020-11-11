/* eslint-disable @typescript-eslint/no-explicit-any */
import { combineReducers } from 'redux'

import api from './api'
import canvas from './canvas'
import session from './session'

const reducers = combineReducers({
	api,
	canvas,
	session
})

export default (state: any, action: any) => {
	return reducers(state, action)
}
