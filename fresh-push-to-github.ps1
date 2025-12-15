# Fresh Push Script - Deletes everything on GitHub and pushes your entire local codebase
# This creates a completely fresh repository on GitHub

cd "c:\Users\callz\OneDrive\Documents\My Projects\SynologyDrive\Websites\Caregiver"

Write-Host "=== Fresh Push to GitHub ===" -ForegroundColor Cyan
Write-Host "This will replace ALL content on GitHub with your local files" -ForegroundColor Yellow
Write-Host ""

# Step 1: Remove existing remote
Write-Host "Step 1: Removing existing remote..." -ForegroundColor Green
git remote remove origin 2>$null

# Step 2: Create orphan branch (fresh start, no history)
Write-Host "Step 2: Creating fresh orphan branch..." -ForegroundColor Green
git checkout --orphan fresh-main

# Step 3: Remove all files from staging
Write-Host "Step 3: Clearing staging area..." -ForegroundColor Green
git rm -rf --cached . 2>$null

# Step 4: Add all your current files
Write-Host "Step 4: Adding all local files..." -ForegroundColor Green
git add -A

# Step 5: Check what will be committed
$fileCount = (git status --short | Measure-Object -Line).Lines
Write-Host "Files to commit: $fileCount" -ForegroundColor Cyan
Write-Host ""

# Step 6: Commit everything
Write-Host "Step 5: Committing all files..." -ForegroundColor Green
git commit -m "Complete CareNet platform: 25 backend modules, frontend, TypeScript fixes, deployment ready"

# Step 7: Delete old main branch locally (if exists)
Write-Host "Step 6: Cleaning up old branches..." -ForegroundColor Green
git branch -D main 2>$null

# Step 8: Rename current branch to main
Write-Host "Step 7: Setting main branch..." -ForegroundColor Green
git branch -M main

# Step 9: Add remote
Write-Host "Step 8: Adding GitHub remote..." -ForegroundColor Green
git remote add origin https://github.com/digitalpapyrusbd/CareNet.git
git remote -v
Write-Host ""

# Step 10: Force push (this replaces everything on GitHub)
Write-Host "Step 9: Pushing to GitHub (this will replace ALL content)..." -ForegroundColor Yellow
Write-Host "NOTE: You may be prompted for GitHub credentials" -ForegroundColor Cyan
Write-Host "Use your GitHub username and a Personal Access Token as password" -ForegroundColor Cyan
Write-Host ""
git push -u origin main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓✓✓ SUCCESS! All code pushed to GitHub ✓✓✓" -ForegroundColor Green
    Write-Host "Repository: https://github.com/digitalpapyrusbd/CareNet" -ForegroundColor Cyan
    Write-Host "All old content has been replaced with your current codebase" -ForegroundColor Green
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


