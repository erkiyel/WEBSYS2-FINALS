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
      // define association here
    }
  }
  ShopInventory.init({
    scroll_id: DataTypes.INTEGER,
    specialist_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    purchase_price: DataTypes.DECIMAL,
    selling_price: DataTypes.DECIMAL,
    quality_rating: DataTypes.DECIMAL,
    acquired_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ShopInventory',
  });
  return ShopInventory;
};