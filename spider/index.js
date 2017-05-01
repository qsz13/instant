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
            // await this.jandanAPISpider();
            // await this.rssSpider();
            await this.newsapiSpider();
            await this.timeout(config.SPIDER_INTERVAL);
        }
    }

    timeout(ms) {
        return new Promise((resolve, reject) => setTimeout(resolve, ms));
    }


    async jandanAPISpider() {
        await jandan.getAllComment();
    }

    async rssSpider() {
        await rss.getAllRss();
    }

    async newsapiSpider() {
        await newsapi.getAllNews();
    }


}

module.exports = Spider;