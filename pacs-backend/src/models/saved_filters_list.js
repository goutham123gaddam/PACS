const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('saved_filters_list', {
    sfl_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sfl_uf_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      // unique: "sfl_map_key"
    },
    sfl_user_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      // unique: "sfl_map_key"
    },
    sfl_active: {
      type: DataTypes.STRING(1),
      allowNull: true,
      default: 'Y',
      defaultValue: 'Y'
    },
    sfl_filter_key: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    sfl_filter_value: {
      type: DataTypes.STRING(100),
      allowNull: false,
      // unique: "sfl_map_key"
    }
  }, {
    sequelize,
    tableName: 'saved_filters_list',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "sfl_map_key",
        unique: true,
        fields: [
          { name: "sfl_uf_id" },
        ]
      },
    ]
  });
};
