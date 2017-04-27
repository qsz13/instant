var express = require('express')
var Spider = require('./spider/spider')
var config = require('./config')
var models = require('./models');

var app = express()
app.get('/', function (req, res) {
  res.send('Hello World!')
})
var spider = new Spider();


models.sequelize.sync().then([app.listen(config.PORT, function () {
  console.log('Example app listening on port '+config.PORT+'!')
}),spider.start()]);


