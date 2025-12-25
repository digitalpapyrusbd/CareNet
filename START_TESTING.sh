#!/bin/bash

# Manual Testing Startup Script
# This script helps you start manual testing for the multilingual system

echo "🚀 Starting Manual Testing Setup..."
echo ""

# Check if dev server is running
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "✅ Development server is already running on port 3000"
else
    echo "⚠️  Development server is not running"
    echo "   Starting development server in background..."
    npm run dev > /dev/null 2>&1 &
    sleep 5
    echo "✅ Development server started"
fi

echo ""
echo "📋 Testing Resources:"
echo "   1. Interactive Checklist: manual-testing-guide.html"
echo "   2. Quick Start Guide: MANUAL_TESTING_START.md"
echo "   3. Detailed Checklist: MANUAL_TESTING_CHECKLIST.md"
echo ""

# Try to open the HTML file
if command -v xdg-open > /dev/null; then
    echo "🌐 Opening interactive testing checklist..."
    xdg-open manual-testing-guide.html 2>/dev/null &
elif command -v open > /dev/null; then
    echo "🌐 Opening interactive testing checklist..."
    open manual-testing-guide.html 2>/dev/null &
else
    echo "⚠️  Please manually open: manual-testing-guide.html"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next Steps:"
echo "   1. The testing checklist should open in your browser"
echo "   2. Your app is available at: http://localhost:3000"
echo "   3. Start with Section A: Basic Functionality Tests"
echo "   4. Use the Pass/Fail/N/A buttons to track progress"
echo ""
echo "💡 Tip: Keep this terminal open to see any server logs"
echo ""
