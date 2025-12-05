'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SpecialistInventories', {
      specialist_inventory_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      specialist_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Specialists',
          key: 'specialist_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
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
      stock_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      source_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      quality_rating: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: false,
        validate: {
          min: 0,
          max: 10
        }
      },
      is_specialty: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      last_updated: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
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

    await queryInterface.addIndex('SpecialistInventories', ['specialist_id', 'scroll_id'], {
      unique: true,
      name: 'specialist_scroll_unique'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SpecialistInventories');
  }
};
