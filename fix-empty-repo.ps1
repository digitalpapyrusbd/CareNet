# Fix Empty Repository - Complete Solution
Write-Host "=== Fixing Empty Repository Issue ===" -ForegroundColor Cyan
Write-Host ""

$projectPath = "c:\Users\callz\OneDrive\Documents\My Projects\SynologyDrive\Websites\Caregiver"
cd $projectPath

Write-Host "Step 1: Checking if .git exists..." -ForegroundColor Yellow
if (Test-Path .git) {
    Write-Host "✓ Git repository exists" -ForegroundColor Green
} else {
    Write-Host "✗ No git repository found. Initializing..." -ForegroundColor Red
    git init
    Write-Host "✓ Git initialized" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 2: Checking remote..." -ForegroundColor Yellow
$remote = git remote get-url origin 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Remote exists: $remote" -ForegroundColor Green
} else {
    Write-Host "✗ No remote found. Adding..." -ForegroundColor Red
    git remote add origin https://github.com/digitalpapyrusbd/CareNet.git
    Write-Host "✓ Remote added" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 3: Checking for files..." -ForegroundColor Yellow
$fileCount = (Get-ChildItem -Recurse -File | Where-Object { $_.FullName -notlike "*node_modules*" -and $_.FullName -notlike "*.git*" }).Count
Write-Host "Found $fileCount files to commit" -ForegroundColor Cyan

Write-Host ""
Write-Host "Step 4: Adding all files..." -ForegroundColor Yellow
git add -A
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Files staged" -ForegroundColor Green
} else {
    Write-Host "✗ Error staging files" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 5: Checking what will be committed..." -ForegroundColor Yellow
$status = git status --short
if ($status) {
    Write-Host "Files to commit:" -ForegroundColor Cyan
    $status | Select-Object -First 20
} else {
    Write-Host "No changes to commit (everything already committed)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 6: Creating commit..." -ForegroundColor Yellow
git commit -m "Initial commit - CareNet platform complete codebase"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Commit created" -ForegroundColor Green
} else {
    Write-Host "⚠ No new commit (may already be committed)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 7: Setting branch to main..." -ForegroundColor Yellow
git branch -M main
Write-Host "✓ Branch set to main" -ForegroundColor Green

Write-Host ""
Write-Host "Step 8: Pushing to GitHub (this may take a while)..." -ForegroundColor Yellow
Write-Host "This will overwrite any existing content on GitHub..." -ForegroundColor Yellow
git push -u origin main --force
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓✓✓ SUCCESS! Push completed! ✓✓✓" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "✗✗✗ PUSH FAILED ✗✗✗" -ForegroundColor Red
    Write-Host "Check the error message above" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "1. Authentication required - you may need to use a Personal Access Token" -ForegroundColor Yellow
    Write-Host "2. Repository doesn't exist or you don't have access" -ForegroundColor Yellow
    Write-Host "3. Network connection issue" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Step 9: Verifying push..." -ForegroundColor Yellow
$remoteRefs = git ls-remote --heads origin main 2>&1
if ($remoteRefs -match "refs/heads/main") {
    Write-Host "✓ Verified: main branch exists on GitHub" -ForegroundColor Green
} else {
    Write-Host "⚠ Could not verify (this is okay if push succeeded)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== COMPLETE ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Visit https://github.com/digitalpapyrusbd/CareNet" -ForegroundColor White
Write-Host "2. Verify you can see your files (backend/, src/, package.json, etc.)" -ForegroundColor White
Write-Host "3. Go back to Render and try deploying again" -ForegroundColor White
Write-Host ""

