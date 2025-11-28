'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('elements', [
      {
        element_id: 1,
        element_name: 'Fire',
        description: 'The element of flames, heat, and destruction. Fire spells are known for their raw damage output.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        element_id: 2,
        element_name: 'Water',
        description: 'The element of flow, healing, and adaptability. Water spells can heal allies or overwhelm enemies.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        element_id: 3,
        element_name: 'Earth',
        description: 'The element of strength, stability, and defense. Earth spells provide protection and durability.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        element_id: 4,
        element_name: 'Air',
        description: 'The element of speed, freedom, and precision. Air spells are swift and hard to dodge.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        element_id: 5,
        element_name: 'Lightning',
        description: 'The element of electricity and storms. Lightning spells strike with incredible speed and power.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        element_id: 6,
        element_name: 'Ice',
        description: 'The element of cold and control. Ice spells can freeze enemies and slow their movements.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        element_id: 7,
        element_name: 'Nature',
        description: 'The element of life and growth. Nature spells harness the power of plants and animals.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        element_id: 8,
        element_name: 'Shadow',
        description: 'The element of darkness and stealth. Shadow spells are perfect for deception and ambush.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('elements', null, {});
  }
};
