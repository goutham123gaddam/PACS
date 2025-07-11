const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('critical_notifications', {
    cn_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cn_modality: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cn_pacs_ord_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cn_site: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cn_notified_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cn_doc_ref_cds: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cn_doc_mobiles: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cn_doc_emails: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cn_disease: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cn_findings: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cn_triggered_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cn_sent: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 'N'
    },
    cn_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cn_dt_tm: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
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
    tableName: 'critical_notifications',
    schema: 'public',
    timestamps: false,
    createdAt: 'created_at',
  });
};
