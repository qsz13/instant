'use strict';
var models = require("../models")
// var rssspider = require("../spider/rss")
var config = require('../config')
var Source = require('../models/source')

module.exports = (server) => {

    server.get('/source', async (req, res, next) => {
        try {
            var offset = (req.paginate.page - 1) * req.paginate.per_page
            var limit = req.paginate.per_page
            Source.count(null, (err, count) => {
                Source.find(null, { type: 0 }).sort({ 'updatedAt': -1 }).skip(offset).limit(limit).exec((err, results) => {
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

