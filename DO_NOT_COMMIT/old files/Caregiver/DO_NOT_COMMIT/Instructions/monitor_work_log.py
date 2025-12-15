#!/usr/bin/env python3
"""
Script to monitor the coder work log and check for project issues.
This script should be run periodically to check for new comments in the work log
and to identify any errors or issues in the project files.
"""

import os
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path

# Configuration
WORK_LOG_FILE = "DO_NOT_COMMIT/Instructions/17_CODER_WORK_LOG.md"
PROJECT_ROOT = "/home/zia/Documents/My Projects/Websites/Caregiver"

def get_last_modified_time(filepath):
    """Get the last modified time of a file."""
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

def check_project_errors():
    """Check for common project errors and issues."""
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
                'details': result.stderr[:500]  # Limit output
            })
    except (subprocess.TimeoutExpired, FileNotFoundError):
        issues.append({
            'type': 'TypeScript Check Failed',
            'details': 'Could not run TypeScript compiler'
        })
    
    # Check for missing environment variables
    env_example_path = os.path.join(PROJECT_ROOT, '.env.example')
    env_path = os.path.join(PROJECT_ROOT, '.env')
    
    if os.path.exists(env_example_path):
        with open(env_example_path, 'r') as f:
            example_vars = set(line.split('=')[0] for line in f if '=' in line and not line.startswith('#'))
        
        if os.path.exists(env_path):
            with open(env_path, 'r') as f:
                actual_vars = set(line.split('=')[0] for line in f if '=' in line and not line.startswith('#'))
            
            missing_vars = example_vars - actual_vars
            if missing_vars:
                issues.append({
                    'type': 'Missing Environment Variables',
                    'details': f'Missing: {", ".join(missing_vars)}'
                })
    
    # Check for uncommitted changes (if git repo)
    try:
        result = subprocess.run(
            ['git', 'status', '--porcelain'],
            cwd=PROJECT_ROOT,
            capture_output=True,
            text=True,
            timeout=10
        )
        if result.stdout.strip():
            issues.append({
                'type': 'Uncommitted Changes',
                'details': f'Files with changes: {len(result.stdout.splitlines())}'
            })
    except (subprocess.TimeoutExpired, FileNotFoundError):
        pass
    
    return issues

def update_work_log_with_response(response_text):
    """Add an AI agent response to the work log."""
    try:
        with open(WORK_LOG_FILE, 'r') as f:
            content = f.read()
        
        # Find the AI Agent Responses section
        ai_section_pattern = r'(## AI Agent Responses\n\n)(\*\(.+?\)\*\n)'
        match = re.search(ai_section_pattern, content)
        
        if match:
            # Insert new response after the section header
            new_content = content[:match.end(1)] + f"### {datetime.now(timezone.utc).isoformat()} - AI Agent\n**Status:** RESPONSE\n**Details:** {response_text}\n\n" + match.group(2) + content[match.end():]
            
            with open(WORK_LOG_FILE, 'w') as f:
                f.write(new_content)
            
            return True
    except Exception as e:
        print(f"Error updating work log: {e}")
    
    return False

def main():
    """Main monitoring function."""
    # Get last check time (store in a file for persistence)
    last_check_file = ".last_work_log_check"
    last_check_time = 0
    
    if os.path.exists(last_check_file):
        try:
            with open(last_check_file, 'r') as f:
                last_check_time = float(f.read())
        except:
            pass
    
    # Read work log
    content = read_work_log()
    if not content:
        print("Work log file not found")
        return
    
    # Parse new entries
    new_entries = parse_new_entries(content, last_check_time)
    
    if new_entries:
        print(f"Found {len(new_entries)} new entries:")
        for entry in new_entries:
            print(f"- {entry['timestamp']} - {entry['coder']}")
            for line in entry['content']:
                print(f"  {line}")
        
        # Check for issues if there are new entries
        issues = check_project_errors()
        if issues:
            response = "Found the following issues:\n"
            for issue in issues:
                response += f"- {issue['type']}: {issue['details']}\n"
            
            update_work_log_with_response(response)
    
    # Update last check time
    with open(last_check_file, 'w') as f:
        f.write(str(datetime.now(timezone.utc).timestamp()))

if __name__ == "__main__":
    main()