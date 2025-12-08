'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Scroll extends Model {
    static associate(models) {
      Scroll.belongsToMany(models.Element, { 
        through: models.ScrollElement, 
        foreignKey: 'scroll_id', 
        otherKey: 'element_id' 
      });
      Scroll.hasMany(models.ShopInventory, { 
        foreignKey: 'scroll_id' 
      });
      Scroll.hasMany(models.SpecialistInventory, { 
        foreignKey: 'scroll_id' 
      });
    }
  }
  Scroll.init({
    scroll_id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    scroll_name: { 
      type: DataTypes.STRING(255), 
      allowNull: false 
    },
    description: DataTypes.TEXT,
    base_power: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    rarity: { 
      type: DataTypes.ENUM('Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'), 
      allowNull: false, 
      defaultValue: 'Common' 
    }
  }, {
    sequelize,
    modelName: 'Scroll',
    tableName: 'scrolls',  // lowercase
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });
  return Scroll;
};