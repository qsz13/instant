const kue     = require( 'kue' )
  , config  = require('./config')

// create our job queue
module.exports = kue.createQueue({
  prefix:config.REDIS_PREFIX,
  redis:config.REDIS_URL
});