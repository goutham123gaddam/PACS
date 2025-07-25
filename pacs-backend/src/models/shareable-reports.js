module.exports = (sequelize, DataTypes) => {
  const ShareableReports = sequelize.define(
    'SHAREABLE_REPORTS',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      token: {
        type: DataTypes.STRING(64),
        unique: true,
        allowNull: false,
      },
      content_type: {
        type: DataTypes.ENUM('report', 'study'),
        defaultValue: 'report',
        allowNull: false,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Nullable for study-only shares
        references: {
          model: 'pacs_orders',
          key: 'pacs_ord_id',
        },
      },
      study_uid: {
        type: DataTypes.STRING(255),
        allowNull: true, // Used for study shares
      },
      study_description: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      created_by: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
          model: 'users',
          key: 'username',
        },
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      access_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: 'shareable_reports',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return ShareableReports;
};
