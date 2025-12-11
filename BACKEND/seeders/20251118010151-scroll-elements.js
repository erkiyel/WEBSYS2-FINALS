'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ScrollElements', [
      { scroll_id: 1, element_id: 1, createdAt: new Date(), updatedAt: new Date() },
      { scroll_id: 2, element_id: 2, createdAt: new Date(), updatedAt: new Date() },
      { scroll_id: 3, element_id: 3, createdAt: new Date(), updatedAt: new Date() },
      { scroll_id: 4, element_id: 4, createdAt: new Date(), updatedAt: new Date() },
      { scroll_id: 5, element_id: 5, createdAt: new Date(), updatedAt: new Date() },
      { scroll_id: 6, element_id: 6, createdAt: new Date(), updatedAt: new Date() },
      { scroll_id: 7, element_id: 1, createdAt: new Date(), updatedAt: new Date() },
      { scroll_id: 7, element_id: 3, createdAt: new Date(), updatedAt: new Date() },
      { scroll_id: 8, element_id: 2, createdAt: new Date(), updatedAt: new Date() },
      { scroll_id: 9, element_id: 8, createdAt: new Date(), updatedAt: new Date() },
      { scroll_id: 10, element_id: 7, createdAt: new Date(), updatedAt: new Date() },
      { scroll_id: 11, element_id: 1, createdAt: new Date(), updatedAt: new Date() },
      { scroll_id: 12, element_id: 6, createdAt: new Date(), updatedAt: new Date() },
      { scroll_id: 12, element_id: 2, createdAt: new Date(), updatedAt: new Date() },
      { scroll_id: 13, element_id: 5, createdAt: new Date(), updatedAt: new Date() },
      { scroll_id: 13, element_id: 4, createdAt: new Date(), updatedAt: new Date() },
      { scroll_id: 14, element_id: 1, createdAt: new Date(), updatedAt: new Date() },
      { scroll_id: 14, element_id: 2, createdAt: new Date(), updatedAt: new Date() },
      { scroll_id: 15, element_id: 3, createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ScrollElements', null, {});
  }
};
