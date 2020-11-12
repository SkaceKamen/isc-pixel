/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	Client,
	PasswordModel,
	RefreshToken,
	RefreshTokenModel,
	Token,
} from 'oauth2-server'
import { AuthClient } from './db/auth-client'
import { AuthToken } from './db/auth-token'
import { User } from './db/user'

export class OAuthModel implements PasswordModel, RefreshTokenModel {
	async getAccessToken(bearerToken: string) {
		const token = await AuthToken.findOne({
			where: { accessToken: bearerToken },
		})

		if (token) {
			return {
				accessToken: token.accessToken,
				accessTokenExpiresAt: token.accessTokenExpiresAt,
				refreshToken: token.refreshToken,
				refreshTokenExpiresAt: token.refreshTokenExpiresAt,
				client: {
					id: token.authClientId,
					grants: ['password', 'refresh_token'],
				},
				expires: token.accessTokenExpiresAt,
				user: { id: token.userId },
			}
		}
	}

	async getClient(clientId: string, clientSecret: string) {
		const client = await AuthClient.findOne({
			where: { id: clientId, secret: clientSecret },
		})

		if (client) {
			return {
				id: client.id,
				grants: ['password'],
			}
		}
	}

	async getRefreshToken(bearerToken: string) {
		const token = await AuthToken.findOne({
			where: { refreshToken: bearerToken },
		})

		if (token) {
			return {
				refreshToken: token.refreshToken,
				refreshTokenExpiresAt: token.refreshTokenExpiresAt,
				client: {
					id: token.authClientId,
					grants: ['password', 'refresh_token'],
				},
				user: { id: token.userId },
			}
		}
	}

	async getUser(username: string, password: string) {
		const user = await User.findOne({ where: { username } })

		if (!user || !user.passwordMatch(password)) {
			return false
		}

		return user
	}

	async saveToken(token: Token, client: Client, user: { id: number }) {
		const dbToken = await AuthToken.create({
			authClientId: client.id,
			userId: user.id,
			accessToken: token.accessToken,
			accessTokenExpiresAt: token.accessTokenExpiresAt,
			refreshToken: token.refreshToken,
			refreshTokenExpiresAt: token.refreshTokenExpiresAt,
		})

		return {
			accessToken: dbToken.accessToken,
			accessTokenExpiresAt: dbToken.accessTokenExpiresAt,
			refreshToken: dbToken.refreshToken,
			refreshTokenExpiresAt: dbToken.refreshTokenExpiresAt,
			client: {
				id: dbToken.authClientId,
				grants: ['password', 'refresh_token'],
			},
			expires: dbToken.accessTokenExpiresAt,
			user: { id: dbToken.userId },
		}
	}

	async verifyScope(_token: Token, _scope: string | string[]) {
		return true
	}

	async revokeToken(token: RefreshToken | Token) {
		if (!token.accessToken && !token.refreshToken) {
			throw new Error('No accessToken or refreshToken present')
		}

		const dbToken = await AuthToken.findOne({
			where: token.accessToken
				? { accessToken: token.accessToken }
				: token.refreshToken
				? { refreshToken: token.refreshToken }
				: { refreshToken: 'fuck' },
		})

		if (dbToken) {
			await dbToken.destroy()

			return true
		}

		return false
	}
}
