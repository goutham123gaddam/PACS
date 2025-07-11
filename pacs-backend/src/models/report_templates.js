const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('report_templates', {
    rt_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    rt_modality: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rt_bodypart: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rt_template_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rt_display_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rt_added_by: {
        type: DataTypes.STRING,
        allowNull: true
    },
    rt_active: {
        type: DataTypes.STRING(1),
        allowNull: true,
        defaultValue: 'Y'
    },
    rt_comments: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    rt_added_dt: {
      type: DataTypes.STRING,
    },
    rt_deleted: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: 'N'
    },
    rt_location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    template_html: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    filler2: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'report_templates',
    schema: 'public',
    timestamps: false,
  });
};
