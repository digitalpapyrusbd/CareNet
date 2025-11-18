#!/bin/bash

# Script to set up persistent monitoring for the work log
# This creates both a systemd service (if available) and a cron job fallback

echo "Setting up persistent monitoring for Caregiver project..."
echo "=================================================="

PROJECT_ROOT="/home/zia/Documents/My Projects/Websites/Caregiver"
MONITOR_SCRIPT="$PROJECT_ROOT/DO_NOT_COMMIT/Instructions/monitor_and_respond.py"
SERVICE_NAME="caregiver-worklog-monitor"
LOG_FILE="$PROJECT_ROOT/monitor.log"

# Create a wrapper script that ensures the monitor is always running
cat > "$PROJECT_ROOT/run_monitor.sh" << 'EOF'
#!/bin/bash
# Wrapper script to ensure monitor is always running

cd "$(dirname "$0")"

while true; do
    echo "$(date): Starting work log monitor..." >> "$LOG_FILE" 2>&1
    python3 monitor_and_respond.py >> "$LOG_FILE" 2>&1
    echo "$(date): Work log monitor stopped unexpectedly, restarting..." >> "$LOG_FILE" 2>&1
    sleep 5
done
EOF

chmod +x "$PROJECT_ROOT/run_monitor.sh"

# Try to create systemd service (for systems with systemd)
if command -v systemctl 2>/dev/null; then
    echo "Setting up systemd service..."
    
    sudo tee /etc/systemd/system/$SERVICE_NAME.service > /dev/null << EOL
[Unit]
Description=Caregiver Work Log Monitor
After=network.target

[Service]
Type=simple
User=zia
WorkingDirectory=$PROJECT_ROOT/DO_NOT_COMMIT/Instructions
ExecStart=$PROJECT_ROOT/run_monitor.sh
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOL

    # Reload systemd and enable the service
    sudo systemctl daemon-reload
    sudo systemctl enable $SERVICE_NAME.service
    sudo systemctl start $SERVICE_NAME.service
    
    echo "✓ Systemd service created and started"
    echo "Service status: $(systemctl is-active $SERVICE_NAME.service)"
    echo "To view logs: journalctl -u $SERVICE_NAME -f"
    echo "To stop: sudo systemctl stop $SERVICE_NAME.service"
    
    # Also create cron job as backup
    echo "Setting up cron job as backup..."
else
    echo "systemd not available, using cron job only..."
fi

# Set up cron job as backup (or primary if no systemd)
CRON_ENTRY="* * * * * $PROJECT_ROOT/run_monitor.sh"
CRON_FILE="/tmp/caregiver_monitor_cron"

# Create cron job
echo "$CRON_ENTRY" > "$CRON_FILE"

# Install cron job
if command -v crontab 2>/dev/null; then
    # Add to existing crontab
    (crontab -l 2>/dev/null; cat "$CRON_FILE") | crontab -
    echo "✓ Cron job installed"
    echo "To view cron jobs: crontab -l"
    echo "To edit: crontab -e"
    echo "Cron job will run every minute"
else
    echo "⚠ crontab not available, manual monitoring required"
    echo "Please run: nohup $PROJECT_ROOT/run_monitor.sh &"
fi

# Create a status check script
cat > "$PROJECT_ROOT/check_monitor.sh" << 'EOF'
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
EOF

chmod +x "$PROJECT_ROOT/check_monitor.sh"

echo ""
echo "Setup complete!"
echo "=================="
echo ""
echo "Files created:"
echo "- $PROJECT_ROOT/run_monitor.sh (wrapper script)"
echo "- $PROJECT_ROOT/check_monitor.sh (status checker)"
echo ""
echo "To check if monitor is running: $PROJECT_ROOT/check_monitor.sh"
echo ""
echo "Monitoring log file: $LOG_FILE"
echo ""

# Start the monitor immediately
echo "Starting monitor immediately..."
nohup "$PROJECT_ROOT/run_monitor.sh" > /dev/null 2>&1 &
echo "Monitor started in background"