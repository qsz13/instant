var config = {}

config.jandan = {}
config.newsapi = {}

config.HOST = process.env.HOST_IP || "127.0.0.1"
config.PORT = process.env.PORT || 8080
config.KUE_PORT = process.env.KUE_PORT || 8081
config.SPIDER_INTERVAL = 5 * 60 * 1000
config.DATABASE_URL = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/instant"
config.API_PATH  = process.env.API_PATH || "/instant"
config.REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379"
config.REDIS_PREFIX = process.env.REDIS_PREFIX || "instant"

// jandan
config.jandan.OOXX_API_URL = "http://jandan.net/?oxwlxojflwblxbsapi=jandan.get_ooxx_comments&page=1"
config.jandan.PIC_API_URL = "http://jandan.net/?oxwlxojflwblxbsapi=jandan.get_pic_comments&page=1"
config.jandan.URL = "http://jandan.net"

// newsapi
config.newsapi.SOURCE_URL = "https://newsapi.org/v1/sources?language=en&country=us"
config.newsapi.ARTICLE_URL = "https://newsapi.org/v1/articles"
config.newsapi.API_KEY = "00e60e21d3b04652b7cdb57b94d478ba"


module.exports = config;
