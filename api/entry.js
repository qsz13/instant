'use strict';
var rp = require('request-promise-native');
var config = require('../config')
var Entry = require('../models/entry')
var Source = require('../models/source')

// var db = mongojs(config.DATABASE_URL, ['source', 'entry'])

module.exports = (server) => {

    server.get('/entry', async (req, res, next) => {
        try {
            var offset = (req.paginate.page - 1) * req.paginate.per_page
            var limit = req.paginate.per_page
            Entry.count(null, (err, count) => {
                Entry.find(null, { __v: 0, type: 0, updatedAt: 0 }).populate('source', { type: 0, link: 0, updatedAt: 0, createdAt: 0 }).sort({ 'createdAt': -1 }).skip(offset).limit(limit).exec((err, results) => {
                    res.charSet('utf-8');
                    res.paginate.send(results, count);
                })
            })
        } catch (error) {
            res.send({ 'code': 'failed', 'message': error.message })
        }
    });


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



};

