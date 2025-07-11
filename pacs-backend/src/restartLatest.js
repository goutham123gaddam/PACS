const { exec } = require('child_process');

function killProcesses() {
    return new Promise((resolve, reject) => {
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
        // exec('pm2 start app.js', (error, stdout, stderr) => {
        //     if (error) {
        //         console.error('Error starting PM2:', error);
        //         reject(error);
        //         return;
        //     }
        //     resolve(stdout);
        // });
    });
}

// Execute the restart
(async () => {
    try {
        console.log('Killing all processes...');
        await killProcesses();
        
        // Wait for processes to be killed
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('Starting application with PM2...');
        await startWithPM2();
        
        console.log('Restart completed successfully');
    } catch (error) {
        console.error('Error during restart:', error);
        process.exit(1);
    }
})();