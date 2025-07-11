const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('approvals', {
    approval_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ap_pr_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ap_pacs_ord_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ap_req_by: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    ap_created_dt: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ap_mod_dt: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ap_status: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ap_is_deleted: {
      type: DataTypes.CHAR(1),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'approvals',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "approvals_pkey",
        unique: true,
        fields: [
          { name: "approval_id" },
        ]
      },
    ]
  });
};
