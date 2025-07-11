const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pacs_reports', {
    pr_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    pr_pacs_ord_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pacs_studies',
        key: 'ps_pacs_ord_id'
      }
    },
    pr_report_drafted_by: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    pr_report_path: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    pr_report_html: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pr_study_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pr_reported_by: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    pr_status: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    pr_proxied_by: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    pr_signed_by: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    pr_co_signed_by: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    pr_draft_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    pr_signoff_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    pr_filler1: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    pr_filler2: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'pacs_reports',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "pacs_reports_pkey",
        unique: true,
        fields: [
          { name: "pr_id" },
        ]
      },
    ]
  });
};
