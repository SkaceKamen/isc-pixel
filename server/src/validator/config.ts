import Joi from 'typesafe-joi'

export const configValidator = Joi.object({
	port: Joi.number().integer().min(0).required(),
	static: Joi.string().required(),
	storage: Joi.object({
		path: Joi.string().required(),
	}).required(),
	canvas: Joi.object({
		width: Joi.number().integer().min(1).required(),
		height: Joi.number().integer().min(1).required(),
		palette: Joi.array().items(Joi.string()).min(1).required(),
	}).required(),
	drawing: Joi.object({
		pixels: Joi.number().integer().min(1).required(),
		timeout: Joi.number().min(0).required(),
	}),
	sequelize: Joi.object().required(),
	kaptcha: Joi.object({
		font1path: Joi.string().required(),
		font2path: Joi.string().required(),
	}).required(),
})
