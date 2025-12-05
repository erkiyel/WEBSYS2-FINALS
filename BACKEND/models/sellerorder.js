'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SellerOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SellerOrder.belongsTo(models.User, { foreignKey: 'user_id' });
      SellerOrder.belongsTo(models.Specialist, { foreignKey: 'specialist_id' });
      SellerOrder.hasMany(models.SellerOrderItem, { foreignKey: 'seller_order_id' });
    }
  }
  SellerOrder.init({
    seller_order_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    specialist_id: { type: DataTypes.INTEGER, allowNull: false },
    order_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    total_amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    status: { type: DataTypes.ENUM('Pending', 'Completed', 'Cancelled'), allowNull: false, defaultValue: 'Pending' }
  }, {
    sequelize,
    modelName: 'SellerOrder',
    tableName: 'SellerOrders',
    timestamps: true
  });
  return SellerOrder;
};