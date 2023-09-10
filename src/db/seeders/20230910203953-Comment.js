'use strict';

const {lastPkUser, lastPkPhoto} = require("../../../test/util-test");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Comments',[
      {
        comment: 'Comment photo diory',
        userId: await lastPkUser() - 1,
        photoId: await lastPkPhoto() - 1,
        createdAt : new Date(),
        updatedAt : new Date(),
      },
      {
        comment : 'Comment photo budiman',
        userId : await lastPkUser(),
        photoId : await lastPkPhoto(),
        createdAt : new Date(),
        updatedAt : new Date(),
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
