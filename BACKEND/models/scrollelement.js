'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ScrollElement extends Model {
    static associate(models) {
      ScrollElement.belongsTo(models.Scroll, { 
        foreignKey: 'scroll_id' 
      });
      ScrollElement.belongsTo(models.Element, { 
        foreignKey: 'element_id' 
      });
    }
  }
  ScrollElement.init({
    scroll_id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true 
    },
    element_id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true 
    }
  }, {
    sequelize,
    modelName: 'ScrollElement',
    tableName: 'scroll_elements',  // lowercase with underscore
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });
  return ScrollElement;
};