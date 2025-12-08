'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SellerOrderItem extends Model {
    static associate(models) {
      SellerOrderItem.belongsTo(models.SellerOrder, { 
        foreignKey: 'seller_order_id' 
      });
      SellerOrderItem.belongsTo(models.SpecialistInventory, { 
        foreignKey: 'specialist_inventory_id' 
      });
    }
  }
  SellerOrderItem.init({
    seller_order_item_id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    seller_order_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    specialist_inventory_id: { 
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
    modelName: 'SellerOrderItem',
    tableName: 'seller_order_items',  // lowercase with underscore
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });
  return SellerOrderItem;
};