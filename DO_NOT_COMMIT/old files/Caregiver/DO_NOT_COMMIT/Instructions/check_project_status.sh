#!/bin/bash

# Script to check project status and monitor the work log
# This script helps the AI agent keep track of the project progress

echo "=========================================="
echo "Caregiver Project Status Check"
echo "=========================================="
echo "Time: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: Not in the project root directory (package.json not found)"
    exit 1
fi

# Check for TypeScript errors
echo "1. Checking TypeScript compilation..."
if command -v npx &> /dev/null; then
    npx tsc --noEmit 2>&1 | head -20
    echo ""
else
    echo "TypeScript compiler not available"
    echo ""
fi

# Check for linting errors
echo "2. Running ESLint..."
if command -v npx &> /dev/null; then
    npx eslint src/ --ext .ts,.tsx --max-warnings 0 2>&1 | head -20
    echo ""
else
    echo "ESLint not available"
    echo ""
fi

# Check environment variables
echo "3. Checking environment configuration..."
if [ -f ".env.example" ]; then
    if [ -f ".env" ]; then
        echo ".env file exists"
        # Check for missing variables
        missing_vars=$(comm -23 <(grep "=" .env.example | grep -v "^#" | cut -d'=' -f1 | sort) <(grep "=" .env | grep -v "^#" | cut -d'=' -f1 | sort))
        if [ -n "$missing_vars" ]; then
            echo "Missing environment variables:"
            echo "$missing_vars"
        else
            echo "All required environment variables are set"
        fi
    else
        echo "Warning: .env file does not exist"
    fi
else
    echo ".env.example file not found"
fi
echo ""

# Check database connection
echo "4. Checking database connection..."
if [ -f "prisma/schema.prisma" ]; then
    if command -v npx &> /dev/null; then
        npx prisma db pull --force 2>&1 | grep -E "(Error|error|failed|Failed)" || echo "Database connection appears to be working"
    else
        echo "Prisma CLI not available"
    fi
else
    echo "Prisma schema not found"
fi
echo ""

# Check for uncommitted changes
echo "5. Checking git status..."
if command -v git &> /dev/null; then
    if [ -d ".git" ]; then
        git status --porcelain | wc -l | xargs -I {} echo "Files with uncommitted changes: {}"
    else
        echo "Not a git repository"
    fi
else
    echo "Git not available"
fi
echo ""

# Check work log for new entries
echo "6. Checking work log for new entries..."
if [ -f "DO_NOT_COMMIT/Instructions/17_CODER_WORK_LOG.md" ]; then
    # Show the last 5 entries from the work log
    echo "Recent work log entries:"
    grep -E "^### [0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z" "DO_NOT_COMMIT/Instructions/17_CODER_WORK_LOG.md" | head -5 | sed 's/^/  /'
else
    echo "Work log file not found"
fi
echo ""

# Check for common issues in open files
echo "7. Checking for common issues in recently modified files..."
if command -v find &> /dev/null; then
    # Find recently modified TypeScript files (last 1 hour)
    recent_files=$(find src/ -name "*.ts" -o -name "*.tsx" -mmin -60 2>/dev/null)
    if [ -n "$recent_files" ]; then
        echo "Recently modified files:"
        echo "$recent_files" | sed 's/^/  /'
        echo ""
        
        # Check for TODO comments
        todo_count=$(grep -r "TODO\|FIXME\|XXX" $recent_files 2>/dev/null | wc -l)
        if [ "$todo_count" -gt 0 ]; then
            echo "Found $todo_count TODO/FIXME comments in recent files"
        fi
        
        # Check for console.log statements
        console_count=$(grep -r "console\.log" $recent_files 2>/dev/null | wc -l)
        if [ "$console_count" -gt 0 ]; then
            echo "Found $console_count console.log statements in recent files"
        fi
    else
        echo "No recently modified TypeScript files found"
    fi
fi
echo ""

echo "=========================================="
echo "Status check completed"
echo "=========================================="