'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpecialistInventory extends Model {
    static associate(models) {
      SpecialistInventory.belongsTo(models.Specialist, { 
        foreignKey: 'specialist_id' 
      });
      SpecialistInventory.belongsTo(models.Scroll, { 
        foreignKey: 'scroll_id' 
      });
      SpecialistInventory.hasMany(models.SellerOrderItem, { 
        foreignKey: 'specialist_inventory_id',
        as: 'sellerOrderItems'
      });
    }
  }
  SpecialistInventory.init({
    specialist_inventory_id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    specialist_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    scroll_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    stock_quantity: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      defaultValue: 0 
    },
    source_price: { 
      type: DataTypes.DECIMAL(10,2), 
      allowNull: false 
    },
    quality_rating: { 
      type: DataTypes.DECIMAL(3,2), 
      allowNull: false 
    },
    is_specialty: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: false 
    },
    last_updated: { 
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW 
    }
  }, {
    sequelize,
    modelName: 'SpecialistInventory',
    tableName: 'specialist_inventories',  // lowercase with underscore
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });
  return SpecialistInventory;
};