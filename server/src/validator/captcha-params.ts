import Joi from 'typesafe-joi'

export const captchaParamsValidator = Joi.object({
	id: Joi.string().required(),
	step: Joi.number().integer().required(),
})
