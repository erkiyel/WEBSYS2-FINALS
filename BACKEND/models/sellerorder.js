'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SellerOrder extends Model {
    static associate(models) {
      SellerOrder.belongsTo(models.User, { 
        foreignKey: 'user_id' 
      });
      SellerOrder.belongsTo(models.Specialist, { 
        foreignKey: 'specialist_id' 
      });
      SellerOrder.hasMany(models.SellerOrderItem, { 
        foreignKey: 'seller_order_id' 
      });
    }
  }
  SellerOrder.init({
    seller_order_id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    user_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    specialist_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    order_date: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW 
    },
    total_amount: { 
      type: DataTypes.DECIMAL(10,2), 
      allowNull: false 
    },
    status: { 
      type: DataTypes.ENUM('Pending', 'Completed', 'Cancelled'), 
      allowNull: false, 
      defaultValue: 'Pending' 
    }
  }, {
    sequelize,
    modelName: 'SellerOrder',
    tableName: 'seller_orders',  // lowercase with underscore
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });
  return SellerOrder;
};