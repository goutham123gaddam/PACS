const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('patients', {
    pat_pacs_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    pat_pin: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    pat_unit: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    pat_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    pat_sex: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    pat_dob: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    pat_latest_order_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'patients',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "pat_pacs_id",
        unique: true,
        fields: [
          { name: "pat_pacs_id" },
        ]
      },
    ]
  });
};
