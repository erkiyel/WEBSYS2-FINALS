'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('orderitems', [
      {
        order_item_id: 1, order_id: 1, shop_inventory_id: 1, quantity: 2, unit_price: 150.00,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        order_item_id: 2, order_id: 1, shop_inventory_id: 2, quantity: 1, unit_price: 135.00,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        order_item_id: 3, order_id: 2, shop_inventory_id: 5, quantity: 2, unit_price: 300.00,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        order_item_id: 4, order_id: 3, shop_inventory_id: 7, quantity: 1, unit_price: 1200.00,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        order_item_id: 5, order_id: 4, shop_inventory_id: 6, quantity: 1, unit_price: 270.00,
        createdAt: new Date(), updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('orderitems', null, {});
  }
};
