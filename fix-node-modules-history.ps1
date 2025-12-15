# Fix: Remove node_modules from git history completely
Write-Host "=== Removing node_modules from Git History ===" -ForegroundColor Cyan
Write-Host ""

cd "c:\Users\callz\OneDrive\Documents\My Projects\SynologyDrive\Websites\Caregiver"

# Step 1: Make sure .gitignore has node_modules
Write-Host "1. Verifying .gitignore..." -ForegroundColor Yellow
$gitignoreContent = Get-Content .gitignore -Raw -ErrorAction SilentlyContinue
if ($gitignoreContent -notmatch "node_modules") {
    Write-Host "   Adding node_modules to .gitignore..." -ForegroundColor Yellow
    Add-Content .gitignore "`n# Dependencies`nnode_modules/`n"
}

# Step 2: Remove from current index
Write-Host "2. Removing node_modules from current index..." -ForegroundColor Yellow
git rm -r --cached node_modules 2>&1 | Out-Null

# Step 3: Create a fresh commit without node_modules
Write-Host "3. Staging all files (node_modules will be ignored)..." -ForegroundColor Yellow
git add -A
git commit -m "Remove node_modules from repository - files too large for GitHub" 2>&1 | Out-Null

# Step 4: Use BFG Repo-Cleaner or create orphan branch
Write-Host "4. Creating clean history..." -ForegroundColor Yellow

# Option A: Create orphan branch (fresh start)
Write-Host "   Creating orphan branch (fresh history)..." -ForegroundColor Cyan
git checkout --orphan clean-main

# Remove all files from staging
git rm -rf --cached . 2>&1 | Out-Null

# Add everything except node_modules (respects .gitignore)
git add -A

# Create initial commit
git commit -m "Initial commit - CareNet platform (node_modules excluded)"

# Delete old main branch and rename
git branch -D main 2>&1 | Out-Null
git branch -m main

Write-Host ""
Write-Host "5. Pushing clean history to GitHub..." -ForegroundColor Yellow
# Use: git push origin main --force
git push origin main --force

Write-Host ""
Write-Host "=== Done! ===" -ForegroundColor Green
Write-Host "Check https://github.com/digitalpapyrusbd/CareNet" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: This created a fresh history. Old commits are gone but files are preserved." -ForegroundColor Yellow
