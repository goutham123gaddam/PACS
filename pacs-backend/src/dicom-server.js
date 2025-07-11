const utils = require('./utils');
const logger = utils.getLogger();

  // log exceptions
  process.on('uncaughtException', (err) => {
    console.log("error", err.stack)
    logger.error('uncaught exception received:');
    logger.error(err.stack);
  });
  
  //------------------------------------------------------------------
  
  process.on('SIGINT', async () => {
    await logger.info('shutting down web server...');
    console.log('shutting down DICOM SCP server...');
    // await logger.info('shutting down DICOM SCP server...');
    await utils.shutdown();
    process.exit(0);
  });
  
  logger.info('starting...');
  utils.startScp();
    utils.sendEcho();
  