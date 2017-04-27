"use strict";

module.exports = function(sequelize, DataTypes) {
  var Source = sequelize.define('Source', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type:DataTypes.STRING
    },
    image: {
        type: DataTypes.STRING
    },
    link:{
      type: DataTypes.STRING
    },
    description:{
      type: DataTypes.STRING
    }
  }, {
    freezeTableName: true,
    classMethods: {
      associate: function(models) {
        Source.hasMany(models.Entry)
      }
    }
  });
  return Source
}