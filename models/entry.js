"use strict";

module.exports = function (sequelize, DataTypes) {
  var Entry = sequelize.define('Entry', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    eid: {
      type: DataTypes.TEXT,
      unique: 'entry_source_unique'
    },
    title: {
      type: DataTypes.TEXT
    },
    link: {
      type: DataTypes.TEXT
    },
    description: {
      type: DataTypes.TEXT
    },
    content: {
      type: DataTypes.TEXT
    },
    score: {
      type: DataTypes.INTEGER,
    },
    published_at: {
      type: DataTypes.DATE
    },
    source_id: {
      type: DataTypes.INTEGER,
      unique: 'entry_source_unique'
    }
  }, {
      underscored: true,
      freezeTableName: true,
      classMethods: {
        associate: function (models) {
          Entry.belongsTo(models.Source, {
            foreignKey: {
              allowNull: false
            }
          });
          Entry.hasMany(models.Image);
        }
      }
    }
  );




  return Entry
}