import { captchaParamsValidator } from '../validator/captcha-params'
import { appController } from '../app-controller'
import { asyncRoute } from '../async-route'

export const captchaApi = appController((router, { kaptcha }) => {
	router.get(
		'/:id/:step/image.jpg',
		asyncRoute(async (req, res) => {
			const { value: params, error } = captchaParamsValidator.validate(
				req.params
			)

			if (error || !params) {
				throw error
			}

			res.contentType('image/jpeg')
			res.send(await kaptcha.image(params.id, params.step))
		})
	)

	router.get(
		'/:id/:step/prompt.jpg',
		asyncRoute(async (req, res) => {
			const { value: params, error } = captchaParamsValidator.validate(
				req.params
			)

			if (error || !params) {
				throw error
			}

			res.contentType('image/jpeg')
			res.send(await kaptcha.prompt(params.id, params.step))
		})
	)
})
