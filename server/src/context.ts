import OAuth2Server from 'oauth2-server'
import { Sequelize, SequelizeOptions } from 'sequelize-typescript'
import { AppConfig } from './lib/config'
import { BusDispatcher } from './lib/dispatcher'
import { Kaptcha } from './lib/kaptcha/kaptcha'
import { Canvas } from './models/canvas'
import { AuthClient } from './models/db/auth-client'
import { AuthToken } from './models/db/auth-token'
import { User } from './models/db/user'
import { MemoryKaptchaModel } from './models/kaptcha-model'
import { OAuthModel } from './models/oauth-model'
import { Pixel, UserSession } from '@shared/models'
import { Sessions } from './sessions'
import { AppStorage } from './storage'

export type AppContext = ReturnType<typeof appContext>

export const appContext = (config: AppConfig) => ({
	config,
	bus: {
		newPixel: new BusDispatcher<Pixel>(),
		sessionChanged: new BusDispatcher<UserSession>(),
	},
	sequelize: new Sequelize({
		...config.sequelize,
		models: [AuthClient, AuthToken, User],
	} as SequelizeOptions),
	oauth: new OAuth2Server({
		model: new OAuthModel(),
	}),
	canvas: new Canvas(512, 512),
	storage: new AppStorage(config.storage.path),
	kaptcha: new Kaptcha({
		model: new MemoryKaptchaModel(),
		font1: config.kaptcha.font1path,
		font2: config.kaptcha.font2path,
	}),
	sessions: new Sessions(),
})
