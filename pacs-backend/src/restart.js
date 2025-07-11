const pm2 = require('pm2');
const { exec } = require('child_process');
const utils = require('./utils');

let isReloading = false;

// function restartServer() {
//     return new Promise((resolve, reject) => {
//         // Check if reload is already in progress
//         if (isReloading) {
//             reject(new Error('Another reload is already in progress'));
//             return;
//         }

//         isReloading = true;

//         pm2.connect(async (err) => {
//             if (err) {
//                 isReloading = false;
//                 console.error('Failed to connect to PM2:', err);
//                 reject(err);
//                 return;
//             }

//             try {
//                 // Wait a bit before starting reload
//                 await new Promise(resolve => setTimeout(resolve, 1000));

//                 // Perform reload
//                 await new Promise((res, rej) => {
//                     pm2.reload('pacs_node_server', (err) => {
//                         if (err) rej(err);
//                         else {
//                             utils.startScp();
//                             res();};
//                     });
//                 });

//                 console.log('Application reloaded successfully');
//                 pm2.disconnect();
//                 isReloading = false;
//                 resolve();
//             } catch (error) {
//                 console.error('Error during restart:', error);
//                 pm2.disconnect();
//                 isReloading = false;
//                 reject(error);
//             }
//         });
//     });
// }

// async function restartServer() {
//     if (isReloading) throw new Error('Another reload is already in progress');
//     isReloading = true;

//     try {
//         // Kill the current process (or PM2 instance) running the app
//         console.log('Stopping app...');
//         await new Promise((resolve, reject) => {
//             exec('pm2 stop all', (error, stdout, stderr) => {
//                 if (error) {
//                     console.error('Error stopping app:', stderr);
//                     reject(error);
//                 } else {
//                     console.log(stdout);
//                     resolve();
//                 }
//             });
//         });

//         // Start the app again
//         console.log('Starting app...');
//         await new Promise((resolve, reject) => {
//             exec('pm2 start ecosystem.config.js', (error, stdout, stderr) => {
//                 if (error) {
//                     console.error('Error starting app:', stderr);
//                     reject(error);
//                 } else {
//                     console.log(stdout);
//                     resolve();
//                 }
//             });
//         });

//         console.log('App restarted successfully');
//         isReloading = false;
//     } catch (error) {
//         isReloading = false;
//         console.error('Error during app restart:', error);
//         throw error;
//     }
// }

// In your API route
// server.post('/restart-server', async (req, res) => {
//     try {
//         await restartServer();
//         res.send({ status: 'Server restarted successfully' });
//     } catch (error) {
//         if (error.message === 'Another reload is already in progress') {
//             res.status(409).send({ error: 'Reload already in progress' });
//         } else {
//             res.status(500).send({ error: 'Failed to restart server' });
//         }
//     }
// });



function killProcesses() {
    return new Promise((resolve, reject) => {
        // Kill processes on specific ports (4000 for Node, 8890 for DICOM, 7777 for HL7)
        const killCommand = `
            lsof -ti :4000 | xargs kill -9;
            lsof -ti :8890 | xargs kill -9;
            lsof -ti :7777 | xargs kill -9;
        `;

        exec(killCommand, (error, stdout, stderr) => {
            if (error) {
                console.log("Some processes might not exist, continuing anyway...");
            }
            resolve();
        });
    });
}

function startWithPM2() {
    return new Promise((resolve, reject) => {
        exec('pm2 start ecosystem.config.js', (error, stdout, stderr) => {
            if (error) {
                console.error('Error starting PM2:', error);
                reject(error);
                return;
            }
            resolve(stdout);
        });
    });
}

async function restartAllServers() {
    try {
        console.log('Killing all processes...');
        await killProcesses();

        // Small delay to ensure processes are killed
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('Starting application with PM2...');
        await startWithPM2();

        console.log('All servers restarted successfully');
        return true;
    } catch (error) {
        console.error('Error during restart:', error);
        throw error;
    }
}


module.exports = { restartAllServers };