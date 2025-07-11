const { sequelize } = require("../database");
const Sequelize = require("sequelize");
const USER_FILTERS = require("./user_filters")(sequelize, Sequelize);
const SAVED_FILTERS_LIST = require("./saved_filters_list")(sequelize, Sequelize);
const PATIENT_REPORTS = require("./patient_reports")(sequelize, Sequelize);
const USERS = require("./users")(sequelize, Sequelize);
const APPROVALS = require("./approvals")(sequelize, Sequelize);
const HIS_STATUS_MASTER = require("./his-status-master")(sequelize, Sequelize);
const PACS_STATUS_MASTER = require("./scan-status-master")(sequelize, Sequelize);
const HOSP_UNITS_MASTER = require("./hosp-units-master")(sequelize, Sequelize);
const MODALITY_MASTER = require("./modalities-master")(sequelize, Sequelize);
const VIEWER_STATS = require("./viewer_stats")(sequelize, Sequelize);
const RIS_NOTES = require("./ris_notes")(sequelize, Sequelize);
const EXT_NODES = require("./ext_nodes")(sequelize, Sequelize);
const REPORT_TEMPLATES = require("./report_templates")(sequelize, Sequelize);
const DICOM_METADATA = require("./dicom_metadata")(sequelize, Sequelize);
const USER_PERMISSIONS = require("./user_permissions")(sequelize, Sequelize);
const PERMISSIONS_MASTER = require("./permissions_master")(sequelize, Sequelize);
const UNITS_MASTER = require("./units_master")(sequelize, Sequelize);
const STATUS_MASTER = require("./status_master")(sequelize, Sequelize);
const ROLES_MASTER = require("./roles_master")(sequelize, Sequelize);
const BLOCKED_ORDERS = require("./blocked_orders")(sequelize, Sequelize);
const DISEASES_MASTER = require("./diseases_master")(sequelize, Sequelize);
const CRITICAL_NOTIFICATIONS = require("./critical_notifications")(sequelize, Sequelize);
const LEGACY_STUDIES = require("./legacy_studies")(sequelize, Sequelize);
const BODYPARTS_MASTER = require("./nodes_master")(sequelize, Sequelize);

const PATIENTS = require("./patients")(sequelize, Sequelize);
const PACS_ORDERS = require("./orders")(sequelize, Sequelize);
const STUDIES = require("./studies")(sequelize, Sequelize);
const REPORTS = require("./reports")(sequelize, Sequelize);
const REPORT_PRINTS = require("./report_prints")(sequelize, Sequelize);
const ORDER_WORKFLOW = require("./order_workflow")(sequelize, Sequelize);
const VIEWER_INTERACTIONS = require("./viewer_tool_interactions")(sequelize, Sequelize);

STUDIES.belongsTo(PACS_ORDERS, {
  foreignKey: 'ps_pacs_ord_id'
});

PACS_ORDERS.belongsTo(PATIENTS, {
  foreignKey: 'po_pat_pacs_id'
});

ORDER_WORKFLOW.belongsTo(PACS_ORDERS, {
  foreignKey: 'ow_pacs_ord_id'
});

PACS_ORDERS.hasOne(ORDER_WORKFLOW, {
  foreignKey: 'ow_pacs_ord_id',
  sourceKey: 'pacs_ord_id',
  constraints: false  // This allows reports to exist without study
});

STUDIES.hasOne(ORDER_WORKFLOW, {
  foreignKey: 'ow_pacs_ord_id',
  sourceKey: 'ps_pacs_ord_id',
  constraints: false  // This allows reports to exist without study
});

// From ORDER_WORKFLOW side
ORDER_WORKFLOW.belongsTo(STUDIES, {
  foreignKey: 'ow_pacs_ord_id',
  targetKey: 'ps_pacs_ord_id',
  constraints: false  // This allows workflow to exist without study
});

STUDIES.hasMany(REPORTS, {
  foreignKey: 'pr_pacs_ord_id',
  sourceKey: 'ps_pacs_ord_id',
});

// Add the reverse association
REPORTS.belongsTo(STUDIES, {
  foreignKey: 'pr_pacs_ord_id',
  targetKey: 'ps_pacs_ord_id',
});

// PACS_ORDERS.hasMany(REPORTS, {
//   foreignKey: 'pr_pacs_ord_id',
//   sourceKey: 'pacs_ord_id',
// });

PACS_ORDERS.hasMany(RIS_NOTES, {
  foreignKey: 'rn_pacs_ord_id',
  sourceKey: 'pacs_ord_id'
});

// REPORTS user associations
REPORTS.belongsTo(USERS, {
  foreignKey: 'pr_reported_by',
  targetKey: 'username',
  as: 'reportedBy',
  constraints: false
});

REPORTS.belongsTo(USERS, {
  foreignKey: 'pr_signed_by',
  targetKey: 'username',
  as: 'signedBy',
  constraints: false
});

USERS.hasMany(REPORTS, {
  foreignKey: 'pr_reported_by',
  sourceKey: 'username',
  as: 'reportedReports',
  constraints: false
});

USERS.hasMany(REPORTS, {
  foreignKey: 'pr_signed_by',
  sourceKey: 'username',
  as: 'signedReports',
  constraints: false
});

module.exports = {
  PATIENT_REPORTS,
  USERS,
  APPROVALS,
  SAVED_FILTERS_LIST,
  USER_FILTERS,
  HIS_STATUS_MASTER,
  PACS_STATUS_MASTER,
  HOSP_UNITS_MASTER,
  MODALITY_MASTER,
  VIEWER_STATS,
  // RIS_NOTES2,
  RIS_NOTES,
  EXT_NODES,
  REPORT_TEMPLATES,
  DICOM_METADATA,
  USER_PERMISSIONS,
  PERMISSIONS_MASTER,
  UNITS_MASTER,
  STATUS_MASTER,
  ROLES_MASTER,
  BLOCKED_ORDERS,
  DISEASES_MASTER,
  CRITICAL_NOTIFICATIONS,
  LEGACY_STUDIES,
  BODYPARTS_MASTER,

  PACS_ORDERS,
  STUDIES,
  REPORTS,
  REPORT_PRINTS,
  ORDER_WORKFLOW,
  PATIENTS,
  VIEWER_INTERACTIONS
};