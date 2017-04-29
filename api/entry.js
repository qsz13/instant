'use strict';
var models = require("../models")

module.exports = (server) => {

    server.get('/source/:id/entry', async (req, res, next) => {
        
        try {
            const results = await models.Entry.findAll({ where: { SourceId: req.params.id } })
            if(results.length == 0){
                res.charSet('utf-8');
                res.send({data:[]});
            }
            else{
                res.charSet('utf-8');
                res.send(res.paginate.getPaginatedResponse(results));
            }
        } catch (error) {
            res.send({ 'code': 'failed', 'message': error.message })
        }
            
    });

};
