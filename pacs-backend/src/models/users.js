const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    user_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    user_firstname: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    user_lastname: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    user_fullname: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    user_password: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    user_email: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    user_mobile: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    user_created_dt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    user_last_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    user_type: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    is_active: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    user_unit_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    user_designation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    user_degree: {
      type: DataTypes.STRING,
      allowNull: true
    },
    user_signature: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    user_created_by: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'users',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "users_pkey",
        unique: true,
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
