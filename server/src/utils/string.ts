export const zeroed = (input: number | string, length = 2) =>
	input.toString().padStart(length, '0')
