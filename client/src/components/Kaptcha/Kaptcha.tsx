import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

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
			<Step>
				Step {step + 1} / {steps}
			</Step>
			<Prompt>
				Find
				<img
					src={`${baseUrl}${id}/${step}/prompt.jpg?t=${unique}`}
					alt="Captcha prompt"
				/>
				in the image:
			</Prompt>
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

const Step = styled.div`
	text-align: center;
`

const Prompt = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;

	img {
		margin: 0.5rem;
	}
`
