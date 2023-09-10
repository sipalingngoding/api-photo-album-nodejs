'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Comments','userId',Sequelize.INTEGER);
    await queryInterface.addColumn('Comments','photoId',Sequelize.INTEGER);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Comments','userId');
    await queryInterface.removeColumn('Comments','photoId');
  }
};
