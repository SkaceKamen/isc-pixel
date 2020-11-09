import { Request, Response } from 'oauth2-server'
import { appController } from '../app-controller'

export const authApi = appController((router, { oauth }) => {
	router.post('/token', (req, res, next) => {
		const request = new Request(req)
		const response = new Response(res)

		oauth
			.token(request, response)
			.then((token) => {
				res.locals.oauth = { token }

				res.json(token)
			})
			.catch(next)
	})
})
