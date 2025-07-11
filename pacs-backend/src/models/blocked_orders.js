const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('blocked_orders', {
    bo_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    bo_modality: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bo_pacs_ord_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bo_site: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bo_blocked_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bo_reason: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bo_blocked_state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
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
    tableName: 'blocked_orders',
    schema: 'public',
    timestamps: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
};
