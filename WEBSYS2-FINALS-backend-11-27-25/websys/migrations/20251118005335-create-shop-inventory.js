'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ShopInventories', {
      shop_inventory_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      scroll_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Scrolls',
          key: 'scroll_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      specialist_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Specialists',
          key: 'specialist_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      purchase_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      selling_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      quality_rating: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: false
      },
      acquired_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
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
    await queryInterface.dropTable('ShopInventories');
  }
};