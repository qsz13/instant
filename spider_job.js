const kue     = require( 'kue' )
  , express = require( 'restify' )
  , config  = require('./config')
  , Spider  = require('./spider')

// create our job queue
const jobs = kue.createQueue();

// start redis with $ redis-server

// Do a regular update
function regular_update() {
  jobs.create( 'jandan update', {
    title: 'Regular update all sources from jandan'
  } ).attempts(3).removeOnComplete( true ).save();
  jobs.create( 'rss update', {
    title: 'Regular update all sources from rss'
  } ).attempts(3).removeOnComplete( true ).save();
  jobs.create( 'newsapi update', {
    title: 'Regular update all sources from newsapi'
  } ).attempts(3).removeOnComplete( true ).save();
  setTimeout( regular_update, config.SPIDER_INTERVAL );
}

regular_update();

jobs.process('jandan update',async (job,done)=>{
    const spider = new Spider()
    await spider.jandanAPISpider()
    done()
})

jobs.process('rss update',async (job,done)=>{
    const spider = new Spider()
    await spider.rssSpider()
    done()
})

jobs.process('newsapi update',async (job,done)=>{
    const spider = new Spider()
    await spider.newsapiSpider()
    done()
})

jobs.on('complete', function(errorMessage, doneAttempts){
  console.log('Job completed\n'+new Date());

}).on('failed attempt', function(errorMessage, doneAttempts){
  console.log('Job failed\n'+errorMessage);

}).on('failed', function(errorMessage){
  console.log('Job failed\n'+errorMessage);
})

// start the UI
// const app = express.createServer();
// app.use( express.basicAuth( 'daniel', 'jeffrey' ) );
// app.use( kue.app );
// app.listen( config.KUE_PORT, config.HOST, ()=> {
//     console.log("Kue UI listening on " + config.HOST + ", port " + config.KUE_PORT)
// });