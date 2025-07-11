const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pacs_orders', {
    pacs_ord_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    po_pat_pacs_id: {
      type: DataTypes.INTEGER,
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
    po_his_ord_no: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    po_req_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    po_ref_doc_cd: {  // ref_doctors.doc_cd
      type: DataTypes.STRING(50),
      allowNull: true
    },
    po_ref_doc: {  // ref_doctors.doc_cd
      type: DataTypes.STRING(50),
      allowNull: true
    },
    po_ref_doc_id: {  // ref_doctors.id
      type: DataTypes.STRING(50),
      allowNull: true
    },
    po_req_user_id: {  // his_users.id
      type: DataTypes.STRING(20),
      allowNull: true
    },
    po_pacs_status: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "PENDING"
    },
    po_his_status: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    po_acc_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    po_modality: {
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
    po_emergency: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    po_priority: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NORMAL"
    },
    po_section_code: {
      type: DataTypes.STRING(10),
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
    po_pat_class: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    po_pat_location: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    po_visit_number: {
      type: DataTypes.STRING,
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
    tableName: 'pacs_orders',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "pacs_orders_pkey",
        unique: true,
        fields: [
          { name: "pacs_ord_id" },
        ]
      }
    ]
  });
};
