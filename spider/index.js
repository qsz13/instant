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
        try {
            await jandan.getAllComment()
        } catch (err) {
            console.log(err)
        }
    }

    async rssSpider() {
        try {
            await rss.getAllRss()
        } catch (err) {
            console.log(err)
        }
    }

    async newsapiSpider() {
        try {
            await newsapi.getAllNews()

        } catch (err) {
            console.log(err)
        }
    }


}


module.exports = Spider