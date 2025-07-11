const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('viewer_tool_interactions', {
    vti_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    vti_user_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    vti_study_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    vti_series_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    vti_tool_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    vti_tool_action: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'activate, deactivate, use, etc.'
    },
    vti_viewport_index: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    vti_timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    vti_session_id: {
      type: DataTypes.STRING(36),
      allowNull: true
    },
    vti_additional_data: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Tool-specific parameters or metadata'
    }
  }, {
    sequelize,
    tableName: 'viewer_tool_interactions',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "vti_pkey",
        unique: true,
        fields: [
          { name: "vti_id" },
        ]
      },
      {
        name: "vti_user_study_idx",
        fields: [
          { name: "vti_user_id" },
          { name: "vti_study_id" },
        ]
      },
    ]
  });
};