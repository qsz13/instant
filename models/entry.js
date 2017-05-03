var mongoose = require('mongoose');


var entrySchema = mongoose.Schema({
    eid: String,
    title: String,
    url: String,
    image: [String],
    description: String,
    content: String,
    source: { type: String, ref: 'Source' }
}, {
        timestamps: true
    }
);

entrySchema.index({ eid: 1, source: 1 }, { unique: true });

module.exports = mongoose.model('Entry', entrySchema);













// "use strict";

// module.exports = function (sequelize, DataTypes) {
//   var Entry = sequelize.define('Entry', {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true
//     },
//     eid: {
//       type: DataTypes.TEXT,
//       unique: 'entry_source_unique'
//     },
//     title: {
//       type: DataTypes.TEXT
//     },
//     link: {
//       type: DataTypes.TEXT
//     },
//     description: {
//       type: DataTypes.TEXT
//     },
//     content: {
//       type: DataTypes.TEXT
//     },
//     score: {
//       type: DataTypes.INTEGER,
//     },
//     published_at: {
//       type: DataTypes.DATE
//     },
//     source_id: {
//       type: DataTypes.INTEGER,
//       unique: 'entry_source_unique'
//     }
//   }, {
//       underscored: true,
//       freezeTableName: true,
//       classMethods: {
//         associate: function (models) {
//           Entry.belongsTo(models.Source, {
//             foreignKey: {
//               allowNull: false
//             }
//           });
//           Entry.hasMany(models.Image);
//         }
//       }
//     }
//   );