import React, { useEffect, useMemo, useState } from 'react'

type Props = {
	id: string
	baseUrl?: string
	steps?: number
	onFinish: (results: { x: number; y: number }[]) => void
}

export const Kaptcha = ({ baseUrl = '', id, steps = 2, onFinish }: Props) => {
	const [step, setStep] = useState(0)
	const [results, setResults] = useState([] as { x: number; y: number }[])

	const unique = useMemo(() => Date.now(), [])

	const handleClick = (e: React.MouseEvent) => {
		const rect = (e.target as HTMLImageElement).getBoundingClientRect()
		const x = Math.round(e.clientX - rect.left)
		const y = Math.round(e.clientY - rect.top)

		setResults(results => [...results, { x, y }])
		setStep(step => step + 1)
	}

	useEffect(() => {
		setStep(0)
		setResults([])
	}, [id])

	useEffect(() => {
		if (results.length === steps) {
			onFinish(results)
		}
	}, [results])

	return step < steps ? (
		<>
			<div>
				Step {step} / {steps}
			</div>
			<div>
				Find this letter:{' '}
				<img
					src={`${baseUrl}${id}/${step}/prompt.jpg?t=${unique}`}
					alt="Captcha prompt"
				/>
			</div>
			<img
				onClick={handleClick}
				src={`${baseUrl}${id}/${step}/image.jpg?t=${unique}`}
				alt="Captcha image"
			/>
		</>
	) : (
		<></>
	)
}
