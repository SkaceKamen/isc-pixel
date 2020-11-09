import React, { useState } from 'react'
import styled from 'styled-components'
import { HexColorPicker, HexColorInput } from 'react-colorful'

type Props = {
	color: string
	setColor: (color: string) => void
}

export const Controls = ({ color, setColor }: Props) => {
	const [picker, setPicker] = useState(false)

	const togglePicker = () => setPicker(picker => !picker)

	return (
		<C>
			{picker && (
				<Picker>
					<HexColorPicker onChange={setColor} color={color} />
					<HexColorInput onChange={setColor} color={color} />
				</Picker>
			)}
			<CurrentColor onClick={togglePicker} style={{ backgroundColor: color }} />
		</C>
	)
}

const C = styled.div`
	position: absolute;
	left: 0.5rem;
	bottom: 0.5rem;
	z-index: 1;
`

const Picker = styled.div`
	padding: 0.5rem;
	background: rgb(0, 0, 0, 0.9);
	color: #fff;
	border-radius: 8px;
	border-bottom-left-radius: 0;

	input {
		color: #fff;
		padding: 0.5rem;
		text-align: center;
		margin: auto;
	}
`

const CurrentColor = styled.div`
	width: 3rem;
	height: 3rem;
	cursor: pointer;
`
