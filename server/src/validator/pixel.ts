import Joi from 'typesafe-joi'

export const pixelValidator = Joi.object({
	x: Joi.number().integer().positive().required(),
	y: Joi.number().integer().positive().required(),
	color: Joi.number().integer().min(0).max(0xffffff).required(),
})
