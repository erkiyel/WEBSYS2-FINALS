'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      OrderItem.belongsTo(models.Order, { 
        foreignKey: 'order_id' 
      });
      OrderItem.belongsTo(models.ShopInventory, { 
        foreignKey: 'shop_inventory_id' 
      });
    }
  }
  OrderItem.init({
    order_item_id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    order_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    shop_inventory_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    quantity: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    unit_price: { 
      type: DataTypes.DECIMAL(10,2), 
      allowNull: false 
    }
  }, {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'order_items',  // lowercase with underscore
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });
  return OrderItem;
};