var MongoClient = require('mongodb').MongoClient
var config = require('./config')


exports.initDB = function () {
    // Use connect method to connect to the Server
    MongoClient.connect(config.DATABASE_URL, function (err, db) {
        if (err) {
            console.log("DB Connection failed");
            return
        }
        db.createIndex('entry', { eid: 1, source_id: 1 }, { unique: true }, (err, index) => { if (err) console.log(err) })
    });
}


