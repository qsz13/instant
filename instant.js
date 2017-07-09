var server = require('./api')
var Spider = require('./spider')
var config = require('./config')

// var admin = require("firebase-admin");
// var serviceAccount = require("./firebase-adminsdk.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://instant-2b7b7.firebaseio.com"
// });

server.listen(config.PORT, config.HOST, function () {
    console.log("Listening on " + config.HOST + ", port " + config.PORT)
});