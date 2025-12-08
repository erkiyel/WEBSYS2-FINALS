'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Specialist extends Model {
    static associate(models) {
      Specialist.belongsTo(models.User, { 
        foreignKey: 'user_id' 
      });
      Specialist.belongsTo(models.Element, {
        foreignKey: 'specialty_element_id',
        as: 'specialtyElement'
      });
      Specialist.hasMany(models.SpecialistInventory, { 
        foreignKey: 'specialist_id' 
      });
      Specialist.hasMany(models.SellerOrder, { 
        foreignKey: 'specialist_id' 
      });
      Specialist.hasMany(models.ShopInventory, { 
        foreignKey: 'specialist_id' 
      });
    }
  }
  Specialist.init({
    specialist_id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    user_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    shop_name: { 
      type: DataTypes.STRING(255), 
      allowNull: false 
    },
    specialty_element_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    reputation_rating: { 
      type: DataTypes.DECIMAL(3,2),
      defaultValue: 5.00 
    },
    contact_info: DataTypes.TEXT  // Changed from STRING to TEXT
  }, {
    sequelize,
    modelName: 'Specialist',
    tableName: 'specialists',  // lowercase
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });
  return Specialist;
};