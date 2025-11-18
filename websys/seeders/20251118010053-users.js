'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        username: 'admin_seller',
        email: 'seller@magicshop.com',
        password_hash: '$2b$10$abcdefghijklmnopqrstuvwxyz123456',
        role: 'Seller',
        created_at: new Date('2025-01-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'pyra_fire',
        email: 'pyra@firemage.com',
        password_hash: '$2b$10$abcdefghijklmnopqrstuvwxyz123456',
        role: 'Specialist',
        created_at: new Date('2025-01-02'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'aquos_water',
        email: 'aquos@watermage.com',
        password_hash: '$2b$10$abcdefghijklmnopqrstuvwxyz123456',
        role: 'Specialist',
        created_at: new Date('2025-01-02'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'terra_earth',
        email: 'terra@earthmage.com',
        password_hash: '$2b$10$abcdefghijklmnopqrstuvwxyz123456',
        role: 'Specialist',
        created_at: new Date('2025-01-02'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'zephyr_air',
        email: 'zephyr@airmage.com',
        password_hash: '$2b$10$abcdefghijklmnopqrstuvwxyz123456',
        role: 'Specialist',
        created_at: new Date('2025-01-02'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'alice_customer',
        email: 'alice@example.com',
        password_hash: '$2b$10$abcdefghijklmnopqrstuvwxyz123456',
        role: 'Customer',
        created_at: new Date('2025-01-05'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'bob_customer',
        email: 'bob@example.com',
        password_hash: '$2b$10$abcdefghijklmnopqrstuvwxyz123456',
        role: 'Customer',
        created_at: new Date('2025-01-05'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'charlie_customer',
        email: 'charlie@example.com',
        password_hash: '$2b$10$abcdefghijklmnopqrstuvwxyz123456',
        role: 'Customer',
        created_at: new Date('2025-01-06'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
