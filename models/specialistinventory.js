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
      SpecialistInventory.belongsTo(models.Specialist, { foreignKey: 'specialist_id' });
      SpecialistInventory.belongsTo(models.Scroll, { foreignKey: 'scroll_id' });
      SpecialistInventory.hasMany(models.SellerOrderItem, { foreignKey: 'specialist_inventory_id' });
    }
  }
  SpecialistInventory.init({
    inventory_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    specialist_id: { type: DataTypes.INTEGER, allowNull: false },
    scroll_id: { type: DataTypes.INTEGER, allowNull: false },
    stock_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    source_price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    quality_rating: { type: DataTypes.DECIMAL(3,2), allowNull: false },
    is_specialty: { type: DataTypes.BOOLEAN, defaultValue: false },
    last_updated: { type: DataTypes.DATE }
  }, {
    sequelize,
    modelName: 'SpecialistInventory',
    tableName: 'SpecialistInventories',
    timestamps: true
  });
  return SpecialistInventory;
};