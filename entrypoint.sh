#!/bin/bash
set -e

# Start Flask backend on internal port
gunicorn --bind localhost:5000 app:app &
FLASK_PID=$!

# Start nginx
nginx -g "daemon off;"

# Wait for both processes
wait $FLASK_PID
