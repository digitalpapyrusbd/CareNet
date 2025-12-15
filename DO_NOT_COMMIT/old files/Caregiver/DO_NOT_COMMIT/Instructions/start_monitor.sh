#!/bin/bash

# Script to start the work log monitor
# This can be run in the background to continuously monitor the work log

echo "Starting work log monitor..."
echo "Press Ctrl+C to stop monitoring"
echo "----------------------------------------"

# Run the Python monitor script
cd "$(dirname "$0")"
python3 monitor_and_respond.py