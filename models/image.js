"use strict";

module.exports = function (sequelize, DataTypes) {
    var Image = sequelize.define('Image', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        url: {
            type: DataTypes.STRING,
            unique: true
        }
    }, {
            freezeTableName: true,
            classMethods: {
                associate: function (models) {
                    Image.belongsTo(models.Entry, {
                        foreignKey: {
                            allowNull: false
                        }
                    });
                }
            }
        }
    );




    return Image
}