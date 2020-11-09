import { appController } from '../app-controller'
import { User } from '../models/db/user'

export const userApi = appController((router) => {
	router.get('/', (_req, res) => {
		if (!res.locals.user) {
			throw new Error('No user defined!')
		}

		const user = res.locals.user as User

		return res.json({
			id: user.id,
			username: user.username,
			email: user.email,
		})
	})
})
