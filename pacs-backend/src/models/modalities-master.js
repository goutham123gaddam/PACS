const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('modailities_master', {
    modality_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    modality_label: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    modality_code: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'modailities_master',
    schema: 'public',
    timestamps: false,
  });
};
