#!/bin/bash
# Wrapper script to ensure monitor is always running

cd "$(dirname "$0")"

while true; do
    echo "$(date): Starting work log monitor..." >> "$LOG_FILE" 2>&1
    python3 monitor_and_respond.py >> "$LOG_FILE" 2>&1
    echo "$(date): Work log monitor stopped unexpectedly, restarting..." >> "$LOG_FILE" 2>&1
    sleep 5
done
