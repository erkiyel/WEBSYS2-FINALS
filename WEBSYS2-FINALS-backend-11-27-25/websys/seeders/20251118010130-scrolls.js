'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('scrolls', [
      {
        scroll_id: 1,
        scroll_name: 'Fireball',
        description: 'Launch a blazing sphere of fire at your enemies.',
        base_power: 80,
        rarity: 'Common',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        scroll_id: 2,
        scroll_name: 'Healing Wave',
        description: 'Restore health to yourself or an ally with soothing water magic.',
        base_power: 60,
        rarity: 'Common',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        scroll_id: 3,
        scroll_name: 'Stone Shield',
        description: 'Summon a protective barrier of solid rock.',
        base_power: 50,
        rarity: 'Uncommon',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        scroll_id: 4,
        scroll_name: 'Wind Slash',
        description: 'Cut through enemies with a razor-sharp gust of wind.',
        base_power: 70,
        rarity: 'Common',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        scroll_id: 5,
        scroll_name: 'Lightning Bolt',
        description: 'Strike down foes with a bolt of pure electricity.',
        base_power: 90,
        rarity: 'Rare',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        scroll_id: 6,
        scroll_name: 'Ice Lance',
        description: 'Pierce enemies with a sharp spear of ice.',
        base_power: 75,
        rarity: 'Uncommon',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        scroll_id: 7,
        scroll_name: 'Meteor Strike',
        description: 'Call down a flaming meteor from the sky.',
        base_power: 150,
        rarity: 'Epic',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        scroll_id: 8,
        scroll_name: 'Tsunami',
        description: 'Summon a massive wave to sweep away all opposition.',
        base_power: 140,
        rarity: 'Epic',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        scroll_id: 9,
        scroll_name: 'Shadow Step',
        description: 'Teleport through shadows to escape danger.',
        base_power: 30,
        rarity: 'Rare',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        scroll_id: 10,
        scroll_name: 'Vine Entangle',
        description: 'Trap enemies in writhing magical vines.',
        base_power: 55,
        rarity: 'Uncommon',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        scroll_id: 11,
        scroll_name: 'Inferno',
        description: 'Create a raging firestorm that engulfs the battlefield.',
        base_power: 200,
        rarity: 'Legendary',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        scroll_id: 12,
        scroll_name: 'Glacial Fortress',
        description: 'Encase yourself in an impenetrable wall of ice.',
        base_power: 100,
        rarity: 'Rare',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        scroll_id: 13,
        scroll_name: 'Thunderstorm',
        description: 'Call down multiple lightning strikes across the area.',
        base_power: 180,
        rarity: 'Epic',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        scroll_id: 14,
        scroll_name: 'Steam Blast',
        description: 'Combine fire and water to create a scalding steam explosion.',
        base_power: 95,
        rarity: 'Rare',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        scroll_id: 15,
        scroll_name: 'Earthquake',
        description: 'Shake the ground and topple your enemies.',
        base_power: 120,
        rarity: 'Epic',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('scrolls', null, {});
  }
};
