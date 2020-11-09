import { NextFunction, Request, Response } from 'express'

export const asyncRoute = <R>(
	cb: (req: Request, res: Response, next: NextFunction) => Promise<R>
) => (req: Request, res: Response, next: NextFunction) => {
	cb(req, res, next).catch(next)
}
