'use strict';
var models = require("../models")
var rssspider = require("../spider/rss")

module.exports = (server) => {

    server.get('/source', async (req, res, next) => {
        const results = await models.Source.findAll();
        res.send(results);
    });

    server.post("/rss-source", async (req, res, next) => {
        if (req.body == null) {
            res.send({ 'code': 'failed', 'message': 'cannot parse request body.' })
        }
        else{
            var rss = {
                name: req.body.name,
                image: req.body.image,
                link: req.body.link,
                description: req.body.description,
                type: 'rss'
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

