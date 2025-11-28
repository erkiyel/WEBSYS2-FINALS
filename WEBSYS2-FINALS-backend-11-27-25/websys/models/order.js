'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init({
    customer_id: DataTypes.INTEGER,
    order_date: DataTypes.DATE,
    total_amount: DataTypes.DECIMAL,
    status: DataTypes.ENUM('Pending', 'Completed', 'Cancelled'),
      defaultValue: 'Pending'
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};