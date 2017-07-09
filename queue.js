const kue = require('kue')
const config = require('./config')

// create our job queue
module.exports = kue.createQueue({
  prefix: config.REDIS_PREFIX,
  redis: config.REDIS_URL
})
