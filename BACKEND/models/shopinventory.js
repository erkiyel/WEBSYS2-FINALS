'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ShopInventory extends Model {
    static associate(models) {
      ShopInventory.belongsTo(models.Scroll, { 
        foreignKey: 'scroll_id' 
      });
      ShopInventory.belongsTo(models.Specialist, { 
        foreignKey: 'specialist_id' 
      });
      ShopInventory.hasMany(models.OrderItem, { 
        foreignKey: 'shop_inventory_id' 
      });
    }
  }
  ShopInventory.init({
    shop_inventory_id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    scroll_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    quantity: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      defaultValue: 0 
    },
    purchase_price: { 
      type: DataTypes.DECIMAL(10,2), 
      allowNull: false 
    },
    selling_price: { 
      type: DataTypes.DECIMAL(10,2), 
      allowNull: false 
    },
    quality_rating: { 
      type: DataTypes.DECIMAL(3,2), 
      allowNull: false 
    },
    acquired_date: { 
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW 
    }
  }, {
    sequelize,
    modelName: 'ShopInventory',
    tableName: 'shop_inventories',  // lowercase with underscore
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });
  return ShopInventory;
};