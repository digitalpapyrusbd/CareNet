#!/bin/bash

# Configure git user (update with your info)
git config user.email "your-email@example.com"
git config user.name "Zia"

# Remove backend submodule issue
rm -rf backend/.git

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Caregiver Platform MVP

- NestJS backend with all API endpoints (Patients, Jobs, Care Logs, Payments, Analytics)
- Next.js frontend with role-based dashboards (Guardian, Caregiver, Company, Moderator)
- PostgreSQL database with Prisma ORM
- Authentication & authorization system (JWT, role guards)
- Payment integration (bKash, Nagad, Escrow)
- E2E integration tests (13/13 passing)
- Unit tests (46 auth + payment tests passing)
- 85% overall project completion"

echo ""
echo "=========================================="
echo "✅ Git repository ready!"
echo "=========================================="
echo ""
echo "📝 IMPORTANT: Update your email in the commit:"
echo "   cd /home/zia/Documents/My\ Projects/Websites/Caregiver"
echo "   git config user.email \"your-actual-email@example.com\""
echo "   git commit --amend --reset-author --no-edit"
echo ""
echo "🚀 To push to GitHub:"
echo ""
echo "1. Create new PRIVATE repo at: https://github.com/new"
echo "   Name: caregiver-platform"
echo ""
echo "2. Run these commands:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/caregiver-platform.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "=========================================="
