const config = require('config');
const dict = require('dicom-data-dictionary');
const dimse = require('dicom-dimse-native');
const dict2 = require('@iwharris/dicom-data-dictionary');
const fs = require('fs');
const shell = require('shelljs');
const path = require('path');
const { handleNewDicomFile, handleNewStudy } = require('./controllers/file-controller');
const chokidar = require('chokidar');
const { exec } = require('child_process');
const utils = require('./utils');
const {  restartAllServers } = require('./restart');
const axios = require('axios');

// make sure default directories exist
const logDir = config.get('logDir');
shell.mkdir('-p', logDir);
shell.mkdir('-p', config.get('storagePath'));

// create a rolling file logger
// const opts = {
//   errorEventName: 'error',
//   logDirectory: logDir,
//   fileNamePattern: 'roll-<DATE>.log',
//   dateFormat: 'YYYY.MM.DD',
// };
// const manager = require('simple-node-logger').createLogManager();
// manager.createRollingFileAppender(opts);

const logger = {
    info: (i) => {
      console.log("INFO: " + JSON.stringify(i));
    },
    error: (i) => {
      console.error("ERROR: " + JSON.stringify(i));
    },
  };


  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function restartServers() {
    try {
        // Since we're calling from the same server, use localhost
        const port = config.get('webserverPort') || 4000;
        const response = await axios.post(`http://localhost:${port}/restart-servers`, {});
        console.log('Restart initiated:', response.data);
    } catch (error) {
        // Handle case where server might already be down
        console.log('Server restart initiated');
    }
}

  const killProcessesOnPort = (port) => {
    // Find processes using the specified port
    const findCommand = `lsof -i :${port} -t`;
    let allPids = [];
    let nodePids = [];
    let skippedPids = [];
  
    exec(findCommand, (err, stdout, stderr) => {
      if (err || stderr) {
        console.error(`Error finding processes on port ${port}:`, err || stderr);
        return null;
      }
  
      // Get the process IDs (PIDs)
      const pids = stdout.split('\n').filter(pid => pid.trim());
  
      if (pids.length === 0) {
        console.log(`No processes found on port ${port}.`);
        return;
      }
  
      allPids = pids;
  
      // console.log(`Killing processes on port ${port}: ${pids.join(', ')}`);
  
      const pidsOn5000 = global.INITIAL_SERVER_PORT;
      // console.log("PIDS INITIAL", pidsOn5000);
      
      nodePids = pidsOn5000;
      const filteredPids = pids.filter(pid => !pidsOn5000.includes(pid));
      skippedPids = pids.filter(pid => pidsOn5000.includes(pid));
  
      if (filteredPids.length === 0) {
        console.log(`No processes need to be killed on port ${port} (shared with port 5000).`);
        return {allPids, nodePids, skippedPids};
      }
  
      // console.log(`Killing processes on port ${port} (excluding those on port 5000): ${filteredPids.join(', ')}`);
  
      // Kill each PID that isn't running on port 5000
      const killCommand = `kill -9 ${filteredPids.join(' ')}`;
      exec(killCommand, (killErr, killStdout, killStderr) => {
        if (killErr || killStderr) {
          console.error(`Error killing processes on port ${port}:`, killErr || killStderr);
          return {allPids, nodePids, skippedPids}
        } else {
          // console.log(`Successfully killed processes on port ${port} (excluding those on port 5000).`);
          return {allPids, nodePids, skippedPids}
        }
      });
    });
    // console.log("FINAL PIDS", {allPids, nodePids, skippedPids});
    
    return {allPids, nodePids, skippedPids}
  };
  
  const killAndRestart = async () => {
    // const resp1 = await utils.shutdown();
    // return;
    // const resp = await utils.shutdown();
    // const delayBetweenBatches = 500;
    // console.log("shutdown eresp", resp);
    
    const killResp  = killProcessesOnPort(8890);

    // console.log("kill resp", killResp)
    // await delay(delayBetweenBatches);
  
    if (killResp && killResp['skippedPids'].length > 0) {
  
    } else {
      const webport = 8890
      const findCommand = `lsof -i :${webport} -t`;
      exec(findCommand, async (err, stdout, stderr) => {
        if (err || stderr) {
          console.error(`Error finding processes on port ${webport}:`, err || stderr);
          connectionManager.startScp();
          return null;
        }
        const pids = stdout?.split('\n').filter(pid => pid.trim());
        // console.log("RUNNING IDS BEFORE RESTART", pids);
        if(!pids.length || pids.length < 5) {
          const resp = await utils.shutdown();
          utils.startScp();
        }
      })
    }
  }
  

class DicomConnectionManager {
  constructor(config) {
    this.config = config;
    this.activeConnections = new Map();
    this.connectionPool = [];
    this.maxConnections = 64; // Half of the 128 limit to be safe
    this.activeAssociationCount = 0;
  }


  async getConnection(operationType) {
    const key = `${operationType}_${Date.now()}`;
    
    // Try to reuse an existing connection from the pool
    const pooledConnection = this.connectionPool.pop();
    if (pooledConnection) {
      this.activeConnections.set(key, pooledConnection);
      return { connection: pooledConnection, key };
    }

    // Create new connection if under max limit
    if (this.activeConnections.size < this.maxConnections) {
      return { connection: dimse, key };
    }

    // Wait for a connection to become available
    return new Promise((resolve) => {
      const checkPool = setInterval(() => {
        const conn = this.connectionPool.pop();
        if (conn) {
          clearInterval(checkPool);
          this.activeConnections.set(key, conn);
          resolve({ connection: conn, key });
        }
      }, 100);
    });
  }

  releaseConnection(key) {
    // console.log("Release connection: " + key);

    if (this.activeConnections.has(key)) {
      const connection = this.activeConnections.get(key);
      this.activeConnections.delete(key);
      this.connectionPool.push(connection);
    }
  }

  findDicomName(name) {
    for (const key of Object.keys(dict.standardDataElements)) {
      const value = dict.standardDataElements[key];
      if ((value.name === name) || (name === key)) {
        return key;
      }
    }
    return undefined;
  }

  findVR(name) {
    const dataElement = dict2.get_element(name);
    if (dataElement) {
      return dataElement.vr;
    }
    return '';
  }

  getLogger() {
    return logger;
  }

  async startScp() {
    const { key } = await this.getConnection('scp');
    try {
      // console.log("* START SCP");
      
      const source = config.get('source');
      const ar = config.get('peers');
      const peers = [];
      ar.forEach((aet) => {
        peers.push(aet);
      });

      const ts = config.get('transferSyntax');
      const j = {
        source: source,
        target: source,
        peers: [...peers, source],
        storagePath: config.get('storagePath'),
        verbose: config.get('verboseLogging'),
        permissive: config.get('permissiveMode'),
        netTransferPrefer: ts,
        netTransferPropose: ts,
        writeTransfer: ts
      };

      logger.info(`pacs-server listening on port: ${j.source.port}`);
      
      
      return new Promise((resolve) => {
        dimse.startStoreScp(j, (result) => {
          logger.info("Start store scp", JSON.parse(result));
          resolve(result);
        });
      });
    } finally {
      this.releaseConnection(key);
    }
  }

  startListener() {
    const storagePath = config.get('storagePath');
    const watcher = chokidar.watch(storagePath, { ignoreInitial: true, depth: 0});

    watcher.on('all', (event, path) => {
      console.log(`Event: ${event}, Path: ${path}`);
    });

    watcher.on('addDir', (dirPath) => {
      // console.log(`New study directory received: ${dirPath}`);
      // logger.info(`New study directory received: ${dirPath}`);
      setTimeout(() => {
        handleNewStudy(dirPath);
      }, 60000);
    });
  }

  async startScu({studyUID, nodeDetails}) {
    const { connection, key } = await this.getConnection('store');
    try {
      const {en_ip, en_port, en_aet} = nodeDetails;
      const source = config.get('source');
      const storagePath = config.get('storagePath');
      const options = {
        source: source,
        target: {
          ip: en_ip,
          port: en_port,
          aet: en_aet,
        },
        sourcePath: path.join(__dirname, storagePath, studyUID)
      };

      return new Promise((resolve, reject) => {
        connection.storeScu(options, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    } catch(error) {
      console.log("Error pushing", error);
      throw error;
    } finally {
      this.releaseConnection(key);
    }
  }

  async sendEcho() {
    const { connection, key } = await this.getConnection('echo');
    try {
      const j = {
        source: config.get('source'),
        target: config.get('source'),
        verbose: config.get('verboseLogging')
      };

      logger.info(`sending C-ECHO to target: ${j.target.aet}`);

      return new Promise((resolve, reject) => {
        connection.echoScu(j, (result) => {
          if (result && result.length > 0) {
            try {
              logger.info(JSON.parse(result));
              resolve(result);
            } catch (error) {
              logger.error(result);
              reject(error);
            }
          } else {
            reject(new Error('Invalid echo response'));
          }
        });
      });
    } finally {
      this.releaseConnection(key);
    }
  }

  async doFind(queryLevel, query, defaults) {
    this.activeAssociationCount++;
    const { connection, key } = await this.getConnection('find');
    // console.log("active connec", this.activeAssociationCount    );
    
    try {
      const j = {
        tags: [
          {
            key: '00080052',
            value: queryLevel,
          },
        ],
      };

      j.source = config.get('source');
      j.target = j.source;
      j.verbose = config.get('verboseLogging');

      const includes = query.includefield;
      let tags = [];
      if (includes) {
        tags = includes.split(',');
      }
      tags.push(...defaults);

      tags.forEach((element) => {
        const tagName = this.findDicomName(element) || element;
        j.tags.push({ key: tagName, value: '' });
      });

      let invalidInput = false;
      const minCharsQido = config.get('qidoMinChars');
      Object.keys(query).forEach((propName) => {
        const tag = this.findDicomName(propName);
        const vr = this.findVR(propName);
        if (tag) {
          let v = query[propName];
          if (['PN', 'LO', 'LT', 'SH', 'ST'].includes(vr)) {
            v = v?.replace(/^[*]/, '');
            v = v?.replace(/[*]$/, '');
            
            if (minCharsQido > v?.length) {
              invalidInput = true;
            }
            if (config.get('qidoAppendWildcard')) {
              v += '*';
            }
          }
          j.tags.push({ key: tag, value: v });
        }
      });

      if (invalidInput) {
        return [];
      }

      const offset = query.offset ? parseInt(query.offset, 10) : 0;

      return new Promise((resolve) => {
        connection.findScu(j, (result) => {
          try {
            if (result && result.length > 0) {
              const json = JSON.parse(result);
              if (json.code === 0) {
                const container = json.container ? JSON.parse(json.container) : null;
                resolve(container ? container.slice(offset) : []);
                // killAndRestart();
              } else {
                console.log("code not 0", json);
                if (json.code === 2) { 
                  // need a retry logic here
                  // atleast restart the scp server
                  // killAndRestart();
                  // restartAllServers();
                  restartServers();
                } else {
                  resolve([]);
                }
                
              }
            } else {
              console.log("empty result 0", result);
              resolve([]);
            }
          } catch (error) {
            console.error("Error parsing DIMSE result:", error);
            console.log("Error::::", error);
            resolve([]);
          }
        });
      });
    } catch (error) {
      console.error("Error in doFind:", error);
      return [];
    } finally {
      this.releaseConnection(key);
    }
  }

  async compressFile(inputFile, outputDirectory, transferSyntax) {
    const { connection, key } = await this.getConnection('compress');
    try {
      const j = {
        sourcePath: inputFile,
        storagePath: outputDirectory,
        writeTransfer: transferSyntax || config.get('transferSyntax'),
        verbose: config.get('verboseLogging'),
        enableRecompression: true,
      };

      return new Promise((resolve, reject) => {
        connection.recompress(j, (result) => {
          if (result && result.length > 0) {
            try {
              const json = JSON.parse(result);
              if (json.code === 0) {
                resolve();
              } else {
                logger.error(`recompression failure (${inputFile}): ${json.message}`);
                reject(new Error(json.message));
              }
            } catch (error) {
              logger.error(error);
              logger.error(result);
              reject(error);
            }
          } else {
            logger.error('invalid result received');
            reject(new Error('Invalid compression result'));
          }
        });
      });
    } finally {
      this.releaseConnection(key);
    }
  }

  // Utility functions for tags
  studyLevelTags() {
    return [
      '00080005', '00080020', '00080030', '00080050', '00080054',
      '00080056', '00080061', '00080090', '00081190', '00100010',
      '00100020', '00100030', '00100040', '0020000D', '00200010',
      '00201206', '00201208', '00401001', '00080100', '00321034',
      '00180015', '00280010', '00280011'
    ];
  }

  seriesLevelTags() {
    return ['00080005', '00080054', '00080056', '00080060', '0008103E',
            '00081190', '0020000E', '00200011', '00201209'];
  }

  imageLevelTags() {
    return ['00080016', '00080018', '00280010', '00280011', '00180015'];
  }

  imageMetadataTags() {
    return [
      '00080016', '00080018', '00080060', '00280002', '00280004',
      '00280010', '00280011', '00280030', '00280100', '00280101',
      '00280102', '00280103', '00281050', '00281051', '00281052',
      '00281053', '00200032', '00200037', '00180015'
    ];
  }

  async fileExists(pathname) {
    return new Promise((resolve, reject) => {
      fs.access(pathname, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

// Create and export a singleton instance
const connectionManager = new DicomConnectionManager(config);
module.exports = connectionManager;