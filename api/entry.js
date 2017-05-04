'use strict';
var rp = require('request-promise-native');
var config = require('../config')
var Entry = require('../models/entry')
var Source = require('../models/source')

module.exports = (server) => {

    server.get('/entry', async (req, res, next) => {
        try {
            var offset = (req.paginate.page - 1) * req.paginate.per_page
            var limit = req.paginate.per_page
            const results =
                await Entry.find(null, { __v: 0, type: 0, updatedAt: 0 })
                    .populate('source', { type: 0, link: 0, updatedAt: 0, createdAt: 0 })
                    .sort({ 'createdAt': -1 }).skip(offset).limit(limit).exec()

            res.charSet('utf-8');
            res.paginate.send(results, results.length);

        } catch (error) {
            res.send({ 'code': 'failed', 'message': error.message })
        }
    });


    server.get('/source/:id/entry', async (req, res, next) => {
        try {
            var offset = (req.paginate.page - 1) * req.paginate.per_page
            var limit = req.paginate.per_page
            const results =
                await Entry.find({ source: req.params.id }, { __v: 0, type: 0, updatedAt: 0 })
                    .populate('source', { type: 0, link: 0, updatedAt: 0, createdAt: 0 })
                    .sort({ 'createdAt': -1 }).skip(offset).limit(limit).exec()

            res.charSet('utf-8');
            res.paginate.send(results, results.length);

        } catch (error) {
            res.send({ 'code': 'failed', 'message': error.message })
        }

    });



};

