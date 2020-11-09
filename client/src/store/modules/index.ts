/* eslint-disable @typescript-eslint/no-explicit-any */
import { combineReducers } from 'redux'

import api from './api'

const reducers = combineReducers({
	api
})

export default (state: any, action: any) => {
	return reducers(state, action)
}
