const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pacs_status_master', {
    pacs_status_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    pacs_status_label: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    pacs_status_code: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'pacs_status_master',
    schema: 'public',
    timestamps: false,
  });
};
