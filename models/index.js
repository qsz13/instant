var mongoose = require('mongoose');
var config = require('../config')

mongoose.Promise = global.Promise;

mongoose.connect(config.DATABASE_URL);

mongoose.connection.on('connected', function () {
    console.log('Mongoose connection open to ' + config.DATABASE_URL);
    // initDB()
});

mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose connection disconnected through app termination');
        process.exit(0);
    });
});


function initDB() {
    MongoClient.connect(config.DATABASE_URL, function (err, db) {
        if (err) {
            console.log("DB Connection failed");
            return
        }
        db.createIndex('entry', { eid: 1, source_id: 1 }, { unique: true }, (err, index) => { if (err) console.log(err) })
        // TODO should close db connetcion
    });
}

// 'use strict';

// var fs = require('fs');
// var path = require('path');
// var basename = path.basename(module.filename);
// var env = process.env.NODE_ENV || 'development';
// var config = require('../config.js');
// var db = {};


// var MongoClient = require('mongodb').MongoClient
//   , assert = require('assert');








// var sequelize = new Sequelize(config.DATABASE_URL, { logging: console.log });
// fs
//   .readdirSync(__dirname)
//   .filter(function (file) {
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
//   })
//   .forEach(function (file) {
//     var model = sequelize['import'](path.join(__dirname, file));
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(function (modelName) {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;
