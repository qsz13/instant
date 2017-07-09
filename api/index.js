const restify = require('restify');
const plugins = require('restify-plugins');
const paginate = require('restify-paginate');
const source = require('./source');
const entry = require('./entry');
const user = require('./user');

const server = restify.createServer({
  name: 'instant',
  version: '1.0.0',
});

server.pre(restify.pre.userAgentConnection());
server.use(plugins.acceptParser(server.acceptable));
server.use(plugins.queryParser());
server.use(plugins.bodyParser());
server.use(restify.queryParser());
server.use(paginate(server));

server.on('uncaughtException', (err, req, res, route) => {
  console.error(`uncaught exception!${err.message}`);
});

source(server);
entry(server);
user(server);


module.exports = server;

