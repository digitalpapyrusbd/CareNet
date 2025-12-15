# Git Setup and Push Script for CareNet
# Run this script in PowerShell from the project root directory

Write-Host "=== Git Setup and Push Script ===" -ForegroundColor Cyan
Write-Host ""

# Navigate to project directory
$projectPath = "c:\Users\callz\OneDrive\Documents\My Projects\SynologyDrive\Websites\Caregiver"
Set-Location $projectPath

Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

# Step 1: Check if .git exists
Write-Host "Step 1: Checking for .git folder..." -ForegroundColor Green
if (Test-Path .git) {
    Write-Host "✓ .git folder exists" -ForegroundColor Green
} else {
    Write-Host "✗ .git folder NOT found - initializing..." -ForegroundColor Red
    git init
    if (Test-Path .git) {
        Write-Host "✓ Git initialized successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Git init failed!" -ForegroundColor Red
        exit 1
    }
}
Write-Host ""

# Step 2: Configure remote
Write-Host "Step 2: Configuring remote..." -ForegroundColor Green
git remote remove origin 2>$null
git remote add origin https://github.com/digitalpapyrusbd/CareNet.git
git remote -v
Write-Host ""

# Step 3: Add all files
Write-Host "Step 3: Adding all files..." -ForegroundColor Green
git add -A
$status = git status --short
if ($status) {
    Write-Host "Files to be committed:" -ForegroundColor Yellow
    Write-Host $status
} else {
    Write-Host "No changes to commit" -ForegroundColor Yellow
}
Write-Host ""

# Step 4: Commit
Write-Host "Step 4: Committing changes..." -ForegroundColor Green
git commit -m "Complete backend: 25 modules, TypeScript fixes, deployment ready"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Commit successful" -ForegroundColor Green
} else {
    Write-Host "✗ Commit failed or nothing to commit" -ForegroundColor Red
}
Write-Host ""

# Step 5: Set main branch
Write-Host "Step 5: Setting main branch..." -ForegroundColor Green
git branch -M main
Write-Host ""

# Step 6: Push
Write-Host "Step 6: Pushing to GitHub..." -ForegroundColor Green
Write-Host "NOTE: You may be prompted for GitHub credentials" -ForegroundColor Yellow
Write-Host "Use your GitHub username and a Personal Access Token as password" -ForegroundColor Yellow
Write-Host ""
git push -u origin main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓✓✓ SUCCESS! Code pushed to GitHub ✓✓✓" -ForegroundColor Green
    Write-Host "Repository: https://github.com/digitalpapyrusbd/CareNet" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "✗ Push failed. Common reasons:" -ForegroundColor Red
    Write-Host "  1. Authentication required (use Personal Access Token)" -ForegroundColor Yellow
    Write-Host "  2. Repository doesn't exist or you don't have access" -ForegroundColor Yellow
    Write-Host "  3. Network issues" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To create a Personal Access Token:" -ForegroundColor Cyan
    Write-Host "  https://github.com/settings/tokens" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "=== Script Complete ===" -ForegroundColor Cyan
