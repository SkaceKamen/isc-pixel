/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs'
import { rootPath } from './paths'

export type ENV = 'production' | 'development'

export const loadEnv = () => {
	const NODE_ENV = process.env.NODE_ENV

	// Possible env files
	// NOTE variables that are already defined are NOT overridden by .env files, hence the reverse order
	const dotenvFiles = [
		rootPath(`.env.${NODE_ENV}.local`),
		rootPath(`.env.${NODE_ENV}`),
		...(NODE_ENV !== 'test' ? [rootPath('.env.local')] : []),
		rootPath('.env')
	]

	dotenvFiles.forEach(dotenvFile => {
		if (fs.existsSync(dotenvFile)) {
			require('dotenv-expand')(
				require('dotenv').config({
					path: dotenvFile
				})
			)
		}
	})
}

export const getEnvValues = (
	env: 'development' | 'production',
	version: string
) => ({
	'process.env': Object.entries(process.env)
		.filter(([k]) => k.indexOf('APP_') === 0)
		.reduce(
			(res: { [key: string]: string }, [key, value]) => {
				res[key] = JSON.stringify(value)

				return res
			},
			{
				NODE_ENV: JSON.stringify(env),
				VERSION: JSON.stringify(version)
			}
		)
})
