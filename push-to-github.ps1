# Quick Push Script - Run this after fixing the nested repo issue
cd "c:\Users\callz\OneDrive\Documents\My Projects\SynologyDrive\Websites\Caregiver"

Write-Host "Removing nested git repository reference..." -ForegroundColor Yellow
git rm --cached Caregiver 2>$null

Write-Host "Adding all project files..." -ForegroundColor Yellow
git add -A

Write-Host "Checking what will be committed..." -ForegroundColor Yellow
$fileCount = (git status --short | Measure-Object -Line).Lines
Write-Host "Files to commit: $fileCount" -ForegroundColor Cyan

Write-Host "Committing..." -ForegroundColor Yellow
git commit -m "Complete backend: 25 modules, TypeScript fixes, deployment ready"

Write-Host "Setting remote..." -ForegroundColor Yellow
git remote set-url origin https://github.com/digitalpapyrusbd/CareNet.git

Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "You may be prompted for credentials. Use Personal Access Token as password." -ForegroundColor Cyan
git push -u origin main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
} else {
    Write-Host "Push failed. Check authentication." -ForegroundColor Red
}


