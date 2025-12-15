# Verify and Push Script - Shows all output
Write-Host "=== Verifying Git Status ===" -ForegroundColor Cyan
Write-Host ""

cd "c:\Users\callz\OneDrive\Documents\My Projects\SynologyDrive\Websites\Caregiver"

Write-Host "1. Current directory:" -ForegroundColor Yellow
Get-Location
Write-Host ""

Write-Host "2. Checking if .git exists:" -ForegroundColor Yellow
if (Test-Path .git) {
    Write-Host "   ✓ Git repository found" -ForegroundColor Green
} else {
    Write-Host "   ✗ No git repository!" -ForegroundColor Red
    exit
}
Write-Host ""

Write-Host "3. Current branch:" -ForegroundColor Yellow
git branch --show-current
Write-Host ""

Write-Host "4. Remote URL:" -ForegroundColor Yellow
git remote get-url origin
Write-Host ""

Write-Host "5. Recent commits:" -ForegroundColor Yellow
git log --oneline -5
Write-Host ""

Write-Host "6. Files in repository:" -ForegroundColor Yellow
$fileCount = (git ls-files | Measure-Object -Line).Lines
Write-Host "   Total tracked files: $fileCount" -ForegroundColor Cyan
if ($fileCount -eq 0) {
    Write-Host "   ⚠ WARNING: No files tracked!" -ForegroundColor Red
}
Write-Host ""

Write-Host "7. Uncommitted changes:" -ForegroundColor Yellow
git status --short
Write-Host ""

Write-Host "8. Staging all changes..." -ForegroundColor Yellow
git add -A
Write-Host ""

Write-Host "9. Checking what will be committed:" -ForegroundColor Yellow
git status --short
Write-Host ""

$hasChanges = (git status --porcelain | Measure-Object -Line).Lines -gt 0
if ($hasChanges) {
    Write-Host "10. Committing changes..." -ForegroundColor Yellow
    git commit -m "Complete CareNet platform - all files"
    Write-Host ""
}

Write-Host "11. Pushing to GitHub..." -ForegroundColor Yellow
# Use: git push origin main
$result = git push origin main 2>&1
Write-Host $result
Write-Host ""

Write-Host "12. Verifying push..." -ForegroundColor Yellow
git ls-remote --heads origin main
Write-Host ""

Write-Host "=== Done! ===" -ForegroundColor Green
Write-Host "Check https://github.com/digitalpapyrusbd/CareNet" -ForegroundColor Cyan
