import { UserSession } from 'src/models/db/user-session'

export const userSessionToInfo = (userSession: UserSession) => ({
	id: userSession.id,
	expiresAt: userSession.expiresAt.getTime(),
	pixels: userSession.pixels,
	reloadsAt: userSession.reloadsAt?.getTime(),
})
