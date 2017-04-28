'use strict';
var models = require("../models")
var rssspider = require("../spider/rss")

module.exports = (server) => {

    server.get('/source', (req, res, next) => {
        models.Source.findAll().then((results) => {
            res.send(results);
            return next();
        })
    });

    server.post("/rss-source", (req, res, next) => {
        if (req.body == null) {
            res.send({ 'code': 'failed', 'message': 'cannot parse request body.' })
        }
        var rss = {
            name: req.body.name,
            image: req.body.image,
            link: req.body.link,
            description: req.body.description,
            type: 'rss'
        }
        rssspider.saveRSSSource(rss).then(() => { res.send({ 'code': 'success' }); return next() })
    })
};

