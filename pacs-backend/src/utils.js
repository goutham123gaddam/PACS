const config = require('config');
const dict = require('dicom-data-dictionary');
const dimse = require('dicom-dimse-native');
const dict2 = require('@iwharris/dicom-data-dictionary');
const fs = require('fs');
const shell = require('shelljs');
const path = require('path');
const { handleNewDicomFile, handleNewStudy } = require('./controllers/file-controller');
const chokidar = require('chokidar');
const { exec, spawn } = require('child_process');

// make sure default directories exist
const logDir = config.get('logDir');
shell.mkdir('-p', logDir);
shell.mkdir('-p', config.get('storagePath'));

// create a rolling file logger based on date/time that fires process events
// const opts = {
//   errorEventName: 'error',
//   logDirectory: logDir, // NOTE: folder must exist and be writable...
//   fileNamePattern: 'roll-<DATE>.log',
//   dateFormat: 'YYYY.MM.DD',
// };
// const manager = require('simple-node-logger').createLogManager();
// manager.createConsoleAppender();
// manager.createRollingFileAppender(opts);
// const logger = manager.createLogger();

const logger = {
  info: (i) => {
    console.log("INFO: " + JSON.stringify(i));
  },
  error: (i) => {
    console.error("ERROR: " + JSON.stringify(i));
  },
};

//------------------------------------------------------------------

const findDicomName = (name) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(dict.standardDataElements)) {
    const value = dict.standardDataElements[key];
    if ((value.name === name) || (name === key)) {
      return key;
    }
  }
  return undefined;
};


const findVR = (name) => {
  const dataElement =  dict2.get_element(name);
  if (dataElement) {
    return dataElement.vr;
  }
  return '';
};

//------------------------------------------------------------------

const utils = {
  getLogger: () => logger,
  startScp: () => {
    console.log("* START SCP");
    
    const source = config.get('source');
    const ar = config.get('peers');
    const peers = [];
    // ar.forEach((aet) => {
    //   peers.push(aet);
    // });

    const ts = config.get('transferSyntax');
    const j = {};
    j.source = source;
    j.target = j.source;
    j.peers = peers;
    j.peers.push(j.source);
    j.storagePath = config.get('storagePath');
    j.verbose = config.get('verboseLogging');
    j.permissive = config.get('permissiveMode');
    j.netTransferPrefer = ts;
    j.netTransferPropose = ts;
    j.writeTransfer = ts;

    logger.info(`pacs-server listening on port: ${j.source.port}`);

    dimse.startStoreScp(j, (result) => {
      // currently this will never finish
      // console.log("Start store scp", result);
      logger.info("Start store scp", JSON.parse(result));

    });
  },

  startListener: () => {
    const serverStartTime = Date.now();
    const storagePath = config.get('storagePath');
    const watcher = chokidar.watch(storagePath, { ignoreInitial: true, depth: 0});

    // watcher.on('add', (filePath) => {
      // console.log(`New DICOM file received: ${filePath}`);
      // logger.info(`New DICOM file received: ${filePath}`);
      // Add your logic to process the new file
      // handleNewDicomFile(filePath);
    // });

    watcher.on('all', (event, path) => {
      console.log(`Event: ${event}, Path: ${path}`);
    });

    watcher.on('addDir', (dirPath) => {
      console.log(`New study directory received: ${dirPath}`);
      logger.info(`New study directory received: ${dirPath}`);
      // Add your logic for new directories (e.g., a complete study received)
      setTimeout(() => {
        handleNewStudy(dirPath);
      }, 60000)
    });
  },

  startScu: ({studyUID, nodeDetails}) => {
    const {en_ip, en_port, en_aet} = nodeDetails;
    try {
    // Configuration for sending DICOM files
    console.log("0");
    const source = config.get('source');
    const storagePath = config.get('storagePath')
    const options = {
      source: source,
      target: {
        ip: en_ip,     // Replace with the target server's IP/hostname
        port: en_port,                 // Replace with the target server's port (default: 104)
        aet: en_aet,      // Replace with the target AE title
      },
      // fileList: [
      //   path.join(__dirname, '../data/1.2.410.200001.101.11.601.1104186096.1.20231129031606531/1.2.410.200001.101.11.601.1104186096.3.20231129031737038'), // Path to the first DICOM file
      //   // path.join(__dirname, 'file2.dcm'), // Path to the second DICOM file
      // ],
      sourcePath: path.join(__dirname, storagePath,  studyUID)
    };
    console.log("1");
          
      // Send files using the C-STORE operation
    dimse.storeScu(options, (err, results) => {
      if (err) {
        console.error('Error during C-STORE operation:', err);
        return;
      }
      // console.log('C-STORE Results:', results);
    });
    } catch(e) {
      console.log("Error pushing", e);
      
    }
  },

  startScuBackup: ({studyUID, nodeDetails}) => {
    const {en_ip, en_port, en_aet} = nodeDetails;
    try {
    // Configuration for sending DICOM files
    console.log("0");
    const source = config.get('source');
    const storagePath = config.get('storagePath')
    const options = {
      source: source,
      target: {
        ip: '127.0.0.1',     // Replace with the target server's IP/hostname
        port: 8891,                 // Replace with the target server's port (default: 104)
        aet: 'PACS_FYZKS',      // Replace with the target AE title
      },
      fileList: [
        path.join(__dirname, '../data/1.2.410.200001.101.11.601.1104186096.1.20231129031606531/1.2.410.200001.101.11.601.1104186096.3.20231129031737038'), // Path to the first DICOM file
        // path.join(__dirname, 'file2.dcm'), // Path to the second DICOM file
      ],
      sourcePath: path.join(__dirname, storagePath,  studyUID)
    };
      // Send files using the C-STORE operation
    dimse.storeScu(options, (err, results) => {
      if (err) {
        console.error('Error during C-STORE operation:', err);
        return;
      }
      console.log('C-STORE Results:', results);
    });
    } catch(e) {
      console.log("Error pushing", e);
      
    }
  },

  shutdown: () => {
    const j = {};
    j.source = config.get('source');
    j.target = config.get('source');
    j.verbose = config.get('verboseLogging');

    logger.info(`sending shutdown request to target: ${j.target.aet}`);
    return new Promise((resolve, reject) => {
      dimse.shutdownScu(j, (result) => {
        console.log("shutdown result", result);
        if (result && result.length > 0) {
          try {
            logger.info(JSON.parse(result));
            resolve();
          } catch (error) {
            logger.error(result);
            reject();
          }
        }
        reject();
      });
    });
  },
  sendEcho: () => {
    const j = {};
    j.source = config.get('source');
    j.target = j.source;
    j.verbose = config.get('verboseLogging');

    logger.info(`sending C-ECHO to target: ${j.target.aet}`);

    return new Promise((resolve, reject) => {
      dimse.echoScu(j, (result) => {
        if (result && result.length > 0) {
          try {
            logger.info(JSON.parse(result));
            resolve();
          } catch (error) {
            logger.error(result);
            reject();
          }
        }
        reject();
      });
    });
  },
  fileExists: (pathname) => new Promise((resolve, reject) => {
      fs.access(pathname, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }),
  studyLevelTags: () => [
      '00080005', // char set
      '00080020', // Study Date
      '00080030', // Study Time
      '00080050', // 	Accession Number
      '00080054', // Retrieve AE Title
      '00080056', // Instance Availability
      '00080061', // Modalities in Study
      '00080090', // Referring Physician's Name
      '00081190', // Retrieve URL
      '00100010', // Patient's Name
      '00100020', // Patient ID
      '00100030', // Patient's Birth Date
      '00100040', // 	Patient's Sex
      '0020000D', // Study Instance UID
      '00200010', // 	Study ID
      '00201206', // Number of Study Related Series
      '00201208', // Number of Study Related Instances
      '00401001', // RequestedProcedureID
      '00080100', // Code Value
      '00321034', // requesting service code
      '00180015', // Body Part Examined
      '00280010', // Rows
      '00280011', // Columns
    ],
  seriesLevelTags: () => ['00080005', '00080054', '00080056', '00080060', '0008103E', '00081190', '0020000E', '00200011', '00201209'],
  imageLevelTags: () => ['00080016', '00080018', '00280010', '00280011', '00180015'],
  imageMetadataTags: () => [
      '00080016',
      '00080018',
      '00080060',
      '00280002',
      '00280004',
      '00280010',
      '00280011',
      '00280030',
      '00280100',
      '00280101',
      '00280102',
      '00280103',
      '00281050',
      '00281051',
      '00281052',
      '00281053',
      '00200032',
      '00200037',
      '00180015'
    ],
  compressFile: (inputFile, outputDirectory, transferSyntax) => {
    const j = {
      sourcePath: inputFile,
      storagePath: outputDirectory,
      writeTransfer: transferSyntax || config.get('transferSyntax'),
      verbose: config.get('verboseLogging'),
      enableRecompression: true,
    };
    return new Promise((resolve, reject) => {
      dimse.recompress(j, (result) => {
        if (result && result.length > 0) {
          try {
            const json = JSON.parse(result);
            if (json.code === 0) {
              resolve();
            } else {
              logger.error(`recompression failure (${inputFile}): ${json.message}`);
              reject();
            }
          } catch (error) {
            logger.error(error);
            logger.error(result);
            reject();
          }
        } else {
          logger.error('invalid result received');
          reject();
        }
      });
    });
  },
  doFind: (queryLevel, query, defaults) => {
    // console.log("query", query);
    // add query retrieve level
    const j = {
      tags: [
        {
          key: '00080052',
          value: queryLevel,
        },
      ],
    };

    // set source and target from config
    j.source = config.get('source');
    j.target = j.source;
    j.verbose = config.get('verboseLogging');
    console.log("query", query['00080050']);
    
    // parse all include fields
    const includes = query.includefield;

    let tags = [];
    if (includes) {
      tags = includes.split(',');
    }
    tags.push(...defaults);

    // add parsed tags
    tags.forEach((element) => {
      const tagName = findDicomName(element) || element;
      j.tags.push({ key: tagName, value: '' });
    });

    // add search param
    let invalidInput = false;
    const minCharsQido = config.get('qidoMinChars');
    Object.keys(query).forEach((propName) => {
      const tag = findDicomName(propName);
      const vr = findVR(propName);
      if (tag) {
        let v = query[propName];
        // string vr types check
        if (['PN', 'LO', 'LT', 'SH', 'ST'].includes(vr)) {
          // just make sure to remove any wildcards from prefix and suffix
          v = v?.replace(/^[*]/, '');
          v = v?.replace(/[*]$/, '');
          
          // check if minimum number of chars are reached from input
          if (minCharsQido > v?.length) {
            invalidInput = true;
          }
          // auto append wildcard
          if (config.get('qidoAppendWildcard')) {
            v += '*';
          }
        }
        j.tags.push({ key: tag, value: v });
      }
    });

    // console.log("1");
    
    if (invalidInput) {
      console.log("2");
      return [];
    }

    const offset = query.offset ? parseInt(query.offset, 10) : 0;

    // console.log("dimse result 1", query)

    // run find scu and return json response
    return new Promise((resolve) => {
      dimse.findScu(j, (result) => {        
        if (result && result.length > 0) {
          try {
            const json = JSON.parse(result);
            // console.log("find scu json", json)
            if (json.code === 0) {
              const container = JSON.parse(json.container);
              // console.log("container", container)
              if (container) {
                resolve(container.slice(offset));
              } else {
                resolve([]);
              }
            } else if (json.code === 1) {
              console.log("6");
              
              logger.info('query is pending...');
            } else {
              console.log("7");
              
              logger.error(`c-find failure: ${json.message}`);
              resolve([]);
            }
          } catch (error) {
            logger.error(error);
            logger.error(result);
            resolve([]);
          }
        } else {
          logger.error('invalid result received');
          resolve([]);
        }
      });
    });
  },
};
module.exports = utils;
