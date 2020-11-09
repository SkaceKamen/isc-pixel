export const getWebsocketUrl = () => {
	const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
	const basename = process.env.APP_API_URL || window.location.host

	return `${protocol}//` + `${basename}`
}

export const getRestUrl = () => {
	return `//${process.env.APP_API_URL}` || ''
}
