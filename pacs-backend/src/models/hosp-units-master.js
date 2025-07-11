const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('hosp_units_master', {
    unit_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    unit_label: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    unit_code: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    unit_abv: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    unit_address: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    status_active: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'hosp_units_master',
    schema: 'public',
    timestamps: false,
  });
};
