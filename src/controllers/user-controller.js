const _ = require('lodash');
const { User } = require('../models');
const userTransformer = require('../transformers/user-transformer');
const Joi = require('joi');
exports.signupUser = async (req, res, next) => {
  let params = req.body;
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(6)
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .required(),
  });

  const validateResult = schema.validate(params);
  if (validateResult.error)
    return res.__sendValidationError({ message: validateResult.error.message });

  params = validateResult.value;
  let user = new User(params);
  let oldUser = await User.findOne({ where: { email: params.email } });
  if (oldUser)
    return res.__sendFail(422, { message: 'User already registered.' });

  await user.encryptPassword();
  await user.save();

  const access_token = user.generateAuthToken();
  res.__sendJson({
    user: userTransformer.transform(user),
    access_token,
  });
};

exports.sigininUser = async (req, res, next) => {
  let params = req.body;
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(6)
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .required(),
  });

  const validateResult = schema.validate(params);
  if (validateResult.error)
    return res.__sendValidationError({
      message: validateResult.error.message,
    });

  params = validateResult.value;
  let user = await User.findOne({
    where: {
      email: params.email,
    },
  });
  if (!user || !(await user.comparePassword(params.password))) {
    return res.__sendFail(400, { message: 'authentication failed.' });
  }
  const access_token = user.generateAuthToken();

  res.__sendJson({
    user: userTransformer.transform(user),
    access_token,
  });
};
