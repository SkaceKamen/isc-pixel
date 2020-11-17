import React from 'react'
import { HexColorInput, HexColorPicker } from 'react-colorful'
import styled from 'styled-components'

type Props = {
	color: string
	onColor: (color: string) => void
}

export const ColorPicker = ({ color, onColor }: Props) => {
	return (
		<Picker>
			<HexColorPicker onChange={onColor} color={color} />
			<HexColorInput onChange={onColor} color={color} />
		</Picker>
	)
}

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
		box-sizing: border-box;
		width: 200px;
	}
`
