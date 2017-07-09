const config = require('../config');
const restify = require('restify');
const User = require('../models/user');
const Expo = require('exponent-server-sdk');

module.exports = (server) => {
  server.post(`${config.API_PATH}/user/login`, async (req, res, next) => {
    try {
      const token = req.body.token;
      const uid = req.body.user;

    // To check if something is a push token
      if (!Expo.isExpoPushToken(token)) {
        return next(new restify.errors.InvalidArgumentError('invalid push token'));
      }

      await User.updateOne({ _id: uid }, { $addToSet: { pushToken: token } }, { upsert: true });
      return res.send({ code: 'success' });
    } catch (error) {
      return next(error);
    }
  });

  server.post(`${config.API_PATH}/user/logout`, async (req, res, next) => {
    try {
      const token = req.body.token;
      const uid = req.body.user;

    // To check if something is a push token
      if (!Expo.isExponentPushToken(token)) {
        return next(new restify.errors.InvalidArgumentError('invalid push token'));
      }

      await User.updateOne({ _id: uid }, { $pull: { pushToken: token } });
      return res.send({ code: 'success' });
    } catch (error) {
      return next(error);
    }
  });
};
