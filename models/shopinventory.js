'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ShopInventory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ShopInventory.belongsTo(models.Scroll, { foreignKey: 'scroll_id' });
      ShopInventory.belongsTo(models.Specialist, { foreignKey: 'specialist_id' }); 
      ShopInventory.hasMany(models.OrderItem, { foreignKey: 'shop_inventory_id' });
    }
  }
  ShopInventory.init({
    shop_inventory_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    scroll_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    purchase_price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    selling_price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    quality_rating: { type: DataTypes.DECIMAL(3,2), allowNull: false },
    acquired_date: { type: DataTypes.DATE }
  }, {
    sequelize,
    modelName: 'ShopInventory',
    tableName: 'ShopInventories',
    timestamps: true
  });
  return ShopInventory;
};