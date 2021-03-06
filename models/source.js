var mongoose = require('mongoose');


var sourceSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    image: String,
    link: String,
    description: String,
    type: String,
}, {
        timestamps: true
    }
);

module.exports = mongoose.model('Source', sourceSchema);

// "use strict";

// module.exports = function (sequelize, DataTypes) {
//     var Source = sequelize.define('Source', {
//         id: {
//             type: DataTypes.INTEGER,
//             autoIncrement: true,
//             primaryKey: true
//         },
//         sid: {
//             type: DataTypes.TEXT,
//             unique: true
//         },
//         name: {
//             type: DataTypes.TEXT
//         },
//         image: {
//             type: DataTypes.TEXT
//         },
//         link: {
//             type: DataTypes.TEXT,
//             unique: true
//         },
//         description: {
//             type: DataTypes.TEXT
//         },
//         type: {
//             type: DataTypes.STRING
//         }
//     }, {
//             underscored: true,
//             freezeTableName: true,
//             classMethods: {
//                 associate: function (models) {
//                     Source.hasMany(models.Entry)
//                 }
//             }
//         });

//     Source.getSourcesOfType = async function (type) {
//         return await Source.findAll({ where: { type: type }, raw: true }).catch(function (err) {
//             console.log(err)
//         })
//     }


//     return Source
// }