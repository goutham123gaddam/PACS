const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dicom_metadata', {
    dcm_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    dcm_pacs_ord_id: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dcm_study_uid: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    dcm_pacs_study_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    dcm_study_tm: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dcm_series_count: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    dcm_images_count: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    dcm_samples_per_pixel: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    dcm_rows: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    dcm_columns: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    dcm_pixel_spacing: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dcm_modality: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    dcm_station_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    dcm_dept: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    dcm_image_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    dcm_fully_loaded: {
      type: DataTypes.STRING(1),
      defaultValue: 'N'
    },
    dcm_counts_updated: {
      type: DataTypes.STRING(1),
      defaultValue: 'N'
    }
  }, {
    sequelize,
    tableName: 'dicom_metadata',
    schema: 'public',
    timestamps: true,
  });
};
