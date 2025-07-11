const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('roles_master', {
    role_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    role_label: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    role_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    role_order: {
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
    tableName: 'roles_master',
    schema: 'public',
    timestamps: false,
  });
};
