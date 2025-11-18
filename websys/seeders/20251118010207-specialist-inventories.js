'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('specialistinventories', [
      {
        inventory_id: 1, specialist_id: 1, scroll_id: 1, stock_quantity: 50,
        source_price: 100.00, quality_rating: 9.50, is_specialty: true,
        last_updated: new Date('2025-01-10'), createdAt: new Date(), updatedAt: new Date()
      },
      {
        inventory_id: 2, specialist_id: 1, scroll_id: 7, stock_quantity: 15,
        source_price: 800.00, quality_rating: 9.80, is_specialty: true,
        last_updated: new Date('2025-01-10'), createdAt: new Date(), updatedAt: new Date()
      },
      {
        inventory_id: 3, specialist_id: 1, scroll_id: 11, stock_quantity: 5,
        source_price: 2000.00, quality_rating: 10.00, is_specialty: true,
        last_updated: new Date('2025-01-10'), createdAt: new Date(), updatedAt: new Date()
      },
      {
        inventory_id: 4, specialist_id: 1, scroll_id: 6, stock_quantity: 10,
        source_price: 150.00, quality_rating: 6.00, is_specialty: false,
        last_updated: new Date('2025-01-10'), createdAt: new Date(), updatedAt: new Date()
      },
      {
        inventory_id: 5, specialist_id: 2, scroll_id: 2, stock_quantity: 60,
        source_price: 90.00, quality_rating: 9.20, is_specialty: true,
        last_updated: new Date('2025-01-10'), createdAt: new Date(), updatedAt: new Date()
      },
      {
        inventory_id: 6, specialist_id: 2, scroll_id: 8, stock_quantity: 12,
        source_price: 750.00, quality_rating: 9.50, is_specialty: true,
        last_updated: new Date('2025-01-10'), createdAt: new Date(), updatedAt: new Date()
      },
      {
        inventory_id: 7, specialist_id: 2, scroll_id: 6, stock_quantity: 40,
        source_price: 180.00, quality_rating: 9.00, is_specialty: true,
        last_updated: new Date('2025-01-10'), createdAt: new Date(), updatedAt: new Date()
      },
      {
        inventory_id: 8, specialist_id: 2, scroll_id: 1, stock_quantity: 15,
        source_price: 70.00, quality_rating: 6.50, is_specialty: false,
        last_updated: new Date('2025-01-10'), createdAt: new Date(), updatedAt: new Date()
      },
      {
        inventory_id: 9, specialist_id: 3, scroll_id: 3, stock_quantity: 55,
        source_price: 110.00, quality_rating: 8.80, is_specialty: true,
        last_updated: new Date('2025-01-10'), createdAt: new Date(), updatedAt: new Date()
      },
      {
        inventory_id: 10, specialist_id: 3, scroll_id: 15, stock_quantity: 20,
        source_price: 700.00, quality_rating: 9.00, is_specialty: true,
        last_updated: new Date('2025-01-10'), createdAt: new Date(), updatedAt: new Date()
      },
      {
        inventory_id: 11, specialist_id: 3, scroll_id: 7, stock_quantity: 8,
        source_price: 750.00, quality_rating: 8.50, is_specialty: true,
        last_updated: new Date('2025-01-10'), createdAt: new Date(), updatedAt: new Date()
      },
      {
        inventory_id: 12, specialist_id: 4, scroll_id: 4, stock_quantity: 45,
        source_price: 95.00, quality_rating: 9.00, is_specialty: true,
        last_updated: new Date('2025-01-10'), createdAt: new Date(), updatedAt: new Date()
      },
      {
        inventory_id: 13, specialist_id: 4, scroll_id: 5, stock_quantity: 30,
        source_price: 200.00, quality_rating: 8.80, is_specialty: true,
        last_updated: new Date('2025-01-10'), createdAt: new Date(), updatedAt: new Date()
      },
      {
        inventory_id: 14, specialist_id: 4, scroll_id: 13, stock_quantity: 10,
        source_price: 900.00, quality_rating: 9.20, is_specialty: true,
        last_updated: new Date('2025-01-10'), createdAt: new Date(), updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('specialistinventories', null, {});
  }
};