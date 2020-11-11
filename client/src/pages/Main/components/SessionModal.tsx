import { getRestUrl } from '@/api/utils'
import { Loader } from '@/components'
import { Kaptcha } from '@/components/Kaptcha/Kaptcha'
import { Modal } from '@/components/Modal/Modal'
import { useRest } from '@/context/RestContext'
import { setSessionState } from '@/store/modules/session'
import { useAppDispatch } from '@/utils/hooks'
import React, { useEffect, useState } from 'react'

type Props = {
	onClose: () => void
}

export const SessionModal = ({ onClose }: Props) => {
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

		if (res.session && res.pixels !== undefined) {
			dispatch(setSessionState({ id: res.session, pixels: res.pixels }))
		} else {
			await loadSession()
		}

		setLoading(false)
	}

	useEffect(() => {
		loadSession()
	}, [])

	return (
		<Modal open={true} onClose={onClose}>
			<Loader loaded={!loading} />
			{captcha && (
				<>
					<p>Solve this puzzle</p>
					<Kaptcha
						baseUrl={`${getRestUrl()}/captcha/`}
						id={captcha}
						onFinish={handleFinish}
					/>
				</>
			)}
		</Modal>
	)
}
