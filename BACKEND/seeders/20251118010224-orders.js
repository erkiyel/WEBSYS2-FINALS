'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Orders', [
      {
        order_id: 1, customer_id: 6, total_amount: 450.00, status: 'Completed',
        order_date: new Date('2025-01-20T10:30:00'), createdAt: new Date(), updatedAt: new Date()
      },
      {
        order_id: 2, customer_id: 7, total_amount: 600.00, status: 'Completed',
        order_date: new Date('2025-01-21T14:15:00'), createdAt: new Date(), updatedAt: new Date()
      },
      {
        order_id: 3, customer_id: 8, total_amount: 1200.00, status: 'Pending',
        order_date: new Date('2025-01-22T09:00:00'), createdAt: new Date(), updatedAt: new Date()
      },
      {
        order_id: 4, customer_id: 6, total_amount: 270.00, status: 'Completed',
        order_date: new Date('2025-01-23T16:45:00'), createdAt: new Date(), updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Orders', null, {});
  }
};
