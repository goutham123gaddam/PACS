const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define(
    'patient_received_items',
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      patient_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      scan_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        // references: {
        //   model: 'RadiologyScans', // Name of the referenced table
        //   key: 'id',               // Primary key in the referenced table
        // },
      },
      item_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      item_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      date_received: {
        type: DataTypes.DATE, // Stores only the date (no time)
        allowNull: false,
      },
      received_by: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
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
        onUpdate: sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      tableName: 'patient_received_items',
      timestamps: true, // Enables Sequelize to handle `created_at` and `updated_at`
      createdAt: 'created_at', // Maps `createdAt` to `created_at`
      updatedAt: 'updated_at', // Maps `updatedAt` to `updated_at`
    }
  );
};
