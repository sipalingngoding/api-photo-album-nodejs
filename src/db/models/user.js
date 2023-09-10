'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Photo,{
        foreignKey :'userId',
        onDelete : 'CASCADE',
        onUpdate :'CASCADE'
      });

      User.hasMany(models.Photo,{
        foreignKey :'userId',
        onDelete : 'CASCADE',
        onUpdate :'CASCADE'
      })
    }
  }
  User.init({
    email: {
      type : DataTypes.STRING,
      allowNull : false
    },
    password : {
      type :DataTypes.STRING,
      allowNull : false,
    },
    full_name : {
      type :DataTypes.STRING,
      allowNull : false
    },
    age : {
      type :DataTypes.INTEGER,
      allowNull : false,
    },
    address: {
      type : DataTypes.STRING,
      allowNull: false,
    },
    phone_number :{
     type : DataTypes.STRING,
      allowNull : false,
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};