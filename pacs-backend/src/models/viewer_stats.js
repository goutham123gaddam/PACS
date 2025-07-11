const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('viewer_stats', {
    vs_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    vs_user_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    vs_study_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    vs_series_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: 'Y'
      },
    vs_type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    vs_time_taken: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    vs_total_instances: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    vs_modality: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
  }, {
    sequelize,
    tableName: 'viewer_stats',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "vs_pkey",
        unique: true,
        fields: [
          { name: "vs_id" },
        ]
      },
    ]
  });
};
