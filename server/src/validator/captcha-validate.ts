import Joi from 'typesafe-joi'

export const captchaValidateValidator = Joi.object({
	captcha: Joi.string().required(),
	results: Joi.array()
		.items(
			Joi.object({
				x: Joi.number().integer().positive().required(),
				y: Joi.number().integer().positive().required(),
			})
		)
		.required(),
})
