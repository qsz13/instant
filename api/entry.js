'use strict';
var models = require("../models")

module.exports = (server) => {

    server.get('/source/:id/entry', (req, res, next) => {
        models.Entry.findAll({ where: { SourceId: req.params.id } }).then((results) => {
            res.charSet('utf-8');
            res.send(res.paginate.getPaginatedResponse(results));
            return next();
        })
    });

};
