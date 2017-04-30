"use strict";

module.exports = function (sequelize, DataTypes) {
  var Entry = sequelize.define('Entry', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    entry_id: {
      type: DataTypes.STRING,
      unique: 'entrySourceKey'
    },
    title: {
      type: DataTypes.STRING
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
      unique: 'entrySourceKey'
    }
  }, {
      freezeTableName: true,
      classMethods: {
        associate: function (models) {
          Entry.belongsTo(models.Source, {
            foreignKey: {
              allowNull: false
            }
          });
        }
      }
    }
  );

  Entry.saveEntry = function (entry) {
    Entry.upsert(entry).catch((err) => {
      console.log(err)
    })
  }




  return Entry
}