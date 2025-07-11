const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('report_prints', {
    rp_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    rp_pacs_ord_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rp_report_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rp_print_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    rp_printed_by: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    rp_report_received_by: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    rp_filler1: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    rp_filler2: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'report_prints',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "report_prints_pkey",
        unique: true,
        fields: [
          { name: "rp_id" },
        ]
      },
    ]
  });
};
