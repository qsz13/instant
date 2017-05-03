'use strict';
var rp = require('request-promise-native');
var config = require('../config')
var mongojs = require('mongojs')

var db = mongojs(config.DATABASE_URL, ['source', 'entry'])

module.exports = (server) => {

    server.get('/source/:id/entry', async (req, res, next) => {
        try {
            // const results = await models.Entry.findAndCountAll({
            //     where: { source_id: req.params.id },
            //     offset: (req.paginate.page - 1) * req.paginate.per_page,
            //     limit: req.paginate.per_page,
            //     order: [['published_at', 'DESC'], ['created_at', 'DESC']],
            //     include: [{ model: models.Source }, { model: models.Image }]
            // })




            res.charSet('utf-8');
            res.paginate.send(results.rows, results.count);
        } catch (error) {
            res.send({ 'code': 'failed', 'message': error.message })
        }

    });

    server.get('/entry', async (req, res, next) => {
        try {
            var offset = (req.paginate.page - 1) * req.paginate.per_page
            var limit = req.paginate.per_page
            db.entry.count(null, (err, count) => {
                db.source.find().sort({ 'updated_at': -1 }).skip(offset).limit(limit, (err, results) => {
                    res.charSet('utf-8');
                    res.paginate.send(results, count);
                })
            })
        } catch (error) {
            res.send({ 'code': 'failed', 'message': error.message })
        }
    });

};

