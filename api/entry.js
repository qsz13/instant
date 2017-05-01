'use strict';
var models = require("../models")

module.exports = (server) => {

    server.get('/source/:id/entry', async (req, res, next) => {
        try {
            console.log(req.paginate.page * req.paginate.per_page)
            const results = await models.Entry.findAndCountAll({
                where: { SourceId: req.params.id },
                offset: (req.paginate.page - 1) * req.paginate.per_page,
                limit: req.paginate.per_page,
                order: [['createdAt', 'DESC']]
            })

            res.charSet('utf-8');
            res.paginate.send(results.rows, results.count);
        } catch (error) {
            res.send({ 'code': 'failed', 'message': error.message })
        }

    });

    server.get('/entry', async (req, res, next) => {
        try {
            const results = await models.Entry.findAndCountAll({
                offset: (req.paginate.page - 1) * req.paginate.per_page,
                limit: req.paginate.per_page,
                order: [['createdAt', 'DESC']],
                include: [{
                    model: models.Source
                }]
            })
            res.charSet('utf-8');
            res.paginate.send(results.rows, results.count);

        } catch (error) {
            res.send({ 'code': 'failed', 'message': error.message })
        }
    });

};

