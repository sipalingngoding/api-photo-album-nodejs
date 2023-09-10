'use strict';

const {lastPkUser} = require("../../../test/util-test");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Photos',[
      {
        title : 'Photo diory',
        caption :'Wisuda',
        image : 'https://avatars.githubusercontent.com/u/92094174?v=4',
        userId : await lastPkUser() - 1,
        createdAt : new Date(),
        updatedAt : new Date(),
      },
      {
        title : 'Photo budiman',
        caption :'Kerja',
        image : 'https://avatars.githubusercontent.com/u/92094174?v=4',
        userId : await lastPkUser(),
        createdAt : new Date(),
        updatedAt : new Date(),
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkUpdate('Photos',null,{});
  }
};
