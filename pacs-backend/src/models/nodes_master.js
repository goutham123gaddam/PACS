const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('body_parts_master', {
    bp_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    bp_modality: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    bp_label: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    bp_code: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'body_parts_master',
    schema: 'public',
    timestamps: false,
  });
};
