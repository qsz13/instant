const jandan = require("./jandan")
const rss = require("./rss")
const newsapi = require("./newsapi")
const config = require("../config")
const models = require("../models")
const jobs = require('../queue')

jobs.process('jandan update', (job, done) => {
    try {
        jandan.getAllComment()
        done()
    } catch (error) {
        done(error)
    }
})

jobs.process('rss update', (job, done) => {
    try {
        rss.getAllRss()
        done()
    } catch (error) {
        done(error)
    }
})

jobs.process('newsapi update', (job, done) => {
    try {
        newsapi.getAllNews()
        done()
    } catch (error) {
        done(error)
    }
})

class Spider {

    start() {
        this.update = setInterval(regular_update, config.SPIDER_INTERVAL)
    }

    // Do a regular update
    regular_update() {
        jobs.create('jandan update', {
            title: 'Regular update all sources from jandan'
        }).attempts(3).removeOnComplete(true).save()
        jobs.create('rss update', {
            title: 'Regular update all sources from rss'
        }).attempts(3).removeOnComplete(true).save()
        jobs.create('newsapi update', {
            title: 'Regular update all sources from newsapi'
        }).attempts(3).removeOnComplete(true).save()
    }
}

module.exports = Spider