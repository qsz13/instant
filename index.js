var express = require('express')
var Spider = require('./spider/spider')
var config = require('./config')

var app = express()
app.get('/', function (req, res) {
  res.send('Hello World!')
})


app.listen(config.PORT, function () {
  console.log('Example app listening on port 3000!')
})

var spider = new Spider();
spider.start()