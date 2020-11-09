import express, { json, urlencoded } from 'express'
import { AppContext } from './context'
import { corsMiddleware } from './middleware/cors'
import { sessionMiddleware } from './middleware/session'
import { canvasApi } from './rest/canvas'
import { captchaApi } from './rest/captcha'
import { pixelApi } from './rest/pixel'
import { sessionApi } from './rest/session'

export const createApp = async (context: AppContext) => {
	const app = express()

	app.use(corsMiddleware())
	app.use(express.static(context.config.static))
	app.use(json())
	app.use(urlencoded({ extended: false }))
	// app.use('/auth', authApi(context))
	// app.use('/user', [authMiddleware(context), userApi(context)])
	app.use('/canvas', canvasApi(context))
	app.use('/session', sessionApi(context))
	app.use('/captcha', captchaApi(context))
	app.use('/pixel', [sessionMiddleware(context), pixelApi(context)])

	return app
}
