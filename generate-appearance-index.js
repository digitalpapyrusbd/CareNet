#!/usr/bin/env node
/**
 * Generate appearance order index - files ordered by how users encounter them
 * This orders files by user journey/navigation flow, not by creation date
 */

const fs = require('fs');
const { execSync } = require('child_process');

console.log('Generating appearance order index data...');

// Define the order of appearance based on user journey
// This is the order users would encounter pages when using the application
const appearanceOrder = [
  // Root and public pages
  { path: '/', priority: 1 },
  { path: '/about', priority: 2 },
  { path: '/terms', priority: 3 },
  { path: '/privacy', priority: 4 },
  
  // Authentication flow
  { path: '/auth/role-selection', priority: 10 },
  { path: '/auth/login', priority: 11 },
  { path: '/auth/setup-mfa', priority: 12 },
  { path: '/auth/verify-mfa', priority: 13 },
  { path: '/auth/reset-password', priority: 14 },
  
  // Guardian journey (primary user)
  { path: '/guardian/registration', priority: 100 },
  { path: '/guardian/registration/step-1', priority: 101 },
  { path: '/guardian/registration/step-2', priority: 102 },
  { path: '/guardian/registration/step-3', priority: 103 },
  { path: '/guardian/dashboard', priority: 110 },
  { path: '/guardian/packages', priority: 120 },
  { path: '/guardian/packages/[id]', priority: 121 },
  { path: '/guardian/packages/filters', priority: 122 },
  { path: '/guardian/jobs', priority: 130 },
  { path: '/guardian/jobs/[id]', priority: 131 },
  { path: '/guardian/patients', priority: 140 },
  { path: '/guardian/patients/new', priority: 141 },
  { path: '/guardian/patients/[id]', priority: 142 },
  { path: '/guardian/patients/[id]/edit', priority: 143 },
  { path: '/guardian/patients/[id]/health-records', priority: 144 },
  { path: '/guardian/negotiation', priority: 150 },
  { path: '/guardian/negotiation/review', priority: 151 },
  { path: '/guardian/negotiation/waiting', priority: 152 },
  { path: '/guardian/messages', priority: 160 },
  { path: '/guardian/messages/[id]', priority: 161 },
  { path: '/guardian/billing', priority: 170 },
  { path: '/guardian/billing/platform', priority: 171 },
  { path: '/guardian/settings', priority: 180 },
  { path: '/guardian/prescription-upload', priority: 190 },
  { path: '/guardian/payment-warning', priority: 200 },
  { path: '/guardian/payment-reminder', priority: 201 },
  { path: '/guardian/payment-final-warning', priority: 202 },
  { path: '/guardian/account-locked', priority: 210 },
  
  // Caregiver journey
  { path: '/caregiver/registration', priority: 300 },
  { path: '/caregiver/registration/step-1', priority: 301 },
  { path: '/caregiver/registration/step-2', priority: 302 },
  { path: '/caregiver/registration/step-3', priority: 303 },
  { path: '/caregiver/registration/step-4', priority: 304 },
  { path: '/caregiver/registration/step-5', priority: 305 },
  { path: '/caregiver/registration/step-6', priority: 306 },
  { path: '/caregiver/pending-verification', priority: 310 },
  { path: '/caregiver/verification', priority: 320 },
  { path: '/caregiver/verification/document-check', priority: 321 },
  { path: '/caregiver/verification/certificates', priority: 322 },
  { path: '/caregiver/verification/police', priority: 323 },
  { path: '/caregiver/verification/police-clearance', priority: 324 },
  { path: '/caregiver/verification/physical', priority: 325 },
  { path: '/caregiver/verification/psych', priority: 326 },
  { path: '/caregiver/verification/psych-test', priority: 327 },
  { path: '/caregiver/verification/interview', priority: 328 },
  { path: '/caregiver/verification/complete', priority: 329 },
  { path: '/caregiver/verification/failed', priority: 330 },
  { path: '/caregiver/dashboard', priority: 340 },
  { path: '/caregiver/jobs', priority: 350 },
  { path: '/caregiver/jobs/[id]', priority: 351 },
  { path: '/caregiver/jobs/offer', priority: 352 },
  { path: '/caregiver/jobs/rate-guardian', priority: 353 },
  { path: '/caregiver/checkin', priority: 360 },
  { path: '/caregiver/check-in', priority: 361 },
  { path: '/caregiver/checkin/photo', priority: 362 },
  { path: '/caregiver/checkin/location-mismatch', priority: 363 },
  { path: '/caregiver/checkin/confirmation', priority: 364 },
  { path: '/caregiver/checkout', priority: 365 },
  { path: '/caregiver/check-out', priority: 366 },
  { path: '/caregiver/care-logs', priority: 370 },
  { path: '/caregiver/care-logs/activities', priority: 371 },
  { path: '/caregiver/care-logs/activity', priority: 372 },
  { path: '/caregiver/care-logs/vitals', priority: 373 },
  { path: '/caregiver/care-logs/medication', priority: 374 },
  { path: '/caregiver/care-logs/medications', priority: 375 },
  { path: '/caregiver/care-logs/incident', priority: 376 },
  { path: '/caregiver/messages', priority: 380 },
  { path: '/caregiver/messages/[id]', priority: 381 },
  { path: '/caregiver/earnings', priority: 390 },
  { path: '/caregiver/earnings/withdraw', priority: 391 },
  { path: '/caregiver/availability', priority: 400 },
  { path: '/caregiver/profile', priority: 410 },
  { path: '/caregiver/history', priority: 420 },
  { path: '/caregiver/invoice', priority: 430 },
  { path: '/caregiver/training', priority: 440 },
  { path: '/caregiver/subscription', priority: 450 },
  { path: '/caregiver/emergency', priority: 460 },
  { path: '/caregiver/account-locked', priority: 470 },
  
  // Patient journey
  { path: '/patient/login', priority: 500 },
  { path: '/patient/dashboard', priority: 510 },
  { path: '/patient/schedule', priority: 520 },
  { path: '/patient/appointments', priority: 530 },
  { path: '/patient/caregiver', priority: 540 },
  { path: '/patient/care-logs', priority: 550 },
  { path: '/patient/health-records', priority: 560 },
  { path: '/patient/medications', priority: 570 },
  { path: '/patient/medication-reminder', priority: 571 },
  { path: '/patient/chat', priority: 580 },
  { path: '/patient/emergency-contacts', priority: 590 },
  { path: '/patient/emergency-sos', priority: 591 },
  { path: '/patient/profile', priority: 600 },
  { path: '/patient/rate-caregiver', priority: 610 },
  { path: '/patient/settings', priority: 620 },
  
  // Agency journey
  { path: '/agency/registration', priority: 700 },
  { path: '/agency/registration/step-1', priority: 701 },
  { path: '/agency/registration/step-2', priority: 702 },
  { path: '/agency/registration/step-3', priority: 703 },
  { path: '/agency/registration/step-4', priority: 704 },
  { path: '/agency/registration/step-5', priority: 705 },
  { path: '/agency/pending-verification', priority: 710 },
  { path: '/agency/onboarding', priority: 715 },
  { path: '/agency/dashboard', priority: 720 },
  { path: '/agency/caregivers', priority: 730 },
  { path: '/agency/caregivers/[id]', priority: 731 },
  { path: '/agency/caregivers/add', priority: 732 },
  { path: '/agency/caregivers/pool', priority: 733 },
  { path: '/agency/jobs', priority: 740 },
  { path: '/agency/jobs/[id]', priority: 741 },
  { path: '/agency/jobs/[id]/assign', priority: 742 },
  { path: '/agency/packages', priority: 750 },
  { path: '/agency/packages/new', priority: 751 },
  { path: '/agency/packages/[id]/edit', priority: 752 },
  { path: '/agency/inquiries', priority: 760 },
  { path: '/agency/inquiries/[id]', priority: 761 },
  { path: '/agency/messages', priority: 770 },
  { path: '/agency/messages/[id]', priority: 771 },
  { path: '/agency/billing', priority: 780 },
  { path: '/agency/subscription', priority: 790 },
  { path: '/agency/subscription/active', priority: 791 },
  { path: '/agency/rejection', priority: 800 },
  { path: '/agency/account-locked', priority: 810 },
  
  // Agency Manager
  { path: '/agency-manager', priority: 850 },
  { path: '/agency-manager/login', priority: 851 },
  { path: '/agency-manager/dashboard', priority: 860 },
  { path: '/agency-manager/assignments', priority: 870 },
  { path: '/agency-manager/quality', priority: 880 },
  { path: '/agency-manager/quality/alerts', priority: 881 },
  { path: '/agency-manager/qa', priority: 890 },
  { path: '/agency-manager/feedback', priority: 900 },
  { path: '/agency-manager/feedback/[id]/respond', priority: 901 },
  { path: '/agency-manager/alerts', priority: 910 },
  { path: '/agency-manager/reports', priority: 920 },
  
  // Shop journey
  { path: '/shop/registration', priority: 1000 },
  { path: '/shop/pending-verification', priority: 1010 },
  { path: '/shop/dashboard', priority: 1020 },
  { path: '/shop/products', priority: 1030 },
  { path: '/shop/products/new', priority: 1031 },
  { path: '/shop/products/[id]', priority: 1032 },
  { path: '/shop/orders', priority: 1040 },
  { path: '/shop/orders/[id]', priority: 1041 },
  { path: '/shop/orders/[id]/update-status', priority: 1042 },
  { path: '/shop/messages', priority: 1050 },
  { path: '/shop/analytics', priority: 1060 },
  { path: '/shop/billing', priority: 1070 },
  { path: '/shop/payment-warning', priority: 1080 },
  { path: '/shop/payment-reminder', priority: 1081 },
  { path: '/shop/payment-final-warning', priority: 1082 },
  { path: '/shop/account-locked', priority: 1090 },
  
  // Shop Manager
  { path: '/shop-manager', priority: 1100 },
  { path: '/shop-manager/login', priority: 1101 },
  { path: '/shop-manager/dashboard', priority: 1110 },
  { path: '/shop-manager/orders', priority: 1120 },
  { path: '/shop-manager/orders/[id]', priority: 1121 },
  { path: '/shop-manager/inventory', priority: 1130 },
  { path: '/shop-manager/inventory/update', priority: 1131 },
  { path: '/shop-manager/inquiries', priority: 1140 },
  { path: '/shop-manager/chat', priority: 1150 },
  { path: '/shop-manager/analytics', priority: 1160 },
  { path: '/shop-manager/alerts', priority: 1170 },
  { path: '/shop-manager/restrictions', priority: 1180 },
  
  // Marketplace
  { path: '/marketplace', priority: 1200 },
  { path: '/marketplace/jobs/[id]', priority: 1201 },
  
  // Moderator journey
  { path: '/moderator', priority: 1300 },
  { path: '/moderator/login', priority: 1301 },
  { path: '/moderator/dashboard', priority: 1310 },
  { path: '/moderator/verification/agencies', priority: 1320 },
  { path: '/moderator/verification/agencies/[id]', priority: 1321 },
  { path: '/moderator/verification/caregivers', priority: 1330 },
  { path: '/moderator/verification/caregivers/[id]', priority: 1331 },
  { path: '/moderator/verification/caregivers/[id]/pipeline', priority: 1332 },
  { path: '/moderator/queues/certificates', priority: 1340 },
  { path: '/moderator/queues/interviews', priority: 1341 },
  { path: '/moderator/queues/legal', priority: 1342 },
  { path: '/moderator/queues/physical', priority: 1343 },
  { path: '/moderator/queues/police', priority: 1344 },
  { path: '/moderator/queues/psych', priority: 1345 },
  { path: '/moderator/disputes', priority: 1350 },
  { path: '/moderator/disputes/[id]', priority: 1351 },
  { path: '/moderator/tickets', priority: 1360 },
  { path: '/moderator/tickets/[id]', priority: 1361 },
  { path: '/moderator/messages', priority: 1370 },
  { path: '/moderator/packages/agency', priority: 1380 },
  { path: '/moderator/packages/caregiver', priority: 1381 },
  { path: '/moderator/subscription/agency', priority: 1390 },
  { path: '/moderator/subscription/caregiver', priority: 1391 },
  { path: '/moderator/cv-pool', priority: 1400 },
  { path: '/moderator/analytics', priority: 1410 },
  { path: '/moderator/billing', priority: 1420 },
  { path: '/moderator/settings', priority: 1430 },
  
  // Admin journey
  { path: '/admin/login', priority: 1500 },
  { path: '/admin/dashboard', priority: 1510 },
  { path: '/admin/users', priority: 1520 },
  { path: '/admin/users/[id]', priority: 1521 },
  { path: '/admin/agencies', priority: 1530 },
  { path: '/admin/agencies/[id]', priority: 1531 },
  { path: '/admin/caregivers', priority: 1540 },
  { path: '/admin/caregivers/[id]', priority: 1541 },
  { path: '/admin/caregiver-pool', priority: 1542 },
  { path: '/admin/moderators', priority: 1550 },
  { path: '/admin/moderators/[id]', priority: 1551 },
  { path: '/admin/moderators/add', priority: 1552 },
  { path: '/admin/jobs', priority: 1560 },
  { path: '/admin/submissions', priority: 1570 },
  { path: '/admin/submissions/[id]', priority: 1571 },
  { path: '/admin/submissions/[id]/decision', priority: 1572 },
  { path: '/admin/review/certificates', priority: 1580 },
  { path: '/admin/review/interviews', priority: 1581 },
  { path: '/admin/review/legal', priority: 1582 },
  { path: '/admin/review/physical', priority: 1583 },
  { path: '/admin/review/police', priority: 1584 },
  { path: '/admin/review/psych', priority: 1585 },
  { path: '/admin/verification/agencies', priority: 1590 },
  { path: '/admin/verification/caregivers', priority: 1591 },
  { path: '/admin/marketplace/applications', priority: 1600 },
  { path: '/admin/disputes', priority: 1610 },
  { path: '/admin/tickets', priority: 1620 },
  { path: '/admin/messages', priority: 1630 },
  { path: '/admin/audit-logs', priority: 1640 },
  { path: '/admin/locked-accounts', priority: 1650 },
  { path: '/admin/locked-accounts/[id]/unlock', priority: 1651 },
  { path: '/admin/mfa-failed', priority: 1652 },
  { path: '/admin/languages', priority: 1660 },
  { path: '/admin/translations', priority: 1670 },
  { path: '/admin/translations/scrubber', priority: 1671 },
  { path: '/admin/templates/agency-package', priority: 1680 },
  { path: '/admin/templates/caregiver-package', priority: 1681 },
  { path: '/admin/subscription/agency', priority: 1690 },
  { path: '/admin/subscription/caregiver', priority: 1691 },
  { path: '/admin/billing', priority: 1700 },
  { path: '/admin/analytics', priority: 1710 },
  { path: '/admin/system-settings', priority: 1720 },
  
  // Other pages
  { path: '/dashboard', priority: 1800 },
  { path: '/messages', priority: 1810 },
  { path: '/not-found', priority: 1900 },
  { path: '/offline', priority: 1910 },
];

// Create a map for quick lookup
const orderMap = new Map();
appearanceOrder.forEach(item => {
  orderMap.set(item.path, item.priority);
});

// Get all files
const files = execSync('find src/app -type f \\( -name "page.tsx" -o -name "route.ts" \\)', { encoding: 'utf-8' })
  .trim()
  .split('\n')
  .map(f => f.trim())
  .filter(f => f);

console.log(`Found ${files.length} files`);

// Convert to page structure with appearance order
const pages = files.map((file, index) => {
  let routePath = file.replace(/^src\/app/, '').replace(/\/page\.tsx$/, '').replace(/\/route\.ts$/, '');
  if (!routePath) routePath = '/';
  if (!routePath.startsWith('/')) routePath = '/' + routePath;
  
  const isApi = file.includes('/api/');
  const stat = execSync(`stat -c "%Y|%y" "${file}"`, { encoding: 'utf-8' }).trim();
  const [timestamp, dateStr] = stat.split('|');
  const date = new Date(parseInt(timestamp) * 1000);
  
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
  
  // Get priority from order map, or assign a high number for unordered items
  let priority = orderMap.get(routePath);
  if (!priority) {
    // For API routes, assign very high priority (they appear last)
    if (isApi) {
      priority = 10000 + index;
    } else {
      // For other unordered pages, assign based on category
      const categoryPriority = {
        'admin': 2000,
        'moderator': 1500,
        'agency': 800,
        'agency-manager': 900,
        'caregiver': 500,
        'guardian': 200,
        'patient': 600,
        'shop': 1100,
        'shop-manager': 1200,
        'marketplace': 1300,
        'auth': 20,
        'others': 1900
      };
      priority = (categoryPriority[category] || 5000) + index;
    }
  }
  
  return {
    index: 0, // Will be set after sorting
    title: title,
    path: routePath,
    filePath: file,
    isApi: isApi,
    date: date.toISOString(),
    dateFormatted: date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    timestamp: parseInt(timestamp),
    category: category,
    priority: priority
  };
});

// Sort by priority (appearance order)
pages.sort((a, b) => {
  if (a.priority !== b.priority) {
    return a.priority - b.priority;
  }
  // If same priority, sort by path alphabetically
  return a.path.localeCompare(b.path);
});

// Assign sequential index numbers
pages.forEach((page, index) => {
  page.index = index + 1;
});

// Write JSON for use in HTML
fs.writeFileSync('appearance-data.json', JSON.stringify(pages, null, 2));
console.log(`✓ Generated appearance order data for ${pages.length} files`);
console.log(`  First file: ${pages[0].path} (${pages[0].title})`);
console.log(`  Last file: ${pages[pages.length - 1].path} (${pages[pages.length - 1].title})`);
console.log(`\nData saved to: appearance-data.json`);
console.log(`Open index-chronological.html in your browser to view the appearance order index.`);

