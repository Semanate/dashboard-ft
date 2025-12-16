#!/bin/sh

# Entrypoint script for Dockploy deployment
# This script handles environment variables and starts the application

echo "Starting SvelteKit application..."
echo "Node version: $(node --version)"
echo "Working directory: $(pwd)"
echo "Build directory contents:"
ls -la build/ 2>/dev/null || echo "Build directory not found"

# Check if build directory exists
if [ ! -d "build" ]; then
  echo "Error: Build directory not found. Make sure the application was built correctly."
  exit 1
fi

# Start the application
echo "Starting the SvelteKit server on port $PORT (default: 3000)..."
exec node build