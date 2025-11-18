'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('shopinventories', [
      {
        shop_inventory_id: 1, scroll_id: 1, specialist_id: 1, quantity: 20,
        purchase_price: 100.00, selling_price: 150.00, quality_rating: 9.50,
        acquired_date: new Date('2025-01-15'), createdAt: new Date(), updatedAt: new Date()
      },
      {
        shop_inventory_id: 2, scroll_id: 2, specialist_id: 2, quantity: 25,
        purchase_price: 90.00, selling_price: 135.00, quality_rating: 9.20,
        acquired_date: new Date('2025-01-15'), createdAt: new Date(), updatedAt: new Date()
      },
      {
        shop_inventory_id: 3, scroll_id: 3, specialist_id: 3, quantity: 18,
        purchase_price: 110.00, selling_price: 165.00, quality_rating: 8.80,
        acquired_date: new Date('2025-01-15'), createdAt: new Date(), updatedAt: new Date()
      },
      {
        shop_inventory_id: 4, scroll_id: 4, specialist_id: 4, quantity: 22,
        purchase_price: 95.00, selling_price: 145.00, quality_rating: 9.00,
        acquired_date: new Date('2025-01-15'), createdAt: new Date(), updatedAt: new Date()
      },
      {
        shop_inventory_id: 5, scroll_id: 5, specialist_id: 4, quantity: 15,
        purchase_price: 200.00, selling_price: 300.00, quality_rating: 8.80,
        acquired_date: new Date('2025-01-16'), createdAt: new Date(), updatedAt: new Date()
      },
      {
        shop_inventory_id: 6, scroll_id: 6, specialist_id: 2, quantity: 20,
        purchase_price: 180.00, selling_price: 270.00, quality_rating: 9.00,
        acquired_date: new Date('2025-01-16'), createdAt: new Date(), updatedAt: new Date()
      },
      {
        shop_inventory_id: 7, scroll_id: 7, specialist_id: 1, quantity: 5,
        purchase_price: 800.00, selling_price: 1200.00, quality_rating: 9.80,
        acquired_date: new Date('2025-01-17'), createdAt: new Date(), updatedAt: new Date()
      },
      {
        shop_inventory_id: 8, scroll_id: 8, specialist_id: 2, quantity: 4,
        purchase_price: 750.00, selling_price: 1100.00, quality_rating: 9.50,
        acquired_date: new Date('2025-01-17'), createdAt: new Date(), updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('shopinventories', null, {});
  }
};
