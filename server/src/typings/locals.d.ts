import { Token } from 'oauth2-server'
import { Session } from '../sessions'
import { User } from '../models/db/user'

interface Locals {
	oauth?: {
		token: Token
	}
	user?: User
	session?: Session
}

declare module 'express' {
	export interface Response {
		locals: Locals
	}
}
