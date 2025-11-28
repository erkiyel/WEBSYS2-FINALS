'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpecialistInventory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SpecialistInventory.init({
    specialist_id: DataTypes.INTEGER,
    scroll_id: DataTypes.INTEGER,
    stock_quantity: DataTypes.INTEGER,
    source_price: DataTypes.DECIMAL,
    quality_rating: DataTypes.DECIMAL,
    is_specialty: DataTypes.BOOLEAN,
    last_updated: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'SpecialistInventory',
  });
  return SpecialistInventory;
};