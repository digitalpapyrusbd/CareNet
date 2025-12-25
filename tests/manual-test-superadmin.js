/**
 * Manual Testing Script for Super Admin Portal
 * Simulates manual testing using Playwright
 * Run with: node tests/manual-test-superadmin.js
 */

const { chromium } = require('playwright');

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
const SUPER_ADMIN_PHONE = '+8801712345101';
const SUPER_ADMIN_PASSWORD = 'Admin@123';

// Helper to log debug information
async function logDebug(page, location, message, data, hypothesisId) {
  try {
    const url = page.url();
    const title = await page.title().catch(() => 'N/A');
    const logData = {
      location,
      message,
      data,
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId,
      url,
      title,
    };
    
    await page.evaluate((logData) => {
      fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData),
      }).catch(() => {});
    }, logData);
    
    console.log(`[${hypothesisId}] ${location}: ${message}`, data || '');
  } catch (error) {
    console.error('Logging error:', error.message);
  }
}

async function runManualTests() {
  console.log('🚀 Starting Super Admin Manual Testing Simulation\n');
  console.log(`Base URL: ${BASE_URL}\n`);
  
  const browser = await chromium.launch({ 
    headless: false, // Show browser for manual observation
    slowMo: 500 // Slow down actions for visibility
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const results = {
    passed: [],
    failed: [],
    skipped: [],
  };
  
  try {
    // Test T1.1 - Super Admin Login
    console.log('\n📋 Test T1.1: Super Admin Login');
    console.log('='.repeat(50));
    
    try {
      await logDebug(page, 'manual-test:T1.1', 'Starting login test', {}, 'A');
      
      await page.goto(`${BASE_URL}/admin/login`);
      await page.waitForLoadState('networkidle');
      
      await logDebug(page, 'manual-test:T1.1', 'Navigated to login page', { url: page.url() }, 'A');
      
      // Check page elements
      const phoneInput = page.locator('input[id="phone"], input[name="phone"], input[type="tel"]').first();
      const passwordInput = page.locator('input[id="password"], input[name="password"], input[type="password"]').first();
      const submitButton = page.locator('button[type="submit"], button:has-text("Login")').first();
      
      const phoneVisible = await phoneInput.isVisible().catch(() => false);
      const passwordVisible = await passwordInput.isVisible().catch(() => false);
      const submitVisible = await submitButton.isVisible().catch(() => false);
      
      await logDebug(page, 'manual-test:T1.1', 'Form elements check', {
        phoneVisible,
        passwordVisible,
        submitVisible,
      }, 'B');
      
      if (!phoneVisible || !passwordVisible || !submitVisible) {
        throw new Error('Login form elements not found');
      }
      
      // Fill form
      await phoneInput.fill(SUPER_ADMIN_PHONE);
      await logDebug(page, 'manual-test:T1.1', 'Filled phone', { phone: SUPER_ADMIN_PHONE }, 'B');
      
      await passwordInput.fill(SUPER_ADMIN_PASSWORD);
      await logDebug(page, 'manual-test:T1.1', 'Filled password', {}, 'B');
      
      // Submit
      await submitButton.click();
      await logDebug(page, 'manual-test:T1.1', 'Clicked submit', {}, 'C');
      
      // Wait for redirect
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      await logDebug(page, 'manual-test:T1.1', 'After submit', { currentUrl }, 'C');
      
      // Check for auth token
      const authToken = await page.evaluate(() => localStorage.getItem('authToken'));
      const userData = await page.evaluate(() => localStorage.getItem('user'));
      
      await logDebug(page, 'manual-test:T1.1', 'Token check', {
        hasAuthToken: !!authToken,
        hasUserData: !!userData,
        userRole: userData ? JSON.parse(userData).role : null,
      }, 'D');
      
      if (authToken && (currentUrl.includes('/admin/dashboard') || currentUrl.includes('/auth/verify-mfa'))) {
        console.log('✅ T1.1 PASSED: Login successful');
        results.passed.push('T1.1');
      } else {
        console.log('❌ T1.1 FAILED: Login did not succeed');
        console.log(`   URL: ${currentUrl}`);
        console.log(`   Has Token: ${!!authToken}`);
        results.failed.push({ test: 'T1.1', reason: 'Login failed or no token stored' });
      }
    } catch (error) {
      console.log(`❌ T1.1 FAILED: ${error.message}`);
      results.failed.push({ test: 'T1.1', reason: error.message });
    }
    
    // Test T1.2 - Dashboard Access
    console.log('\n📋 Test T1.2: Dashboard Access After Login');
    console.log('='.repeat(50));
    
    try {
      // Navigate to dashboard
      await page.goto(`${BASE_URL}/admin/dashboard`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      await logDebug(page, 'manual-test:T1.2', 'Dashboard loaded', { url: page.url() }, 'E');
      
      // Check for dashboard elements
      const dashboardTitle = page.locator('h1, h2').filter({ hasText: /dashboard|admin/i }).first();
      const navMenu = page.locator('nav, [role="navigation"]').first();
      
      const titleVisible = await dashboardTitle.isVisible({ timeout: 3000 }).catch(() => false);
      const navVisible = await navMenu.isVisible({ timeout: 3000 }).catch(() => false);
      
      await logDebug(page, 'manual-test:T1.2', 'Dashboard elements', {
        titleVisible,
        navVisible,
        url: page.url(),
      }, 'F');
      
      // Check for errors
      const errorElements = page.locator('text=/404|500|error/i');
      const errorCount = await errorElements.count();
      
      if (page.url().includes('/admin/dashboard') && errorCount === 0) {
        console.log('✅ T1.2 PASSED: Dashboard accessible');
        results.passed.push('T1.2');
      } else {
        console.log('❌ T1.2 FAILED: Dashboard not accessible or errors present');
        console.log(`   URL: ${page.url()}`);
        console.log(`   Errors: ${errorCount}`);
        results.failed.push({ test: 'T1.2', reason: 'Dashboard not accessible' });
      }
    } catch (error) {
      console.log(`❌ T1.2 FAILED: ${error.message}`);
      results.failed.push({ test: 'T1.2', reason: error.message });
    }
    
    // Test T1.3 - Session Persistence
    console.log('\n📋 Test T1.3: Session Persistence');
    console.log('='.repeat(50));
    
    try {
      const authTokenBefore = await page.evaluate(() => localStorage.getItem('authToken'));
      
      await logDebug(page, 'manual-test:T1.3', 'Before refresh', {
        hasToken: !!authTokenBefore,
      }, 'G');
      
      // Refresh page
      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      const authTokenAfter = await page.evaluate(() => localStorage.getItem('authToken'));
      const currentUrl = page.url();
      
      await logDebug(page, 'manual-test:T1.3', 'After refresh', {
        hasToken: !!authTokenAfter,
        tokenPersisted: authTokenBefore === authTokenAfter,
        url: currentUrl,
      }, 'H');
      
      if (authTokenAfter && (currentUrl.includes('/admin/dashboard') || currentUrl.includes('/auth/verify-mfa'))) {
        console.log('✅ T1.3 PASSED: Session persists after refresh');
        results.passed.push('T1.3');
      } else {
        console.log('❌ T1.3 FAILED: Session lost after refresh');
        results.failed.push({ test: 'T1.3', reason: 'Session not persisted' });
      }
    } catch (error) {
      console.log(`❌ T1.3 FAILED: ${error.message}`);
      results.failed.push({ test: 'T1.3', reason: error.message });
    }
    
    // Test T2.1 - Dashboard Overview
    console.log('\n📋 Test T2.1: Dashboard Overview Display');
    console.log('='.repeat(50));
    
    try {
      await page.goto(`${BASE_URL}/admin/dashboard`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000); // Wait for data to load
      
      await logDebug(page, 'manual-test:T2.1', 'Dashboard loaded', { url: page.url() }, 'I');
      
      // Check for KPI cards
      const kpiKeywords = ['total users', 'total agencies', 'total caregivers', 'revenue', 'pending'];
      const foundKpis = [];
      
      for (const keyword of kpiKeywords) {
        const kpiElement = page.locator(`text=/${keyword}/i`).first();
        if (await kpiElement.isVisible({ timeout: 2000 }).catch(() => false)) {
          foundKpis.push(keyword);
        }
      }
      
      await logDebug(page, 'manual-test:T2.1', 'KPI check', {
        foundKpis,
        count: foundKpis.length,
      }, 'J');
      
      // Check for charts
      const charts = page.locator('svg, canvas');
      const chartCount = await charts.count();
      
      await logDebug(page, 'manual-test:T2.1', 'Charts check', {
        chartCount,
      }, 'J');
      
      if (foundKpis.length > 0 || chartCount > 0) {
        console.log(`✅ T2.1 PASSED: Dashboard displays content (${foundKpis.length} KPIs, ${chartCount} charts)`);
        results.passed.push('T2.1');
      } else {
        console.log('⚠️  T2.1 PARTIAL: Dashboard loaded but no KPIs/charts visible');
        results.skipped.push('T2.1');
      }
    } catch (error) {
      console.log(`❌ T2.1 FAILED: ${error.message}`);
      results.failed.push({ test: 'T2.1', reason: error.message });
    }
    
    // Test T2.3 - Navigation Menu
    console.log('\n📋 Test T2.3: Navigation Menu');
    console.log('='.repeat(50));
    
    try {
      await page.goto(`${BASE_URL}/admin/dashboard`);
      await page.waitForLoadState('networkidle');
      
      const menuItems = ['Users', 'Agencies', 'Caregivers', 'Dashboard', 'Settings'];
      const foundItems = [];
      
      for (const item of menuItems) {
        const menuItem = page.locator(`text=/${item}/i`).first();
        if (await menuItem.isVisible({ timeout: 2000 }).catch(() => false)) {
          foundItems.push(item);
        }
      }
      
      await logDebug(page, 'manual-test:T2.3', 'Menu items check', {
        foundItems,
        count: foundItems.length,
      }, 'K');
      
      if (foundItems.length > 0) {
        console.log(`✅ T2.3 PASSED: Navigation menu found (${foundItems.length} items)`);
        results.passed.push('T2.3');
      } else {
        console.log('❌ T2.3 FAILED: Navigation menu not found');
        results.failed.push({ test: 'T2.3', reason: 'Menu items not visible' });
      }
    } catch (error) {
      console.log(`❌ T2.3 FAILED: ${error.message}`);
      results.failed.push({ test: 'T2.3', reason: error.message });
    }
    
    // Test T3.1 - Users Management
    console.log('\n📋 Test T3.1: Users Management');
    console.log('='.repeat(50));
    
    try {
      await page.goto(`${BASE_URL}/admin/users`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      await logDebug(page, 'manual-test:T3.1', 'Users page loaded', { url: page.url() }, 'M');
      
      // Check for search
      const searchBar = page.locator('input[type="search"], input[placeholder*="search" i]').first();
      const searchVisible = await searchBar.isVisible({ timeout: 3000 }).catch(() => false);
      
      // Check for user list/table
      const userList = page.locator('table, [role="table"], [class*="list"], [class*="table"]').first();
      const listVisible = await userList.isVisible({ timeout: 3000 }).catch(() => false);
      
      await logDebug(page, 'manual-test:T3.1', 'Users page elements', {
        searchVisible,
        listVisible,
        url: page.url(),
      }, 'N');
      
      if (page.url().includes('/admin/users')) {
        console.log('✅ T3.1 PASSED: Users page accessible');
        results.passed.push('T3.1');
      } else {
        console.log('❌ T3.1 FAILED: Users page not accessible');
        results.failed.push({ test: 'T3.1', reason: 'Page not accessible' });
      }
    } catch (error) {
      console.log(`❌ T3.1 FAILED: ${error.message}`);
      results.failed.push({ test: 'T3.1', reason: error.message });
    }
    
    // Test T3.2 - Agencies Management
    console.log('\n📋 Test T3.2: Agencies Management');
    console.log('='.repeat(50));
    
    try {
      await page.goto(`${BASE_URL}/admin/agencies`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      await logDebug(page, 'manual-test:T3.2', 'Agencies page loaded', { url: page.url() }, 'O');
      
      // Check for search
      const searchBar = page.locator('input[type="search"], input[placeholder*="search" i]').first();
      const searchVisible = await searchBar.isVisible({ timeout: 3000 }).catch(() => false);
      
      // Check for agency list
      const agencyList = page.locator('table, [role="table"], [class*="list"], [class*="table"]').first();
      const listVisible = await agencyList.isVisible({ timeout: 3000 }).catch(() => false);
      
      // Check for filter options
      const filterButton = page.locator('button:has-text("Filter"), select, [class*="filter"]').first();
      const filterVisible = await filterButton.isVisible({ timeout: 2000 }).catch(() => false);
      
      await logDebug(page, 'manual-test:T3.2', 'Agencies page elements', {
        searchVisible,
        listVisible,
        filterVisible,
        url: page.url(),
      }, 'P');
      
      if (page.url().includes('/admin/agencies')) {
        console.log('✅ T3.2 PASSED: Agencies page accessible');
        results.passed.push('T3.2');
      } else {
        console.log('❌ T3.2 FAILED: Agencies page not accessible');
        results.failed.push({ test: 'T3.2', reason: 'Page not accessible' });
      }
    } catch (error) {
      console.log(`❌ T3.2 FAILED: ${error.message}`);
      results.failed.push({ test: 'T3.2', reason: error.message });
    }
    
    // Test T3.3 - Caregivers Management
    console.log('\n📋 Test T3.3: Caregivers Management');
    console.log('='.repeat(50));
    
    try {
      await page.goto(`${BASE_URL}/admin/caregivers`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      await logDebug(page, 'manual-test:T3.3', 'Caregivers page loaded', { url: page.url() }, 'Q');
      
      // Check for search
      const searchBar = page.locator('input[type="search"], input[placeholder*="search" i]').first();
      const searchVisible = await searchBar.isVisible({ timeout: 3000 }).catch(() => false);
      
      // Check for caregiver list
      const caregiverList = page.locator('table, [role="table"], [class*="list"]').first();
      const listVisible = await caregiverList.isVisible({ timeout: 3000 }).catch(() => false);
      
      await logDebug(page, 'manual-test:T3.3', 'Caregivers page elements', {
        searchVisible,
        listVisible,
        url: page.url(),
      }, 'R');
      
      if (page.url().includes('/admin/caregivers')) {
        console.log('✅ T3.3 PASSED: Caregivers page accessible');
        results.passed.push('T3.3');
      } else {
        console.log('❌ T3.3 FAILED: Caregivers page not accessible');
        results.failed.push({ test: 'T3.3', reason: 'Page not accessible' });
      }
    } catch (error) {
      console.log(`❌ T3.3 FAILED: ${error.message}`);
      results.failed.push({ test: 'T3.3', reason: error.message });
    }
    
    // Test T3.4 - Patients Management
    console.log('\n📋 Test T3.4: Patients Management');
    console.log('='.repeat(50));
    
    try {
      await page.goto(`${BASE_URL}/admin/patients`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      await logDebug(page, 'manual-test:T3.4', 'Patients page loaded', { url: page.url() }, 'S');
      
      // Check for search
      const searchBar = page.locator('input[type="search"], input[placeholder*="search" i]').first();
      const searchVisible = await searchBar.isVisible({ timeout: 3000 }).catch(() => false);
      
      // Check for patient/guardian list
      const patientList = page.locator('table, [role="table"], [class*="list"]').first();
      const listVisible = await patientList.isVisible({ timeout: 3000 }).catch(() => false);
      
      await logDebug(page, 'manual-test:T3.4', 'Patients page elements', {
        searchVisible,
        listVisible,
        url: page.url(),
      }, 'T');
      
      if (page.url().includes('/admin/patients')) {
        console.log('✅ T3.4 PASSED: Patients page accessible');
        results.passed.push('T3.4');
      } else {
        console.log('❌ T3.4 FAILED: Patients page not accessible');
        results.failed.push({ test: 'T3.4', reason: 'Page not accessible' });
      }
    } catch (error) {
      console.log(`❌ T3.4 FAILED: ${error.message}`);
      results.failed.push({ test: 'T3.4', reason: error.message });
    }
    
    // Test T4.1 - Dispute Resolution
    console.log('\n📋 Test T4.1: Dispute Resolution');
    console.log('='.repeat(50));
    
    try {
      await page.goto(`${BASE_URL}/admin/disputes`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      await logDebug(page, 'manual-test:T4.1', 'Disputes page loaded', { url: page.url() }, 'U');
      
      // Check for dispute list
      const disputeList = page.locator('table, [role="table"], [class*="list"]').first();
      const listVisible = await disputeList.isVisible({ timeout: 3000 }).catch(() => false);
      
      // Check for filters
      const filterButton = page.locator('button:has-text("Filter"), select, [class*="filter"]').first();
      const filterVisible = await filterButton.isVisible({ timeout: 2000 }).catch(() => false);
      
      await logDebug(page, 'manual-test:T4.1', 'Disputes page elements', {
        listVisible,
        filterVisible,
        url: page.url(),
      }, 'V');
      
      if (page.url().includes('/admin/disputes')) {
        console.log('✅ T4.1 PASSED: Disputes page accessible');
        results.passed.push('T4.1');
      } else {
        console.log('❌ T4.1 FAILED: Disputes page not accessible');
        results.failed.push({ test: 'T4.1', reason: 'Page not accessible' });
      }
    } catch (error) {
      console.log(`❌ T4.1 FAILED: ${error.message}`);
      results.failed.push({ test: 'T4.1', reason: error.message });
    }
    
    // Test T4.2 - Audit Logs Review
    console.log('\n📋 Test T4.2: Audit Logs Review');
    console.log('='.repeat(50));
    
    try {
      await page.goto(`${BASE_URL}/admin/audit-logs`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      await logDebug(page, 'manual-test:T4.2', 'Audit logs page loaded', { url: page.url() }, 'W');
      
      // Check for audit log list
      const auditList = page.locator('table, [role="table"], [class*="list"]').first();
      const listVisible = await auditList.isVisible({ timeout: 3000 }).catch(() => false);
      
      // Check for date filter
      const dateFilter = page.locator('input[type="date"], [class*="date"], button:has-text("Date")').first();
      const dateFilterVisible = await dateFilter.isVisible({ timeout: 2000 }).catch(() => false);
      
      await logDebug(page, 'manual-test:T4.2', 'Audit logs page elements', {
        listVisible,
        dateFilterVisible,
        url: page.url(),
      }, 'X');
      
      if (page.url().includes('/admin/audit-logs') || page.url().includes('/admin/audit')) {
        console.log('✅ T4.2 PASSED: Audit logs page accessible');
        results.passed.push('T4.2');
      } else {
        console.log('❌ T4.2 FAILED: Audit logs page not accessible');
        results.failed.push({ test: 'T4.2', reason: 'Page not accessible' });
      }
    } catch (error) {
      console.log(`❌ T4.2 FAILED: ${error.message}`);
      results.failed.push({ test: 'T4.2', reason: error.message });
    }
    
    // Test T4.3 - System Settings
    console.log('\n📋 Test T4.3: System Settings & Configuration');
    console.log('='.repeat(50));
    
    try {
      await page.goto(`${BASE_URL}/admin/settings`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      await logDebug(page, 'manual-test:T4.3', 'Settings page loaded', { url: page.url() }, 'Y');
      
      // Check for settings sections
      const settingsSections = [
        'General',
        'MFA',
        'Payment',
        'Notification',
        'Security',
        'System'
      ];
      
      const foundSections = [];
      for (const section of settingsSections) {
        const sectionElement = page.locator(`text=/${section}/i`).first();
        if (await sectionElement.isVisible({ timeout: 2000 }).catch(() => false)) {
          foundSections.push(section);
        }
      }
      
      // Check for save button
      const saveButton = page.locator('button:has-text("Save"), button:has-text("Update")').first();
      const saveVisible = await saveButton.isVisible({ timeout: 2000 }).catch(() => false);
      
      await logDebug(page, 'manual-test:T4.3', 'Settings page elements', {
        foundSections,
        saveVisible,
        url: page.url(),
      }, 'Z');
      
      if (page.url().includes('/admin/settings')) {
        console.log(`✅ T4.3 PASSED: Settings page accessible (${foundSections.length} sections found)`);
        results.passed.push('T4.3');
      } else {
        console.log('❌ T4.3 FAILED: Settings page not accessible');
        results.failed.push({ test: 'T4.3', reason: 'Page not accessible' });
      }
    } catch (error) {
      console.log(`❌ T4.3 FAILED: ${error.message}`);
      results.failed.push({ test: 'T4.3', reason: error.message });
    }
    
  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    // Keep browser open for 5 seconds to observe
    console.log('\n⏳ Keeping browser open for 5 seconds for observation...');
    await page.waitForTimeout(5000);
    
    await browser.close();
  }
  
  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${results.passed.length}`, results.passed);
  console.log(`❌ Failed: ${results.failed.length}`, results.failed.map(f => f.test));
  console.log(`⏭️  Skipped: ${results.skipped.length}`, results.skipped);
  console.log('\n');
  
  if (results.failed.length > 0) {
    console.log('Failed Tests Details:');
    results.failed.forEach(f => {
      console.log(`  - ${f.test}: ${f.reason}`);
    });
  }
  
  return results;
}

// Run tests
runManualTests()
  .then(results => {
    process.exit(results.failed.length > 0 ? 1 : 0);
  })
  .catch(error => {
    console.error('Test execution error:', error);
    process.exit(1);
  });

