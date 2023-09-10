'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      email : 'diory@gmail.com',
      password : bcrypt.hashSync('password1',10),
      full_name :'Diory Pribadi Sinaga',
      age : 22,
      address : 'Bandung',
      phone_number :'0832431223',
      createdAt : new Date(),
      updatedAt : new Date(),
    },{
      email : 'budiman@gmail.com',
      password : bcrypt.hashSync('password2',10),
      full_name :'Budiman',
      age : 23,
      address : 'Jakarta',
      phone_number :'08324331',
      createdAt : new Date(),
      updatedAt : new Date(),
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
