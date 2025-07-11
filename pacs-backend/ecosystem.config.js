module.exports = {
    apps: [{
      name: 'pacs_node_server',
      script: './src/app.js',
      instances: 1, // or a specific number like 4
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      wait_ready: false, // Wait for process.send('ready')
      listen_timeout: 3000, // Give your app time to start
      kill_timeout: 5000,  // Give your app time to clean up
      max_restarts: 20,
      min_uptime: '5s'
    }]
  };