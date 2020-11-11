/**
 * Shamelessly copied from JIMP
 * @param i
 */
export const intToRGBA = function(i: number) {
	if (typeof i !== 'number') {
		throw new Error('i must be a number')
	}

	const rgba = {
		r: 0,
		g: 0,
		b: 0,
		a: 0
	}

	rgba.r = Math.floor(i / Math.pow(256, 3))
	rgba.g = Math.floor((i - rgba.r * Math.pow(256, 3)) / Math.pow(256, 2))

	rgba.b = Math.floor(
		(i - rgba.r * Math.pow(256, 3) - rgba.g * Math.pow(256, 2)) /
			Math.pow(256, 1)
	)

	rgba.a = Math.floor(
		(i -
			rgba.r * Math.pow(256, 3) -
			rgba.g * Math.pow(256, 2) -
			rgba.b * Math.pow(256, 1)) /
			Math.pow(256, 0)
	)

	return rgba
}

export const rgbToHex = (r: number, g: number, b: number) =>
	r.toString(16).padStart(2, '0') +
	g.toString(16).padStart(2, '0') +
	b.toString(16).padStart(2, '0')
