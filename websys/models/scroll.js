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
      // define association here
    }
  }
  Scroll.init({
    scroll_name: DataTypes.STRING,
    description: DataTypes.TEXT,
    base_power: DataTypes.INTEGER,
    rarity: DataTypes.ENUM
  }, {
    sequelize,
    modelName: 'Scroll',
  });
  return Scroll;
};