const jandan = require("./jandan")
const rss = require("./rss")
const newsapi = require("./newsapi")
const config = require("../config")
const models = require("../models")
const queue = require('../queue')

queue.process('jandan update', (job, done) => {
    try {
        jandan.getAllComment()
        done()
    } catch (error) {
        done(error)
    }
})

queue.process('rss update', (job, done) => {
    try {
        rss.getAllRss()
        done()
    } catch (error) {
        done(error)
    }
})

queue.process('newsapi update', (job, done) => {
    try {
        newsapi.getAllNews()
        done()
    } catch (error) {
        done(error)
    }
})

class Spider {

    start() {
        update_jandan()
        update_rss()
        update_newsapi()
    }

    update_jandan(){
        return queue.create('jandan update', {
            title: 'Regular update all sources from jandan'
        })
        .attempts(3)
        .delay(config.SPIDER_INTERVAL)
        .removeOnComplete(true)
        .on('complete',(result)=>update_jandan())
        .on('failed', (errorMessage)=>console.log('jandan job failed:%s',errorMessage))
        .save()
    }

    update_rss(){
        return queue.create('rss update', {
            title: 'Regular update all sources from rss'
        })
        .attempts(3)
        .delay(config.SPIDER_INTERVAL)
        .removeOnComplete(true)
        .on('complete',(result)=>update_rss())
        .on('failed', (errorMessage)=>console.log('rss job failed:%s',errorMessage))
        .save()
    }

    update_newsapi(){
        return queue.create('newsapi update', {
            title: 'Regular update all sources from newsapi'
        })
        .attempts(3)
        .delay(config.SPIDER_INTERVAL)
        .removeOnComplete(true)
        .on('complete',(result)=>update_newsapi())
        .on('failed', (errorMessage)=>console.log('newsapi job failed:%s',errorMessage))
        .save()
    }
}

module.exports = Spider