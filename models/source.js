"use strict";

module.exports = function (sequelize, DataTypes) {
    var Source = sequelize.define('Source', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        sid: {
            type: DataTypes.STRING,
            unique: true
        },
        name: {
            type: DataTypes.STRING
        },
        image: {
            type: DataTypes.STRING
        },
        link: {
            type: DataTypes.STRING,
            unique: true
        },
        description: {
            type: DataTypes.TEXT
        },
        type: {
            type: DataTypes.STRING
        }
    }, {
            freezeTableName: true,
            classMethods: {
                associate: function (models) {
                    Source.hasMany(models.Entry)
                }
            }
        });

    Source.getSourcesOfType = async function (type) {
        return await Source.findAll({ where: { type: type }, raw: true })
    }


    return Source
}