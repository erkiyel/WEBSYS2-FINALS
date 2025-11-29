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
      Specialist.belongsTo(models.User, { foreignKey: 'user_id' });
      Specialist.hasMany(models.SpecialistInventory, { foreignKey: 'specialist_id' });
      Specialist.hasMany(models.SellerOrder, { foreignKey: 'specialist_id' });
    }
  }
  Specialist.init({
    specialist_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    shop_name: { type: DataTypes.STRING, allowNull: false },
    specialty_element_id: { type: DataTypes.INTEGER, allowNull: false },
    reputation_rating: { type: DataTypes.DECIMAL(3,2) },
    contact_info: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Specialist',
    tableName: 'Specialists',
    timestamps: true
  });
  return Specialist;
};