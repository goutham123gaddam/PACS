const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('legacy_studies', {
    ls_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ls_modality: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ls_old_pacs_db_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ls_pat_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ls_acc_no: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ls_ord_no: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ls_pacs_ord_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ls_site: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ls_folder_path: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ls_study_ids: {
      type: DataTypes.STRING,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
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
    tableName: 'legacy_studies',
    schema: 'public',
    timestamps: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
};
