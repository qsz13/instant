'use strict';
var models = require("../models")
// var rssspider = require("../spider/rss")
var config = require('../config')
// var mongojs = require('mongojs')
// var db = mongojs(config.DATABASE_URL, ['source', 'entry'])

module.exports = (server) => {

    server.get('/source', async (req, res, next) => {
        try {
            var offset = (req.paginate.page - 1) * req.paginate.per_page
            var limit = req.paginate.per_page
            db.source.count(null, (err, count) => {
                db.source.find().sort({ 'updatedAt': -1 }).skip(offset).limit(limit, (err, results) => {
                    res.charSet('utf-8');
                    res.paginate.send(results, count);
                })
            })
        } catch (error) {
            res.send({ 'code': 'failed', 'message': error.message })
        }
    });

    // server.post("/rss-source", async (req, res, next) => {
    //     if (req.body == null) {
    //         res.send({ 'code': 'failed', 'message': 'cannot parse request body.' })
    //     }
    //     else {
    //         var rss = {
    //             name: req.body.name,
    //             image: req.body.image,
    //             link: req.body.link,
    //             description: req.body.description,
    //             type: 'rss'
    //         }

    //         try {
    //             await rssspider.saveRSSSource(rss);
    //             res.send({ 'code': 'success' })
    //         } catch (error) {
    //             res.send({ 'code': 'failed', 'message': error.message })
    //         }
    //     }
    // })
};

