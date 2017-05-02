var server = require('./api')
// var Spider = require('./spider')
// var config = require('./config')
// var models = require('./models');


// var spider = new Spider();

// models.sequelize.sync().then([server.listen(config.PORT, function () {
//     console.log('%s listening at %s', server.name, server.url);
// }), spider.start()]);

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

server.listen(server_port, server_ip_address, function () {
    console.log("Listening on " + server_ip_address + ", port " + server_port)
});