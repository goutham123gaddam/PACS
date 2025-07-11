const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ext_nodes', {
    en_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    en_operations: {
      type: DataTypes.STRING,
      allowNull: false
    },
    en_location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    en_ae_title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    en_port: {
      type: DataTypes.STRING(4),
      allowNull: false
    },
    en_ip_address: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    en_node_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    en_comments: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    en_added_dt: {
      type: DataTypes.STRING,
      allowNull: false
    },
    en_added_by: {
      type: DataTypes.STRING,
      allowNull: true
    },
    en_active: {
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
    tableName: 'ext_nodes',
    schema: 'public',
    timestamps: false,
  });
};
