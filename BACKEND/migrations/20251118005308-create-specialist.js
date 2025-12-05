'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Specialists', {
      specialist_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      shop_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      specialty_element_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Elements',
          key: 'element_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      reputation_rating: {
        type: Sequelize.DECIMAL(3, 2),
        defaultValue: 5.00,
        validate: {
          min: 0,
          max: 10
        }
      },
      contact_info: {
        type: Sequelize.STRING
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Specialists');
  }
};