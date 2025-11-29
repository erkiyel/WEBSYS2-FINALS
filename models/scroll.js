'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Scroll extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Scroll.belongsToMany(models.Element, { through: models.ScrollElement, foreignKey: 'scroll_id', otherKey: 'element_id' });
      Scroll.hasMany(models.ShopInventory, { foreignKey: 'scroll_id' });
      Scroll.hasMany(models.SpecialistInventory, { foreignKey: 'scroll_id' });
    }
  }
  Scroll.init({
    scroll_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    scroll_name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    base_power: { type: DataTypes.INTEGER, allowNull: false },
    rarity: { type: DataTypes.ENUM('Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'), allowNull: false, defaultValue: 'Common' }
  }, {
    sequelize,
    modelName: 'Scroll',
    tableName: 'Scrolls',
    timestamps: true
  });
  return Scroll;
};