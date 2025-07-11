const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_permissions', {
    up_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    up_username: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    up_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    up_key: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    up_label: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    up_active: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Y'
    },
    up_unit: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    filler1: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    filler2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    filler3: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'user_permissions',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "up_pkey",
        unique: true,
        fields: [
          { name: "up_id" },
        ]
      },
    ]
  });
};
