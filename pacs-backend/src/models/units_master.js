const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('units_master', {
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
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    unit_order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    filler1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    filler2: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'units_master',
    schema: 'public',
    timestamps: false,
  });
};
