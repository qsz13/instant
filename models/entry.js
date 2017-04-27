"use strict";

module.exports = function(sequelize, DataTypes) {
  var Entry = sequelize.define('Entry', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    entry_id: {
        type: DataTypes.STRING
    },
    title:{
      type: DataTypes.STRING
    },
    link: {
      type: DataTypes.STRING
    },
    description:{
      type: DataTypes.STRING
    },
    content:{
      type:DataTypes.STRING
    }
  }, {
    freezeTableName: true,
    classMethods: {
      associate: function(models) {
        Entry.belongsTo(models.Source, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
      }
}
  }
  );
  return Entry
}