'use strict';
var models = require("../models")
var rssspider = require("../spider/rss")
var config = require('../config')
var Source = require('../models/source')

module.exports = (server) => {

    server.get('/source', async (req, res, next) => {
        try {
            let offset = (req.paginate.page - 1) * req.paginate.per_page
            let limit = req.paginate.per_page

            // Execute queries in parallel
            let [count, results] = await Promise.all([
                Source.count(null).exec(),
                Source.find(null, { type: 0 }).sort({ 'updatedAt': -1 }).skip(offset).limit(limit).exec()
            ])

            res.charSet('utf-8');
            res.paginate.send(results, count);

        } catch (error) {
            res.send({ 'code': 'failed', 'message': error.message })
        }
    });


    server.get('/source/:id', async (req, res, next) => {
        try {
            let result = await Source.findOne({ _id: req.params.id }).exec()
            if (result == null) result = {}
            res.charSet('utf-8');
            res.send(result);
        } catch (error) {
            res.send({ 'code': 'failed', 'message': error.message })
            console.log(error)
        }
    })

    server.post("/rss-source", async (req, res, next) => {
        if (req.body == null || req.body.link == null) {
            res.send({ 'code': 'failed', 'message': 'cannot parse request body.' })
        }
        else {
            var rss = {
                name: req.body.name,
                image: req.body.image,
                link: req.body.link,
                description: req.body.description
            }

            try {
                await rssspider.saveRSSSource(rss);
                res.send({ 'code': 'success' })
            } catch (error) {
                res.send({ 'code': 'failed', 'message': error.message })
            }
        }
    })
};

