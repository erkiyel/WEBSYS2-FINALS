'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Scrolls', {
      scroll_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      scroll_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      base_power: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      rarity: {
        type: Sequelize.ENUM('Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'),
        allowNull: false,
        defaultValue: 'Common'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Scrolls');
  }
};