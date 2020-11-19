import { useAppStore } from '@/utils/hooks'
import React from 'react'
import styled from 'styled-components'

type Props = {}

export const Social = ({}: Props) => {
	const info = useAppStore(state => state.server.info)

	return <C>{info?.users} artists online</C>
}

const C = styled.div`
	padding: 0.5rem;
	background-color: rgba(0, 0, 0, 0.75);
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;
	text-align: center;
`
