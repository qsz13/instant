var jandan = require("./jandan")
var rss = require("./rss")
var newsapi = require("./newsapi")
var config = require("../config")

class Spider {
    constructor() {
        this.jandanAPISpider = this.jandanAPISpider.bind(this);
    }

    async start() {
        while (true) {
            await this.jandanAPISpider();
            await this.rssSpider();
            await this.newsapiSpider();
            await this.timeout(config.SPIDER_INTERVAL);
        }
    }

    timeout(ms) {
        return new Promise((resolve, reject) => setTimeout(resolve, ms));
    }


    async jandanAPISpider() {
        try {
            await jandan.getAllComment();
        } catch (err) {
            console.log(err)
        }
    }

    async rssSpider() {
        try {
            await rss.getAllRss();
        } catch (err) {
            console.log(err)
        }
    }

    async newsapiSpider() {
        try {
            await newsapi.getAllNews();

        } catch (err) {
            console.log(err)
        }
    }


}

module.exports = Spider;