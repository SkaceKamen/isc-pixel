import { appContext } from '../context'
import { config } from '../lib/config'
import { AuthClient } from '../models/db/auth-client'

const main = async () => {
	const context = appContext(config)

	await context.sequelize.sync()

	await AuthClient.create({
		id: 'spa-client',
		secret: 'very-secret',
	})

	console.log(`Default auth client created`)
}

main().catch(console.error)
