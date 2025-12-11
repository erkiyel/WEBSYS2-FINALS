'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Element extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Element.belongsToMany(models.Scroll, { through: models.ScrollElement, foreignKey: 'element_id', otherKey: 'scroll_id' });
      Element.hasMany(models.Specialist, { foreignKey: 'specialty_element_id' });
    }
  }
  Element.init({
    element_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    element_name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Element',
    tableName: 'Elements',
    timestamps: true
  });
  return Element;
};