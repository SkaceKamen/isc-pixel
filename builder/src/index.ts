import { exec, ExecOptions } from 'child_process'
import { promises as fs } from 'fs'
import { join, resolve } from 'path'
import { pathExists, copy } from 'fs-extra'

const asyncExec = (command: string, options: ExecOptions, outPrefix: string) =>
	new Promise<void>((resolve, reject) => {
		exec(command, options, (err, stdout, stderr) => {
			if (err) {
				stdout
					.split('\n')
					.forEach((line) => console.log(outPrefix, 'STDOUT:', line))

				stderr
					.split('\n')
					.forEach((line) => console.error(outPrefix, 'STDERR:', line))

				reject(err)
			}

			resolve()
		})
	})

async function main() {
	const outPath = join(__dirname, '..', 'dist')

	const mods = {
		server: resolve(join(__dirname, '..', '..', 'server')),
		client: resolve(join(__dirname, '..', '..', 'client')),
	}

	// Run npm install & npm run build in modules
	for (const [mod, modPath] of Object.entries(mods)) {
		console.log(`[${mod}]`, 'Installing dependencies')
		await asyncExec('npm install', { cwd: modPath }, `[${mod}] `)
		console.log(`[${mod}]`, 'Building')
		await asyncExec('npm run build', { cwd: modPath }, `[${mod}] `)
	}

	console.log('Preparing dist path')

	if (await pathExists(outPath)) {
		await fs.rmdir(outPath, { recursive: true })
	}

	await fs.mkdir(outPath, { recursive: true })

	console.log('Copying server files')

	await copy(join(mods.server, 'dist'), outPath, {
		recursive: true,
		errorOnExist: false,
		overwrite: true,
	})

	console.log('Copying client files')

	await copy(join(mods.client, 'dist'), join(outPath, 'static'), {
		recursive: true,
		errorOnExist: false,
		overwrite: true,
	})

	await copy(
		join(mods.server, 'config.js.example'),
		join(outPath, 'config.js.example')
	)

	console.log('Writing proper package.json')

	const pckData = JSON.parse(
		(await fs.readFile(join(mods.server, 'package.json'))).toString()
	)

	pckData.name = '@isc-pixel/bundle'

	pckData.scripts = {
		start: 'isc-pixel.js',
	}

	await fs.writeFile(
		join(outPath, 'package.json'),
		JSON.stringify(pckData, undefined, 2)
	)

	if (await pathExists(join(outPath, 'data'))) {
		await fs.rmdir(join(outPath, 'data'), { recursive: true })
	}

	if (await pathExists(join(outPath, 'config.js'))) {
		await fs.unlink(join(outPath, 'config.js'))
	}

	console.log('Built into', outPath)
}

main().catch(console.error)
