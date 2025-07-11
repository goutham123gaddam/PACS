const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_filters', {
    uf_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    uf_user_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      // unique: "user_filters_map_key"
    },
    uf_active: {
      type: DataTypes.STRING(1),
      allowNull: true,
      defaultValue: 'Y'
    },
    uf_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    uf_filter_json: {
      type: DataTypes.STRING(10000),
      allowNull: false
    },
    // uf_sfl_id: {
    //   type: DataTypes.STRING(50),
    //   allowNull: false,
    //   // unique: "user_filters_map_key"
    // }
  }, {
    sequelize,
    tableName: 'user_filters',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "user_filters_pkey",
        unique: true,
        fields: [
          { name: "uf_id" },
        ]
      },
    ]
  });
};
