const jobs = require('./queue')
  , Spider = require('./spider')

jobs.on('job complete', function (id, result) {
  console.log('Job %s completed at %s', id, new Date());
}).on('job failed attempt', function (errorMessage, doneAttempts) {
  console.log('Job failed\n' + errorMessage)
}).on('job failed', function (errorMessage) {
  console.log('Job failed\n' + errorMessage)
})

const spider = new Spider()
spider.start()