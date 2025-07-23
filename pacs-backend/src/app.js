const server = require('fastify')({
  logger: false
})
const fastifyStatic = require('@fastify/static');
const fastifyCors  = require('@fastify/cors');
const fastifySensible  = require('@fastify/sensible');
const fastifyHelmet  = require('@fastify/helmet');
const fastifyAutoload = require('@fastify/autoload');
var hl7 = require('simple-hl7');
const path = require('path');
var http = require("http");
var public = path.join(__dirname, "storage");
const jwt = require("jsonwebtoken");
const config = require('config');
const fs = require('fs');
const utils = require('./utils');
const { cleanupInactiveStudies} = require('./controllers/pacs-controller');
const { login } = require('./controllers/common-controller');
const { exec } = require('child_process');
require("dotenv").config();
require('@fastify/multipart')
const cron = require('node-cron');
const { restartAllServers } = require('./restart');
const { parseMessage } = require('./controllers/startup-controller');

const isDicomHl7Server = process.env.APP_TYPE === 'DICOM_HL7';

const logger = utils.getLogger();

server.register(require('@fastify/multipart'), {
  addToBody: true,
});

server.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
});

server.setNotFoundHandler((_req, res) => {
  res.sendFile('index.html');
});

server.register(fastifyCors, {origin: '*',methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization']});
server.register(fastifySensible);
server.register(fastifyHelmet, 
  {
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: { policy: 'require-corp' },
    crossOriginResourcePolicy: { policy: 'same-site' },
    crossOriginOpenerPolicy: { policy: 'same-origin' },
  }
);

server.register(fastifyAutoload, {
  dir: path.join(__dirname, 'routes'),
});

server.register(fastifyAutoload, {
  dir: path.join(__dirname, 'routes'),
  options: { prefix: '/viewer' },
});

server.setErrorHandler(async err => {
  logger.error(err.message) // 'caught' 
})

// log exceptions
process.on('uncaughtException', (err) => {
  logger.error('uncaught exception received:');
  logger.error(err.stack);
});

//------------------------------------------------------------------

process.on('SIGINT', async () => {
  await logger.info('shutting down web server...');
  server.close().then(
    async () => {
      // await logger.info('webserver shutdown successfully');
      console.log('HTTP server closed');
    },
    (err) => {
      // logger.error('webserver shutdown failed', err);
      console.error('webserver shutdown failed');
    }
  );
  // console.log('shutting down DICOM SCP server...');
  // await logger.info('shutting down DICOM SCP server...');
//  process.exit(0);
  // await utils.shutdown();
  process.exit(0);
});


const port = config.get('webserverPort');
logger.info('starting...');
server.listen({ port, host: '0.0.0.0' }, async (err, address) => {
  console.log("Error in app", err);
  
  if (err) {
    await logger.error(err, address);
    process.exit(1);
  }
  // process.send('ready');
  logger.info(`web-server listening on port: ${port}`);
  console.log(`web-server listening on port: ${port}`);
  // utils.startScp();
  // utils.sendEcho();
  if (isDicomHl7Server) {
    utils.startListener();
  }

  // setPidOfTheWebServer();
  // utils.runPythonScript();
  // utils.listenToDicomReceive();
});

function authenticateRoutes(req, res, next) {
  const bearerToken = req.headers["authorization"];
  const token = bearerToken?.split(" ")[1];

  const authSkipPaths = ['/rs', '/login', '/restart-server', '/no-auth'];

  if (req.url === '/' || authSkipPaths.some((path) => req.url.includes(path))) {
    next();
    return;
  }

  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({ message: "Unauthorized" });
    }
    if (user) {
      req.user = user;
      next();
    }
  });
}

server.post('/login', async (req, res) => {
  return login(req, res);
});

server.register(require('./routes/app_routes'), { prefix: '/api' }); // Added prefix for better organization

server.post('/restart-servers', async (req, res) => {
  try {
     console.log("INSIDE RESTART API");
      res.send({ status: 'Initiating restart...' });
      
      const restartScript = path.join(__dirname, '../', 'restartOutside.js');
      exec(`node ${restartScript}`, (error, stdout, stderr) => {
          if (error) {
              console.error('Failed to execute restart script:', error);
          }
      });
  } catch (error) {
      console.error('Error initiating restart:', error);
  }
});

server.addHook('preHandler', authenticateRoutes);

setInterval(cleanupInactiveStudies, 60000);

// HL7 ---------------------------------------------
var hl7App = hl7.tcp();

hl7App.use(function(req, res, next) {
  console.log("NEW HL& message received");
  
  parseMessage(req, res, next);
});

if (isDicomHl7Server) {
  //Listen on port 7777
  console.log("Starting HL7 Server");
  hl7App.start(7777);
}

// const cronInterval = process.env.CRON_INTERVAL_FOR_UPDATE
// cron.schedule(`*/${cronInterval} * * * *`, () => {
//   console.log('Running the update status task');
//   updateStatusImpl();
// });

//------------------------------------------------------------------
hl7App.use(function(req, res, next){
  res.end()
})

hl7App.use(function(err, req, res, next) {
  var msa = res.ack.getSegment('MSA');
  msa.setField(1, 'AR');
  res.ack.addSegment('ERR', err.message);
  res.end();
});
