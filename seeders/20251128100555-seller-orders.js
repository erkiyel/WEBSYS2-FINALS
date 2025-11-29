'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('SellerOrders', [
      {
        seller_order_id: 1, user_id: 6, specialist_id: 1, order_date: new Date('2025-01-23T16:45:00'), total_amount: 450.00, status: 'Completed',
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        seller_order_id: 2, user_id: 7, specialist_id: 2, order_date: new Date('2025-01-21T14:15:00'), total_amount: 600.00, status: 'Completed', 
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        seller_order_id: 3, user_id: 8, specialist_id: 3, order_date: new Date('2025-01-21T14:15:00'), total_amount: 1200.00, status: 'Pending',
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        seller_order_id: 4, user_id: 6, specialist_id: 4, order_date: new Date('2025-01-21T14:15:00'), total_amount: 270.00, status: 'Completed',
        createdAt: new Date(), updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SellerOrders', null, {});
  }
};
