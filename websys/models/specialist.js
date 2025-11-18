'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Specialist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Specialist.init({
    user_id: DataTypes.INTEGER,
    shop_name: DataTypes.STRING,
    specialty_element_id: DataTypes.INTEGER,
    reputation_rating: DataTypes.DECIMAL,
    contact_info: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Specialist',
  });
  return Specialist;
};