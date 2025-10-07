import Joi from "joi";

export const createStudentSchema = Joi.object({
  nome: Joi.string().min(3).max(120).required(),
  email: Joi.string().email().required(),
  matricula: Joi.string().min(3).max(40).required(),
  curso: Joi.string().min(2).max(80).required(),
  dataNascimento: Joi.date().iso().required(),
  ativo: Joi.boolean().optional()
});

export const updateStudentSchema = Joi.object({
  nome: Joi.string().min(3).max(120),
  email: Joi.string().email(),
  matricula: Joi.string().min(3).max(40),
  curso: Joi.string().min(2).max(80),
  dataNascimento: Joi.date().iso(),
  ativo: Joi.boolean()
}).min(1);
