export const relativeMousePosition = (e: React.MouseEvent) => {
	const rect = (e.target as HTMLElement).getBoundingClientRect()
	const x = e.clientX - rect.left
	const y = e.clientY - rect.top

	return { x, y }
}
