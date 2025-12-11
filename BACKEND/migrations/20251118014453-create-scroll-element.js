'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ScrollElements', {
      scroll_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Scrolls',
          key: 'scroll_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      element_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Elements',
          key: 'element_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add composite primary key constraint
    await queryInterface.addConstraint('ScrollElements', {
      fields: ['scroll_id', 'element_id'],
      type: 'primary key',
      name: 'scroll_element_pk'
    });

    // Add index for better query performance
    await queryInterface.addIndex('ScrollElements', ['element_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ScrollElements');
  }
};