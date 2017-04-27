var jandan = require("./jandan")
var config = require("../config")

class Spider {
    constructor () {
        this.jandanAPISpider = this.jandanAPISpider.bind(this);
    }

    async start() {

        while(true) {
            await Promise.all([
                this.jandanAPISpider(),
                this.timeout(config.SPIDER_INTERVAL)
            ])
        }   
    }

    timeout(ms) {
        return new Promise((resolve, reject) => setTimeout(resolve, ms));
    }

  
    jandanAPISpider() {
        jandan.getAllComment()
    }
    jandanTopSpider() {

    }

    
    
}

module.exports = Spider;