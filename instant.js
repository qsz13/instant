var server = require('./api')
var Spider = require('./spider')
var config = require('./config')

server.listen(config.PORT, config.HOST, function () {
    console.log("Listening on " + config.HOST + ", port " + config.PORT)
});