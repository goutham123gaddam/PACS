#!/bin/bash

# Stop the PM2-managed application
pm2 stop your_app_name

# Navigate to your application directory
cd /path/to/your/application

# Pull the latest changes from Git repository
git pull origin master

# Install/update dependencies
npm install

# Restart the PM2-managed application
pm2 restart your_app_name

# Optionally, you can also reload the application instead of restarting it for zero-downtime deployments
# pm2 reload your_app_name

# Perform any additional post-deployment tasks (e.g., database migrations, cache clearing, etc.)
