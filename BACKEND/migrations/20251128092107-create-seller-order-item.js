'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SellerOrderItems', {
      seller_order_item_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      seller_order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'SellerOrders',
          key: 'seller_order_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      specialist_inventory_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'SpecialistInventories',
          key: 'specialist_inventory_id'  // CHANGED: from 'inventory_id' to 'specialist_inventory_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      unit_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
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
    await queryInterface.dropTable('SellerOrderItems');
  }
};