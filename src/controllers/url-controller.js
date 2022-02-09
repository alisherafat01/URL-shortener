const { Url } = require('../models');
const Joi = require('joi');
const crypto = require('crypto');

const redisService = require('../services/redis');
exports.redirectUrl = async (req, res, next) => {
  try {
    const shortToken = req.params.token;
    let fullPath = await redisService.get(`url:${shortToken}`);
    if (fullPath) return res.redirect(fullPath);

    let url = await Url.findOne({
      where: {
        shortToken,
      },
    });
    if (!url) {
      return res.__sendFail(404, { message: 'url not found' });
    }

    // cache url in redis (ttl:10s)
    redisService.set(`url:${shortToken}`, url.fullPath, 10);

    res.redirect(url.fullPath);
  } catch (err) {
    next(err);
  }
};

exports.createShortUrl = async (req, res, next) => {
  try {
    let params = req.body;
    const schema = Joi.object({
      url: Joi.string().required(),
    });

    const validateResult = schema.validate(params);
    if (validateResult.error)
      return res.__sendValidationError({
        message: validateResult.error.message,
      });

    params = validateResult.value;
    const shortToken = crypto.randomBytes(3).toString('hex');
    let url = await Url.create({
      shortToken,
      fullPath: params.url,
      userId: req.auth.id,
    });

    res.__sendSuccess({ url });
  } catch (err) {
    next(err);
  }
};

exports.deleteUrl = async (req, res, next) => {
  try {
    if (!req.params.token)
      return res.__sendValidationError({
        message: 'url token not provided',
      });
    let url = await Url.findOne({
      where: {
        shortToken: req.params.token,
      },
    });

    if (!url) {
      return res.__sendFail(404, { message: 'url not found' });
    }
    if (url.userId !== req.auth.id) {
      return res.__sendFail(403, { message: 'access denied' });
    }
    url = await url.destroy();

    // delete url from redis
    await redisService.delete(`url:${url.shortToken}`);

    res.__sendSuccess({ deleted: true, url });
  } catch (err) {
    next(err);
  }
};

exports.updateUrl = async (req, res, next) => {
  try {
    if (!req.params.token)
      return res.__sendValidationError({
        message: 'url token not provided',
      });

    let params = req.body;
    const schema = Joi.object({
      fullPath: Joi.string().required(),
    });

    const validateResult = schema.validate(params);
    if (validateResult.error)
      return res.__sendValidationError({
        message: validateResult.error.message,
      });

    params = validateResult.value;
    let url = await Url.findOne({
      where: {
        shortToken: req.params.token,
      },
    });

    if (!url) {
      return res.__sendFail(404, { message: 'url not found' });
    }
    if (url.userId !== req.auth.id) {
      return res.__sendFail(403, { message: 'access denied' });
    }
    url = await url.update(params);

    // delete url from redis
    await redisService.delete(`url:${url.shortToken}`);
    res.__sendSuccess({ url });
  } catch (err) {
    next(err);
  }
};
