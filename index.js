var server = require('./api')
var Spider = require('./spider/spider')
var config = require('./config')
var models = require('./models');


var spider = new Spider();

models.sequelize.sync().then([server.listen(config.PORT, function () {
    console.log('%s listening at %s', server.name, server.url);
}), spider.start()]);
