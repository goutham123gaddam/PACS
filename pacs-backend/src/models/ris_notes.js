const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ris_notes', {
    rn_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    rn_pacs_ord_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rn_pin: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rn_upload_type: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    rn_upload_path: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    rn_file_name: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    rn_notes: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    rn_uploaded_dt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    rn_uploaded_by: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rn_active: {
      type: DataTypes.CHAR,
      allowNull: true,
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
    tableName: 'ris_notes',
    schema: 'public',
    timestamps: true,
  });
};
