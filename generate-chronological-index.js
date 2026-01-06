#!/usr/bin/env node
/**
 * Generate chronological index data from file modification dates
 * Run this script to update chronological-data.json when files are added/modified
 */

const fs = require('fs');
const { execSync } = require('child_process');

console.log('Generating chronological index data...');

// Get all files with their modification dates
const files = execSync('find src/app -type f \\( -name "page.tsx" -o -name "route.ts" \\) -exec stat -c "%Y|%n" {} \\;', { encoding: 'utf-8' })
  .trim()
  .split('\n')
  .map(line => {
    const [timestamp, filepath] = line.split('|');
    return { timestamp: parseInt(timestamp), filepath: filepath.trim() };
  })
  .sort((a, b) => a.timestamp - b.timestamp);

console.log(`Found ${files.length} files`);

// Convert to page structure
const pages = files.map((file, index) => {
  let routePath = file.filepath.replace(/^src\/app/, '').replace(/\/page\.tsx$/, '').replace(/\/route\.ts$/, '');
  if (!routePath) routePath = '/';
  if (!routePath.startsWith('/')) routePath = '/' + routePath;
  
  const isApi = file.filepath.includes('/api/');
  const date = new Date(file.timestamp * 1000);
  
  // Extract title from path
  const pathParts = routePath.split('/').filter(p => p);
  let title = pathParts[pathParts.length - 1] || 'Home';
  title = title.replace(/\[.*?\]/g, '').replace(/-/g, ' ');
  title = title.charAt(0).toUpperCase() + title.slice(1);
  
  // Determine category/role
  let category = 'others';
  if (routePath.startsWith('/admin/')) category = 'admin';
  else if (routePath.startsWith('/agency/')) category = 'agency';
  else if (routePath.startsWith('/agency-manager/')) category = 'agency-manager';
  else if (routePath.startsWith('/caregiver/')) category = 'caregiver';
  else if (routePath.startsWith('/guardian/')) category = 'guardian';
  else if (routePath.startsWith('/moderator/')) category = 'moderator';
  else if (routePath.startsWith('/patient/')) category = 'patient';
  else if (routePath.startsWith('/shop/')) category = 'shop';
  else if (routePath.startsWith('/shop-manager/')) category = 'shop-manager';
  else if (routePath.startsWith('/marketplace/')) category = 'marketplace';
  else if (routePath.startsWith('/api/')) category = 'api';
  else if (routePath.startsWith('/auth/')) category = 'auth';
  
  return {
    index: index + 1,
    title: title,
    path: routePath,
    filePath: file.filepath,
    isApi: isApi,
    date: date.toISOString(),
    dateFormatted: date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    timestamp: file.timestamp,
    category: category
  };
});

// Write JSON for use in HTML
fs.writeFileSync('chronological-data.json', JSON.stringify(pages, null, 2));
console.log(`✓ Generated chronological data for ${pages.length} files`);
console.log(`  First file: ${pages[0].filePath} (${pages[0].dateFormatted})`);
console.log(`  Last file: ${pages[pages.length - 1].filePath} (${pages[pages.length - 1].dateFormatted})`);
console.log(`\nData saved to: chronological-data.json`);
console.log(`Open index-chronological.html in your browser to view the chronological index.`);

