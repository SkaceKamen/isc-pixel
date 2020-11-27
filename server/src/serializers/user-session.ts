import { UserSessionInfo } from '@shared/models'
import { UserSession } from 'src/models/db/user-session'

export const userSessionToInfo = (
	userSession: UserSession
): UserSessionInfo => ({
	id: userSession.id,
	expiresAt: userSession.expiresAt.toISOString(),
	pixels: userSession.pixels,
	reloadsIn:
		userSession.reloadsAt === undefined
			? undefined
			: userSession.reloadsAt?.getTime() - Date.now(),
})
