import { NextFunction, Request, Response } from 'express'
import { AppContext } from '../context'

export const sessionMiddleware = ({ sessions }: AppContext) => async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const sessionId = req.headers['x-session']

	const session =
		sessionId && typeof sessionId === 'string'
			? await sessions.get(sessionId)
			: undefined

	if (!session) {
		res.status(401).send()
	} else {
		res.locals.session = session

		next()
	}
}
