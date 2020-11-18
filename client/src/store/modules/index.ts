/* eslint-disable @typescript-eslint/no-explicit-any */
import { combineReducers } from 'redux'

import api from './api'
import canvas from './canvas'
import server from './server'
import session from './session'

const reducers = combineReducers({
	api,
	canvas,
	session,
	server
})

export default (state: any, action: any) => {
	return reducers(state, action)
}
