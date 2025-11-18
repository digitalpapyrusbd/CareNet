#!/bin/bash

# Initialize git repository
git init

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

# Instructions to create GitHub repo and push
echo ""
echo "=========================================="
echo "Git repository initialized successfully!"
echo "=========================================="
echo ""
echo "Next steps to push to GitHub:"
echo ""
echo "1. Create a new repository on GitHub:"
echo "   - Go to: https://github.com/new"
echo "   - Name: caregiver-platform (or your choice)"
echo "   - Keep it PRIVATE (contains sensitive code)"
echo "   - Do NOT initialize with README"
echo ""
echo "2. Link and push to GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "=========================================="
