# Clean Git History - Remove node_modules from all commits
Write-Host "=== Cleaning Git History ===" -ForegroundColor Cyan
Write-Host "This will remove node_modules from ALL commits in history" -ForegroundColor Yellow
Write-Host ""

cd "c:\Users\callz\OneDrive\Documents\My Projects\SynologyDrive\Websites\Caregiver"

# Method 1: Use git filter-branch (if available)
Write-Host "Attempting to remove node_modules from history..." -ForegroundColor Yellow

# Remove from current index
git rm -r --cached node_modules 2>&1 | Out-Null

# Try git filter-repo (newer, better tool)
$hasFilterRepo = git filter-repo --help 2>&1 | Select-String "filter-repo"
if ($hasFilterRepo) {
    Write-Host "Using git filter-repo..." -ForegroundColor Green
    git filter-repo --path node_modules --invert-paths --force
} else {
    Write-Host "Using git filter-branch (slower)..." -ForegroundColor Yellow
    # Remove from all commits
    git filter-branch --force --index-filter "git rm -rf --cached --ignore-unmatch node_modules" --prune-empty --tag-name-filter cat -- --all 2>&1 | Out-Null
}

Write-Host ""
Write-Host "Cleaning up backup refs..." -ForegroundColor Yellow
Remove-Item -Path .git/refs/original -Recurse -Force -ErrorAction SilentlyContinue
git reflog expire --expire=now --all 2>&1 | Out-Null
git gc --prune=now --aggressive 2>&1 | Out-Null

Write-Host ""
Write-Host "Verifying node_modules is removed..." -ForegroundColor Yellow
$nodeModulesFiles = git log --all --full-history --name-only --pretty=format: -- "node_modules/**" | Select-Object -Unique
if ($nodeModulesFiles) {
    Write-Host "WARNING: node_modules files still found in history!" -ForegroundColor Red
} else {
    Write-Host "✓ node_modules removed from history" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Ready to push ===" -ForegroundColor Green
Write-Host "Run: git push origin main --force" -ForegroundColor Cyan
