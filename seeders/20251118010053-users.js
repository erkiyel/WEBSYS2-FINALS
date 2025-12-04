'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        username: 'admin_seller',
        email: 'seller@magicshop.com',
        password_hash: '$2b$10$lIlIvCAdtaa9hnmeEyR93.qZXloOZSk9htX2svG1X3yRUufxousnu',
        role: 'Seller',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'pyra_fire',
        email: 'pyra@firemage.com',
        password_hash: '$2b$10$lIlIvCAdtaa9hnmeEyR93.qZXloOZSk9htX2svG1X3yRUufxousnu',
        role: 'Specialist',
        createdAt: new Date('2025-01-02'),
        updatedAt: new Date()
      },
      {
        username: 'aquos_water',
        email: 'aquos@watermage.com',
        password_hash: '$2b$10$lIlIvCAdtaa9hnmeEyR93.qZXloOZSk9htX2svG1X3yRUufxousnu',
        role: 'Specialist',
        createdAt: new Date('2025-01-02'),
        updatedAt: new Date()
      },
      {
        username: 'terra_earth',
        email: 'terra@earthmage.com',
        password_hash: '$2b$10$lIlIvCAdtaa9hnmeEyR93.qZXloOZSk9htX2svG1X3yRUufxousnu',
        role: 'Specialist',
        createdAt: new Date('2025-01-02'),
        updatedAt: new Date()
      },
      {
        username: 'zephyr_air',
        email: 'zephyr@airmage.com',
        password_hash: '$2b$10$lIlIvCAdtaa9hnmeEyR93.qZXloOZSk9htX2svG1X3yRUufxousnu',
        role: 'Specialist',
        createdAt: new Date('2025-01-02'),
        updatedAt: new Date()
      },
      {
        username: 'alice_customer',
        email: 'alice@example.com',
        password_hash: '$2b$10$lIlIvCAdtaa9hnmeEyR93.qZXloOZSk9htX2svG1X3yRUufxousnu',
        role: 'Customer',
        createdAt: new Date('2025-01-05'),
        updatedAt: new Date()
      },
      {
        username: 'bob_customer',
        email: 'bob@example.com',
        password_hash: '$2b$10$lIlIvCAdtaa9hnmeEyR93.qZXloOZSk9htX2svG1X3yRUufxousnu',
        role: 'Customer',
        createdAt: new Date('2025-01-05'),
        updatedAt: new Date()
      },
      {
        username: 'charlie_customer',
        email: 'charlie@example.com',
        password_hash: '$2b$10$lIlIvCAdtaa9hnmeEyR93.qZXloOZSk9htX2svG1X3yRUufxousnu',
        role: 'Customer',
        createdAt: new Date('2025-01-06'),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
