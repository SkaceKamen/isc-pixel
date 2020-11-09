import { appContext } from '../context'
import { config } from '../lib/config'
import { User } from '../models/db/user'

const main = async () => {
	const email = process.argv[2]
	const username = process.argv[3]
	const password = process.argv[4]

	const context = appContext(config)

	await context.sequelize.sync()

	await User.create({
		username,
		email,
		password: await User.hashPassword(password),
	})

	console.log(`User ${username} created`)
}

main().catch(console.error)
