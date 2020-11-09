import { getRestUrl } from '@/api/utils'
import { Loader } from '@/components'
import { Kaptcha } from '@/components/Kaptcha/Kaptcha'
import { Modal } from '@/components/Modal/Modal'
import { useRest } from '@/context/RestContext'
import { setApiState } from '@/store/modules/api'
import { useAppDispatch } from '@/utils/hooks'
import React, { useEffect, useState } from 'react'

type Props = {}

export const SessionModal = ({}: Props) => {
	const rest = useRest()
	const dispatch = useAppDispatch()

	const [loading, setLoading] = useState(false)
	const [captcha, setCaptcha] = useState(undefined as string | undefined)

	const loadSession = async () => {
		setLoading(true)
		const res = await rest.requestSession()
		setCaptcha(res.captcha)
		setLoading(false)
	}

	const handleFinish = async (results: { x: number; y: number }[]) => {
		if (!captcha) {
			return
		}

		setLoading(true)

		const res = await rest.requestSessionFromCaptcha({
			captcha,
			results
		})

		if (res.session) {
			dispatch(setApiState({ session: res.session }))
		} else {
			await loadSession()
		}

		setLoading(false)
	}

	useEffect(() => {
		loadSession()
	}, [])

	return (
		<Modal open={true}>
			<Loader loaded={!loading} />
			{captcha && (
				<Kaptcha
					baseUrl={`${getRestUrl()}/captcha/`}
					id={captcha}
					onFinish={handleFinish}
				/>
			)}
		</Modal>
	)
}
