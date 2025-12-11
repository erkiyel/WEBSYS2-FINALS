'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ScrollElement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ScrollElement.belongsTo(models.Scroll, { foreignKey: 'scroll_id' });
      ScrollElement.belongsTo(models.Element, { foreignKey: 'element_id' });
    }
  }
  ScrollElement.init({
    scroll_id: { type: DataTypes.INTEGER, primaryKey: true },
    element_id: { type: DataTypes.INTEGER, primaryKey: true }
  }, {
    sequelize,
    modelName: 'ScrollElement',
    tableName: 'ScrollElements',
    timestamps: true
  });
  return ScrollElement;
};