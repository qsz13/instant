var restify = require('restify')
var plugins = require('restify-plugins')
var paginate = require('restify-paginate');
var source = require('./source')
var entry = require('./entry')

const server = restify.createServer({
    name: 'instant',
    version: '1.0.0'
});

server.pre(restify.pre.userAgentConnection());
server.use(plugins.acceptParser(server.acceptable));
server.use(plugins.queryParser());
server.use(plugins.bodyParser());
server.use(paginate(server));


source(server)
entry(server)


module.exports = server
