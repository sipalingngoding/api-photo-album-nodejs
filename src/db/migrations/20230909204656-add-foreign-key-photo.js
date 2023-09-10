'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('Photos',{
      fields : ['userId'],
      type : 'foreign key',
      name : 'add foreign key users',
      references : {
        table : 'Users',
        field : 'id',
      },
      onDelete : 'CASCADE',
      onUpdate : 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Comments','add foreign key users');
  }
};
