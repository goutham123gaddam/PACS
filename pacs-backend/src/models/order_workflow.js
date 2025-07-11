const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order_workflow', {
    ow_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ow_pacs_ord_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ow_study_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ow_assigned_rad_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ow_currently_opened_by: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ow_reporting_status: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    ow_first_draft_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ow_last_ping_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ow_diagnosed: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    ow_correlated: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    ow_assigned_technician: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ow_reporting_blocked: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    ow_proxied_by: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ow_reported_by: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ow_signed_by: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ow_block_reason: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ow_signoff_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ow_pacs_status: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ow_report_sent_to_his: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    ow_filler1: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ow_filler2: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'order_workflow',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "order_workflow_pkey",
        unique: true,
        fields: [
          { name: "ow_id" },
        ]
      },
    ]
  });
};
