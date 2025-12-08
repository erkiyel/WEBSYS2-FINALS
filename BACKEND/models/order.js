'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { 
        foreignKey: 'customer_id',
        as: 'customer'
      });
      Order.hasMany(models.OrderItem, { 
        foreignKey: 'order_id' 
      });
    }
  }
  Order.init({
    order_id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    customer_id: { 
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
    modelName: 'Order',
    tableName: 'orders',  // lowercase
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });
  return Order;
};