const jandan = require("./jandan")
const rss = require("./rss")
const newsapi = require("./newsapi")
const config = require("../config")
const models = require("../models")

class Spider {
    async start() {
        await this.jandanAPISpider()
        await this.rssSpider()
        await this.newsapiSpider()
    }

    async jandanAPISpider() {
        await jandan.getAllComment()
    }

    async rssSpider() {
        await rss.getAllRss()
    }

    async newsapiSpider() {
        await newsapi.getAllNews()
    }

}


module.exports = Spider