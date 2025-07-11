const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('diseases_master', {
    disease_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    disease_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    disease_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    disease_dept: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    disease_body_part: {
      type: DataTypes.STRING,
      allowNull: true
    },
    disease_added_by: {
      type: DataTypes.STRING,
      allowNull: true
    },
    disease_active: {
      type: DataTypes.CHAR,
      allowNull: true,
      defaultValue: 'Y'
    },
    filler1: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    filler2: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'diseases_master',
    schema: 'public',
    timestamps: false,
  });
};
