import { Token } from 'oauth2-server'
import { UserSession } from '@shared/models'
import { User } from '../models/db/user'

interface Locals {
	oauth?: {
		token: Token
	}
	user?: User
	session?: UserSession
}

declare module 'express' {
	export interface Response {
		locals: Locals
	}
}
