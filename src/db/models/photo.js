'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {
    static associate(models) {
      Photo.belongsTo(models.User,{
        foreignKey : 'userId'
      });
      Photo.hasMany(models.Comment,{
        foreignKey : 'photoId',
        onDelete : 'CASCADE',
        onUpdate : 'CASCADE'
      });
    }
  }
  Photo.init({
    title: {
      type : DataTypes.STRING,
    },
    caption : {
      type :DataTypes.STRING,
    },
    image : {
      type :DataTypes.STRING,
    },
    userId : DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Photo',
  });
  return Photo;
};