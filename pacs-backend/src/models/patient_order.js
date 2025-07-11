const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('patient_order', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    po_pin: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    po_diag_no: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    po_diag_desc: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    po_ord_no: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    po_pat_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    po_pat_sex: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    po_pat_dob: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    po_req_time: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    po_report_drafted_by: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    po_ref_doc: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    po_req_by_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    po_req_by_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    po_status: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "PENDING"
    },
    po_his_status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    po_reporting_status: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    po_rad_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    po_report_path: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    po_study_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    po_dicom_path: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    po_ref_doc_cd: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    po_report_html: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    po_acc_no: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    modality: {
      type: DataTypes.STRING,
      allowNull: true
    },
    po_study_dt: {
      type: DataTypes.STRING,
      allowNull: true
    },
    po_study_tm: {
      type: DataTypes.STRING,
      allowNull: true
    },
    po_scan_rcv_dt: {
      type: DataTypes.STRING,
      allowNull: true
    },
    po_scan_rcv_tm: {
      type: DataTypes.STRING,
      allowNull: true
    },
    po_first_img_time: {
      type: DataTypes.STRING,
      allowNull: true
    },
    po_study_uid: {
      type: DataTypes.STRING,
      allowNull: true
    },
    po_series_count: {
      type: DataTypes.STRING,
      allowNull: true
    },
    po_site: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    po_body_part: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    po_assigned_to: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    po_reported_by: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    po_proxied_by: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    po_signed_by: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    po_opened_by: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    po_emergency: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    po_critical_finding: {
      type: DataTypes.STRING,
      allowNull: true
    },
    po_first_draft_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    po_ping_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    po_signoff_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    po_section_code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    po_diagnosed: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    po_correlated: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    po_rad_print_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    po_dispatch_print_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    po_report_received_by: {
      type: DataTypes.STRING,
      allowNull: true
    },
    po_dispatched_by: {
      type: DataTypes.STRING,
      allowNull: true
    },
    po_assigned_technician: {
      type: DataTypes.STRING,
      allowNull: true
    },
    po_block_reporting: {
      type: DataTypes.STRING,
      allowNull: true
    },
    po_appointment_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    po_arrival_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    po_filler1: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    po_filler2: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'patient_order',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "patient_order_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "patient_order_unique",
        unique: true,
        fields: [
          { name: "po_pin" },
          { name: "po_ord_no" },
          { name: "po_acc_no" },
        ]
      },
    ]
  });
};
