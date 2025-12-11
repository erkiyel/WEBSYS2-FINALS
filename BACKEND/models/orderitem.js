'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OrderItem.belongsTo(models.Order, { foreignKey: 'order_id' });
      OrderItem.belongsTo(models.ShopInventory, { foreignKey: 'shop_inventory_id' });
    }
  }
  OrderItem.init({
    order_item_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    shop_inventory_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    unit_price: { type: DataTypes.DECIMAL(10,2), allowNull: false }
  }, {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'OrderItems',
    timestamps: true
  });
  return OrderItem;
};