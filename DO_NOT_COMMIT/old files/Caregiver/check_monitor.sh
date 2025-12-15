#!/bin/bash
# Check if monitor is running

if pgrep -f "monitor_and_respond.py" > /dev/null; then
    echo "✓ Work log monitor is running"
else
    echo "✗ Work log monitor is NOT running"
    echo "Start it with: $0/../run_monitor.sh &"
fi

if command -v systemctl 2>/dev/null; then
    echo "Systemd service status:"
    systemctl is-active caregiver-worklog-monitor.service 2>/dev/null || echo "✗ Service not active"
fi
