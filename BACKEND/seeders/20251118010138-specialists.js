'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Specialists', [
      {
        user_id: 2,
        shop_name: "Pyra's Flame Emporium",
        specialty_element_id: 1,
        reputation_rating: 9.50,
        contact_info: 'pyra@firemage.com | Tower District',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: 3,
        shop_name: "Aquos' Aquatic Arsenal",
        specialty_element_id: 2,
        reputation_rating: 9.20,
        contact_info: 'aquos@watermage.com | Harbor Quarter',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: 4,
        shop_name: "Terra's Stone Sanctuary",
        specialty_element_id: 3,
        reputation_rating: 8.80,
        contact_info: 'terra@earthmage.com | Mountain Base',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: 5,
        shop_name: "Zephyr's Sky Shop",
        specialty_element_id: 4,
        reputation_rating: 9.00,
        contact_info: 'zephyr@airmage.com | Cloud District',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Specialists', null, {});
  }
};
