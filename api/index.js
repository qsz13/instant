var restify = require('restify');
var plugins = require('restify-plugins');
var source = require('./source')


const server = restify.createServer({
    name: 'instant',
    version: '1.0.0'
});

server.pre(restify.pre.userAgentConnection());
server.use(plugins.acceptParser(server.acceptable));
server.use(plugins.queryParser());
server.use(plugins.bodyParser());


source(server)



module.exports = server

