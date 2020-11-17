import { join } from 'path'
import { SequelizeOptions } from 'sequelize-typescript'
import { configValidator } from '@/validator/config'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const userConfig = require(join(process.cwd(), 'config.js'))

export type AppConfig = typeof config

const { error } = configValidator.validate(userConfig)

if (error) {
	throw error
}

export const config = {
	port: userConfig.port as number,
	static: userConfig.static as string,
	storage: {
		path: userConfig.storage.path as string,
	},
	canvas: {
		width: userConfig.canvas.width as number,
		height: userConfig.canvas.height as number,
		palette: userConfig.canvas.palette.map((c: string) =>
			c.toLowerCase()
		) as string[],
	},
	drawing: {
		pixels: (userConfig.drawing.pixels ?? 10) as number,
		timeout: (userConfig.drawing.timeout ?? 30) as number,
	},
	sequelize: userConfig.sequelize as SequelizeOptions,
	kaptcha: userConfig.kaptcha as {
		font1path: string
		font2path: string
	},
}
