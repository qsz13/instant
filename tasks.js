const jobs = require('./queue');
const Spider = require('./spider');
const kue = require('kue');
const config = require('./config');

jobs.on('job complete', (id) => {
  console.log('Job %s completed at %s', id, new Date());
}).on('job failed attempt', (errorMessage) => {
  console.log(`Job failed\n${errorMessage}`);
}).on('job failed', (errorMessage) => {
  console.log(`Job failed\n${errorMessage}`);
});

const spider = new Spider();
spider.start();

if (process.env.NODE_ENV === 'development') {
  kue.app.listen(config.KUE_PORT);
}
