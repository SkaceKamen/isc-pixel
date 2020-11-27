import { Tooltip } from '@/components/Tooltip/Tooltip'
import React, { memo } from 'react'
import styled, { css } from 'styled-components'

export type Schema = 'primary' | 'transparent' | 'secondary'

export type Size = 'xs' | 'sm' | 'md' | 'lg'

interface Props {
	disabled?: boolean
	schema?: Schema
	type?: 'button' | 'submit' | 'reset'
	name?: string
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
	onMouseOver?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
	onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
	tooltip?: React.ReactChild
	className?: string
	children?: React.ReactNode
}

const ButtonComponent = ({
	disabled = false,
	name,
	schema,
	type = 'button',
	children,
	onClick,
	onMouseOver,
	onMouseLeave,
	tooltip,
	className
}: Props) => {
	const hasContent = !!children

	let contents = children

	if (tooltip) {
		contents = <Tooltip content={tooltip}>{contents}</Tooltip>
	}

	return (
		<Container
			className={className}
			isDisabled={disabled || false}
			name={name}
			onClick={!disabled ? onClick : undefined}
			onMouseOver={onMouseOver}
			onMouseLeave={onMouseLeave}
			type={type}
			hasContent={hasContent}
			schema={schema || 'primary'}
		>
			{contents}
		</Container>
	)
}

const Container = styled.button<{
	isDisabled: boolean
	hasContent: boolean
	schema: Schema
}>`
	transition: 0.2s;
	border-radius: 0;
	text-transform: uppercase;
	border: 0;
	user-select: none;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 100%;

	padding: 0.4rem 0.8rem;
	border-width: 1px;
	border-style: solid;

	${props =>
		!props.isDisabled &&
		css`
			background: ${props.theme.colors.button[props.schema].background};
			border-color: ${props.theme.colors.button[props.schema].borderColor};
			color: ${props.theme.colors.button[props.schema].color};

			&:hover {
				background: ${props.theme.colors.button[props.schema].hover.background};
				border-color: ${props.theme.colors.button[props.schema].hover.borderColor};
				color: ${props.theme.colors.button[props.schema].hover.color};
				
				/*
				& svg {
					color: ${props.theme.colors.button[props.schema].hover.color};
				}
				*/
			}
		`}

	${props =>
		props.isDisabled &&
		css`
			cursor: not-allowed;
			opacity: 0.5;
			background: ${props.theme.colors.button.disabledBackground} !important;
			border-color: ${props.theme.colors.button.disabledBorder} !important;
			color: ${props.theme.colors.button.disabledColor} !important;
		`}

	> * {
		margin: 0 0.25rem;
	}
`

export const Button = memo(ButtonComponent)
