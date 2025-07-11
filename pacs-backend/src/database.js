const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('FYZKS_PACS', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres', // or 'mysql', 'sqlite', 'mssql'
  port: 5432,
  logging: false,
  timezone: '+05:30',
});

module.exports = {
  sequelize,
  //galaxyDB,
  Sequelize,
};
