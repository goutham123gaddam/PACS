const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('his_status_master', {
    his_status_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    his_status_label: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    his_status_value: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'his_status_master',
    schema: 'public',
    timestamps: false,
  });
};
