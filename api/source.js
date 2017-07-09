const models = require('../models');
const rssspider = require('../spider/rss');
const config = require('../config');
const Source = require('../models/source');

module.exports = (server) => {
  server.get(`${config.API_PATH}/source`, async (req, res, next) => {
    try {
      const offset = (req.paginate.page - 1) * req.paginate.per_page;
      const limit = req.paginate.per_page;

      // Execute queries in parallel
      const [count, results] = await Promise.all([
        Source.count(null).exec(),
        Source.find(null, { type: 0 }).sort({ updatedAt: -1 }).skip(offset).limit(limit).exec(),
      ]);

      res.charSet('utf-8');
      res.paginate.send(results, count);
    } catch (error) {
      res.send({ code: 'failed', message: error.message });
    }
  });


  server.get(`${config.API_PATH}/source/:id`, async (req, res, next) => {
    try {
      let result = await Source.findOne({ _id: req.params.id }).exec();
      if (result == null) result = {};
      res.charSet('utf-8');
      res.send(result);
    } catch (error) {
      res.send({ code: 'failed', message: error.message });
    }
  });

  server.post(`${config.API_PATH}/rss-source`, async (req, res, next) => {
    if (req.body == null || req.body.link == null) {
      res.send({ code: 'failed', message: 'cannot parse request body.' });
    } else {
      const rss = {
        name: req.body.name,
        image: req.body.image,
        link: req.body.link,
        description: req.body.description,
      };

      try {
        await rssspider.saveRSSSource(rss);
        res.send({ code: 'success' });
      } catch (error) {
        res.send({ code: 'failed', message: error.message });
      }
    }
  });

  server.post(`${config.API_PATH}/source/:id/subscribe`, async (req, res, next) => {
    try {
      const sourceid = req.params.id;
      const uid = req.body.user;

      await Source.updateOne(
        { _id: sourceid },
        { $addToSet: { subscriptions: uid } });
      return res.send({ code: 'success' });
    } catch (error) {
      return next(error);
    }
  });

  server.post(`${config.API_PATH}/source/:id/unsubscribe`, async (req, res, next) => {
    try {
      const sourceid = req.params.id;
      const uid = req.body.user;

      await Source.updateOne(
        { _id: sourceid },
        { $pull: { subscriptions: uid } });
      return res.send({ code: 'success' });
    } catch (error) {
      return next(error);
    }
  });
};

