// sync.js
const { sequelize, Sequelize } = require("./database");
const { PATIENT_ORDER } = require("./models");

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Sync all models
    await sequelize.sync({alter: true}); // Warning: force: true will drop the table if it already exists
    

    // Alternatively, sync individual models
    // await PATIENT_ORDER.sync();
    console.log('All models were synchronized successfully.');

    // Print current database
    const currentDatabase = await sequelize.query('SELECT current_database()', { type: Sequelize.QueryTypes.SELECT });
    console.log('Current database:', currentDatabase[0].current_database);

    // Print current schema
    const currentSchema = await sequelize.query('SHOW search_path', { type: Sequelize.QueryTypes.SELECT });
    console.log('Current schema:', currentSchema[0].search_path);

    // Print tables in the public schema
    const tables = await sequelize.query(`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `, { type: Sequelize.QueryTypes.SELECT });
    console.log('Tables in public schema:', tables);

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
})();
