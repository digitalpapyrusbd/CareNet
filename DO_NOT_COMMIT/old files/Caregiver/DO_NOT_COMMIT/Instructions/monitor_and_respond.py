#!/usr/bin/env python3
"""
Script to monitor the work log file and automatically respond to new entries.
This script should be run periodically (e.g., via cron job) to check for new coder entries
and provide automated responses or guidance.
"""

import os
import re
import time
import subprocess
from datetime import datetime, timezone
from pathlib import Path

# Configuration
WORK_LOG_FILE = "DO_NOT_COMMIT/Instructions/17_CODER_WORK_LOG.md"
PROJECT_ROOT = "/home/zia/Documents/My Projects/Websites/Caregiver"
CHECK_INTERVAL = 60  # Check every 60 seconds
LAST_CHECK_FILE = ".last_work_log_check"

def get_file_mod_time(filepath):
    """Get the last modification time of a file."""
    try:
        return os.path.getmtime(filepath)
    except OSError:
        return 0

def read_work_log():
    """Read the current work log content."""
    try:
        with open(WORK_LOG_FILE, 'r') as f:
            return f.read()
    except FileNotFoundError:
        return None

def parse_new_entries(content, last_check_time):
    """Parse new entries from the work log since the last check."""
    entries = []
    lines = content.split('\n')
    current_entry = None
    
    for line in lines:
        # Look for timestamp pattern (YYYY-MM-DDTHH:MM:SSZ)
        timestamp_match = re.match(r'### (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z) - (.+)', line)
        if timestamp_match:
            timestamp_str = timestamp_match.group(1)
            coder = timestamp_match.group(2)
            
            try:
                timestamp = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00')).timestamp()
                if timestamp > last_check_time:
                    current_entry = {
                        'timestamp': timestamp_str,
                        'coder': coder,
                        'content': []
                    }
                    entries.append(current_entry)
            except ValueError:
                continue
        elif current_entry and line.startswith('**'):
            current_entry['content'].append(line)
    
    return entries

def analyze_entry(entry):
    """Analyze a work log entry and determine if action is needed."""
    content_text = ' '.join(entry['content']).lower()
    
    # Check for common issues that need attention
    if 'stuck' in content_text or 'blocked' in content_text:
        return {
            'needs_response': True,
            'type': 'HELP_NEEDED',
            'message': f"Coder {entry['coder']} needs help with a blocking issue."
        }
    
    if 'question' in content_text or 'help' in content_text:
        return {
            'needs_response': True,
            'type': 'QUESTION',
            'message': f"Coder {entry['coder']} has a question that needs answering."
        }
    
    if 'error' in content_text and ('typescript' in content_text or 'compilation' in content_text):
        return {
            'needs_response': True,
            'type': 'COMPILATION_ERROR',
            'message': f"TypeScript compilation error reported by {entry['coder']}."
        }
    
    if 'completed' in content_text or 'finished' in content_text:
        return {
            'needs_response': False,
            'type': 'TASK_COMPLETED',
            'message': f"Task completed by {entry['coder']}."
        }
    
    return {
        'needs_response': False,
        'type': 'INFO',
        'message': f"Update from {entry['coder']}."
    }

def check_project_health():
    """Check project health and return status."""
    issues = []
    
    # Check TypeScript compilation
    try:
        result = subprocess.run(
            ['npx', 'tsc', '--noEmit'],
            cwd=PROJECT_ROOT,
            capture_output=True,
            text=True,
            timeout=30
        )
        if result.returncode != 0:
            issues.append({
                'type': 'TypeScript Error',
                'details': result.stderr[:200]  # Limit output
            })
    except (subprocess.TimeoutExpired, FileNotFoundError):
        issues.append({
            'type': 'TypeScript Check Failed',
            'details': 'Could not run TypeScript compiler'
        })
    
    # Check for TODO comments
    try:
        result = subprocess.run(
            ['grep', '-r', 'TODO\\|FIXME', 'src/', '--include=*.ts', '--include=*.tsx'],
            cwd=PROJECT_ROOT,
            capture_output=True,
            text=True,
            timeout=10
        )
        if result.returncode == 0:
            todo_count = len(result.stdout.splitlines())
            if todo_count > 0:
                issues.append({
                    'type': 'TODO Comments',
                    'details': f'Found {todo_count} TODO/FIXME comments'
                })
    except (subprocess.TimeoutExpired, FileNotFoundError):
        pass
    
    return issues

def add_ai_response(entry, analysis, issues):
    """Add an AI agent response to the work log."""
    try:
        with open(WORK_LOG_FILE, 'r') as f:
            content = f.read()
        
        # Find the AI Agent Responses section
        ai_section_pattern = r'(## AI Agent Responses\n\n)(\*\(.+?\)\*\n)'
        match = re.search(ai_section_pattern, content)
        
        response_text = f"### {datetime.now(timezone.utc).isoformat()} - AI Agent\n"
        response_text += f"**Status:** RESPONSE\n"
        response_text += f"**Type:** {analysis['type']}\n"
        response_text += f"**Details:** {analysis['message']}\n"
        
        if issues:
            response_text += "**Project Issues Found:**\n"
            for issue in issues:
                response_text += f"- {issue['type']}: {issue['details']}\n"
        
        response_text += "\n"
        
        if match:
            # Insert new response after the section header
            new_content = content[:match.end(1)] + response_text + match.group(2) + content[match.end():]
        else:
            # Create AI Agent Responses section if it doesn't exist
            new_content = content + "\n\n## AI Agent Responses\n\n"
            new_content += f"*(AI Agent monitors this log and responds to coder entries)*\n\n"
            new_content += response_text
        
        with open(WORK_LOG_FILE, 'w') as f:
            f.write(new_content)
        
        return True
    except Exception as e:
        print(f"Error updating work log: {e}")
        return False

def main():
    """Main monitoring function."""
    print(f"Starting work log monitor at {datetime.now()}")
    print(f"Checking {WORK_LOG_FILE} every {CHECK_INTERVAL} seconds")
    
    while True:
        try:
            # Get last check time
            last_check_time = 0
            if os.path.exists(LAST_CHECK_FILE):
                try:
                    with open(LAST_CHECK_FILE, 'r') as f:
                        last_check_time = float(f.read())
                except:
                    pass
            
            # Read work log
            content = read_work_log()
            if content:
                # Parse new entries
                new_entries = parse_new_entries(content, last_check_time)
                
                if new_entries:
                    print(f"Found {len(new_entries)} new entries")
                    
                    # Check project health
                    issues = check_project_health()
                    
                    # Process each new entry
                    for entry in new_entries:
                        analysis = analyze_entry(entry)
                        print(f"Entry from {entry['coder']}: {analysis['type']}")
                        
                        if analysis['needs_response']:
                            print(f"Adding response for {entry['coder']}")
                            add_ai_response(entry, analysis, issues)
            
            # Update last check time
            with open(LAST_CHECK_FILE, 'w') as f:
                f.write(str(datetime.now(timezone.utc).timestamp()))
            
            # Wait before next check
            time.sleep(CHECK_INTERVAL)
            
        except KeyboardInterrupt:
            print("\nMonitoring stopped by user")
            break
        except Exception as e:
            print(f"Error in monitoring loop: {e}")
            time.sleep(CHECK_INTERVAL)

if __name__ == "__main__":
    main()