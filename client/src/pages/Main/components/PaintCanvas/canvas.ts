import { rgbToHex } from '@/utils/color'
import { RefObject, useCallback } from 'react'

export const useCanvas = (ref: RefObject<HTMLCanvasElement | null>) => {
	const getCtx = useCallback(() => {
		if (!ref.current) {
			throw new Error('Palette index requested before canvas is initialized')
		}

		const ctx = ref.current.getContext('2d')

		if (!ctx) {
			throw new Error('Failed to get 2D context')
		}

		return ctx
	}, [ref])

	const colorIndexAt = useCallback(
		(x: number, y: number, palette: string[]) => {
			const ctx = getCtx()
			const data = ctx.getImageData(x, y, 1, 1).data
			const color = '#' + rgbToHex(data[0], data[1], data[2])
			const index = palette.indexOf(color)

			if (index < 0) {
				console.warn('Color', color, 'has no index in palette', palette)
			}

			return index
		},
		[getCtx]
	)

	const setPixel = useCallback(
		(x: number, y: number, color: { r: number; g: number; b: number }) => {
			const ctx = getCtx()
			const id = ctx.createImageData(1, 1)
			const d = id.data
			d[0] = color.r
			d[1] = color.g
			d[2] = color.b
			d[3] = 255
			ctx.putImageData(id, x, y)
		},
		[getCtx]
	)

	const download = useCallback(
		() =>
			new Promise<void>((resolve, reject) => {
				if (!ref.current) {
					reject(new Error('Canvas is not initialized'))
				}

				ref.current?.toBlob(blob => {
					const url = URL.createObjectURL(blob)
					const a = document.createElement('a')
					a.textContent = 'Download'
					a.download = 'isc-pixel.png'
					a.href = url
					document.body.appendChild(a)
					a.click()
					document.body.removeChild(a)
					resolve()
				}, 'image/png')
			}),
		[ref]
	)

	return {
		colorIndexAt,
		setPixel,
		download
	}
}
