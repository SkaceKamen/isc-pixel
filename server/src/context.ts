import { Pixel, UserSessionInfo } from '@shared/models'
import OAuth2Server from 'oauth2-server'
import { Sequelize, SequelizeOptions } from 'sequelize-typescript'
import { AppConfig } from './lib/config'
import { BusDispatcher } from './lib/dispatcher'
import { Kaptcha } from './lib/kaptcha/kaptcha'
import { Canvas } from './models/canvas'
import { UserSession } from './models/db/user-session'
import { MemoryKaptchaModel } from './models/kaptcha-model'
import { OAuthModel } from './models/oauth-model'
import { Sessions } from './sessions'
import { AppStorage } from './storage'

export type AppContext = ReturnType<typeof appContext>

export const appContext = (config: AppConfig) => ({
	config,
	bus: {
		newPixel: new BusDispatcher<Pixel>(),
		sessionChanged: new BusDispatcher<UserSessionInfo>(),
	},
	sequelize: new Sequelize({
		...config.sequelize,
		models: [UserSession],
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
