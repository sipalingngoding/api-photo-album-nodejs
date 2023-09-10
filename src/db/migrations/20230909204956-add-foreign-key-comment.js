'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('Comments',{
      fields : ['userId'],
      type : 'foreign key',
      name : 'add foreign key users',
      references : {
        table : 'Users',
        field : 'id',
      },
      onDelete : 'CASCADE',
      onUpdate : 'CASCADE',
    })
    await queryInterface.addConstraint('Comments',{
      fields : ['photoId'],
      type : 'foreign key',
      name : 'add foreign key photos',
      references : {
        table : 'Photos',
        field : 'id',
      },
      onDelete : 'CASCADE',
      onUpdate : 'CASCADE',
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Comments','add foreign key users');
    await queryInterface.removeConstraint('Comments','add foreign key photos');
  }
};
