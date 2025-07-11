const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pacs_studies', {
    ps_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ps_pacs_ord_id: { // pacs_orders .id
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    ps_report_drafted_by: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ps_reporting_status: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    ps_study_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ps_dicom_path: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ps_study_dt_tm: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ps_scan_received_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ps_first_img_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ps_study_uid: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ps_series_count: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ps_critical_finding: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ps_first_draft_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ps_sending_aet: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    ps_station_name: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    ps_ping_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ps_diagnosed: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    ps_correlated: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    ps_filler1: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ps_filler2: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'pacs_studies',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "pacs_studies_pkey",
        unique: true,
        fields: [
          { name: "ps_id" },
        ]
      },
    ]
  });
};
