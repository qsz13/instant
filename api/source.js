'use strict';
var models = require("../models")

module.exports = (server) => {

    server.get('/source', (req, res, next) => {
        models.Source.findAll().then((results) => {
            res.send(results);
            return next();
        })
    });



};

