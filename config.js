var config = {};

config.jandan = {};

config.PORT = process.env.PORT || 3000;
config.SPIDER_INTERVAL = 10*1000;
config.DATABASE_URL = process.env.DATABASE_URL || "postgres://postgres:postgres@127.0.0.1:5432/instant?sslmode=disable"

// jandan
config.jandan.OOXX_API_URL = "http://jandan.net/?oxwlxojflwblxbsapi=jandan.get_ooxx_comments&page=1"
config.jandan.PIC_API_URL = "http://jandan.net/?oxwlxojflwblxbsapi=jandan.get_pic_comments&page=1"
config.jandan.URL = "http://jandan.net"

module.exports = config;