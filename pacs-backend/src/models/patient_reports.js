const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('patient_reports', {
    pr_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    pr_pat_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pr_pacs_ord_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pr_created_by: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    pr_signedoff_by: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'HOD'
    },
    pr_updated_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    pr_status: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    pr_acc_no: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    pr_add_dt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    pr_mod_dt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    pr_template_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    pr_diag_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    pr_html: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: 'TIMESTAMP',
      allowNull: true
    },
    pr_proxied_by: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'patient_reports',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "patient_reports_pkey",
        unique: true,
        fields: [
          { name: "pr_id" },
        ]
      },
    ]
  });
};
