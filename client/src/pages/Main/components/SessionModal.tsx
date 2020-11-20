import { getRestUrl } from '@/api/utils'
import { Loader } from '@/components'
import { Kaptcha } from '@/components/Kaptcha/Kaptcha'
import { Modal } from '@/components/Modal/Modal'
import { useErrorHandler } from '@/context/ErrorHandlerContext'
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
	const { catchErrors } = useErrorHandler()

	const [loading, setLoading] = useState(false)
	const [captcha, setCaptcha] = useState(undefined as string | undefined)

	const loadSession = async () => {
		setLoading(true)

		const res = await catchErrors(rest.requestSession())

		if (res) {
			setCaptcha(res.captcha)
		}

		setLoading(false)
	}

	const handleFinish = async (results: { x: number; y: number }[]) => {
		if (!captcha) {
			return
		}

		setLoading(true)

		const res = await catchErrors(
			rest.requestSessionFromCaptcha({
				captcha,
				results
			})
		)

		if (res && res.session && res.pixels !== undefined) {
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
		<Modal open={true} onClose={onClose} header={<h2>Are you human?</h2>}>
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
