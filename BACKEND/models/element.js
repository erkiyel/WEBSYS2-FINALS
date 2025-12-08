'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Element extends Model {
    static associate(models) {
      Element.belongsToMany(models.Scroll, { 
        through: models.ScrollElement, 
        foreignKey: 'element_id', 
        otherKey: 'scroll_id' 
      });
      Element.hasMany(models.Specialist, { 
        foreignKey: 'specialty_element_id',
        as: 'specialists'
      });
    }
  }
  Element.init({
    element_id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    element_name: { 
      type: DataTypes.STRING(255), 
      allowNull: false, 
      unique: true 
    },
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Element',
    tableName: 'elements',  // lowercase
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });
  return Element;
};