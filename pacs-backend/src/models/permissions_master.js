const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('permissions_master', {
    permission_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    permission_label: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    permission_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    permission_order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    permission_applicable_units: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'permissions_master',
    schema: 'public',
    timestamps: false,
  });
};
