import { NextFunction, Request, Response } from 'express'
import {
	Request as OAuthRequest,
	Response as OAuthResponse,
} from 'oauth2-server'
import { AppContext } from '../context'
import { User } from '../models/db/user'

export const authMiddleware = ({ oauth }: AppContext) => (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const request = new OAuthRequest(req)
	const response = new OAuthResponse(res)

	oauth
		.authenticate(request, response)
		.then((token) => {
			res.locals.oauth = { token }

			return User.findOne({ where: { id: token.user.id } })
		})
		.then((user) => {
			res.locals.user = user ?? undefined

			next()
		})
		.catch(next)
}
