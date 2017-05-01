'use strict';
var models = require("../models")

module.exports = (server) => {

    server.get('/source/:id/entry', async (req, res, next) => {
        try {
            const results = await models.Entry.findAndCountAll({
                where: { source_id: req.params.id },
                offset: (req.paginate.page - 1) * req.paginate.per_page,
                limit: req.paginate.per_page,
                order: [['published_at', 'DESC'], ['created_at', 'DESC']],
                include: [{ model: models.Source }, { model: models.Image }]
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
                attributes: { exclude: ["eid"] },
                offset: (req.paginate.page - 1) * req.paginate.per_page,
                limit: req.paginate.per_page,
                order: [['published_at', 'DESC'], ['created_at', 'DESC']],
                include: [{ model: models.Source }, { model: models.Image, attributes: ['url'] }],
            })
            res.charSet('utf-8');
            res.paginate.send(results.rows, results.count);

        } catch (error) {
            res.send({ 'code': 'failed', 'message': error.message })
        }
    });

};

