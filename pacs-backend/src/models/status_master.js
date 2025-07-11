const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('status_master', {
    status_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    status_label: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    status_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    status_order: {
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
    tableName: 'status_master',
    schema: 'public',
    timestamps: false,
  });
};
