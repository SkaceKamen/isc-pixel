import { Router } from 'express'
import { AppContext } from './context'

export const appController = (
	controller: (router: Router, context: AppContext) => void
) => (context: AppContext) => {
	const router = Router()
	controller(router, context)

	return router
}
