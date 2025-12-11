'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('SellerOrderItems', [
      {
        seller_order_item_id: 1, seller_order_id: 1, specialist_inventory_id: 1, quantity: 2, unit_price: 150.00,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        seller_order_item_id: 2, seller_order_id: 1, specialist_inventory_id: 2, quantity: 1, unit_price: 135.00,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        seller_order_item_id: 3, seller_order_id: 2, specialist_inventory_id: 5, quantity: 2, unit_price: 300.00,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        seller_order_item_id: 4, seller_order_id: 3, specialist_inventory_id: 7, quantity: 1, unit_price: 1200.00,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        seller_order_item_id: 5, seller_order_id: 4, specialist_inventory_id: 6, quantity: 1, unit_price: 270.00,
        createdAt: new Date(), updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SellerOrderItems', null, {});
  }
};
