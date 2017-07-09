const models = require('../models');
const Source = require('../models/source');
const jandan = require('./jandan');
const rss = require('./rss');
const newsapi = require('./newsapi');
const config = require('../config');
const queue = require('../queue');
const pushnotification = require('./pushnotification');

queue.process('jandan update', async (job, done) => {
  try {
    await jandan.getAllComment();
    done();
  } catch (error) {
    done(error);
  }
});

queue.process('rss update', async (job, done) => {
  try {
    await rss.getAllRss();
    done();
  } catch (error) {
    done(error);
  }
});

queue.process('newsapi update', async (job, done) => {
  try {
    const prev = await Source.find({ type: 'newsapi' });
    await newsapi.getAllNews();
    const curr = await Source.find({ type: 'newsapi' });
    const changes = curr - prev;
    done(changes);
  } catch (error) {
    done(error);
  }
});


class Spider {
  start() {
    this.updateJandan();
    this.updateRss();
    this.updateNewsapi();
    this.pushAll();
  }

  pushAll() {
    return queue.create('push all', {
      title: 'Regular push all entries',
    })
      .attempts(3)
      .delay(config.SPIDER_INTERVAL)
      .removeOnComplete(true)
      .on('complete', () => this.pushAll())
      .on('failed', errorMessage => console.log('push job failed:%s', errorMessage))
      .save();
  }

  updateJandan() {
    return queue.create('jandan update', {
      title: 'Regular update all sources from jandan',
    })
      .attempts(3)
      .delay(config.SPIDER_INTERVAL)
      .removeOnComplete(true)
      .on('complete', () => this.updateJandan())
      .on('failed', errorMessage => console.log('jandan job failed:%s', errorMessage))
      .save();
  }

  updateRss() {
    return queue.create('rss update', {
      title: 'Regular update all sources from rss',
    })
      .attempts(3)
      .delay(config.SPIDER_INTERVAL)
      .removeOnComplete(true)
      .on('complete', () => this.updateRss())
      .on('failed', errorMessage => console.log('rss job failed:%s', errorMessage))
      .save();
  }

  updateNewsapi() {
    return queue.create('newsapi update', {
      title: 'Regular update all sources from newsapi',
    })
      .attempts(3)
      .delay(config.SPIDER_INTERVAL)
      .removeOnComplete(true)
      .on('complete', () => this.updateNewsapi())
      .on('failed', errorMessage => console.log('newsapi job failed:%s', errorMessage))
      .save();
  }
}

module.exports = Spider;
