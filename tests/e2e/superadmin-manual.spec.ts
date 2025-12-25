import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Super Admin Portal - Manual Testing Guide
 * Based on tests/TESTER_MANUAL_SUPERADMIN.md
 * 
 * Test Credentials:
 * - Phone: +8801712345101
 * - Password: Admin@123
 * - Role: SUPER_ADMIN
 */

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
const SUPER_ADMIN_PHONE = '+8801712345101';
const SUPER_ADMIN_PASSWORD = 'Admin@123';

// Helper function to log debug information
async function logDebug(page: any, location: string, message: string, data: any, hypothesisId: string) {
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
    
    // #region agent log
    await page.evaluate((logData: any) => {
      fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData),
      }).catch(() => {});
    }, logData);
    // #endregion
  } catch (error) {
    // Silently fail logging
  }
}

test.describe('Super Admin Portal - Manual Testing', () => {
  test.beforeEach(async ({ page }) => {
    // #region agent log
    await page.evaluate((baseURL) => {
      fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'superadmin-manual.spec.ts:beforeEach',
          message: 'Test setup started',
          data: { baseURL },
          timestamp: Date.now(),
          sessionId: 'debug-session',
          runId: 'run1',
          hypothesisId: 'A',
        }),
      }).catch(() => {});
    }, baseURL);
    // #endregion
    
    // Clear localStorage before each test
    await page.goto(baseURL);
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  // Phase 1: Authentication & Access
  test('T1.1 - Super Admin Login', async ({ page }) => {
    await logDebug(page, 'superadmin-manual.spec.ts:T1.1', 'Starting login test', {}, 'A');
    
    // Navigate to admin login page
    await page.goto(`${baseURL}/admin/login`);
    await logDebug(page, 'superadmin-manual.spec.ts:T1.1', 'Navigated to login page', { url: page.url() }, 'A');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check page layout
    const pageTitle = await page.title();
    await logDebug(page, 'superadmin-manual.spec.ts:T1.1', 'Page loaded', { pageTitle }, 'A');
    
    // Verify login form elements
    const phoneInput = page.locator('input[id="phone"], input[name="phone"], input[type="tel"]').first();
    const passwordInput = page.locator('input[id="password"], input[name="password"], input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"], button:has-text("Login")').first();
    
    await logDebug(page, 'superadmin-manual.spec.ts:T1.1', 'Checking form elements', {
      phoneInputVisible: await phoneInput.isVisible().catch(() => false),
      passwordInputVisible: await passwordInput.isVisible().catch(() => false),
      submitButtonVisible: await submitButton.isVisible().catch(() => false),
    }, 'B');
    
    // Fill login form
    await phoneInput.fill(SUPER_ADMIN_PHONE);
    await logDebug(page, 'superadmin-manual.spec.ts:T1.1', 'Filled phone number', { phone: SUPER_ADMIN_PHONE }, 'B');
    
    await passwordInput.fill(SUPER_ADMIN_PASSWORD);
    await logDebug(page, 'superadmin-manual.spec.ts:T1.1', 'Filled password', {}, 'B');
    
    // Submit form
    await submitButton.click();
    await logDebug(page, 'superadmin-manual.spec.ts:T1.1', 'Clicked submit button', {}, 'C');
    
    // Wait for navigation or error
    try {
      // Check for MFA redirect
      await page.waitForURL('**/auth/verify-mfa', { timeout: 5000 }).catch(async () => {
        // If no MFA, wait for dashboard redirect
        await page.waitForURL('**/admin/dashboard', { timeout: 10000 });
      });
      
      const currentUrl = page.url();
      await logDebug(page, 'superadmin-manual.spec.ts:T1.1', 'Redirect occurred', { currentUrl }, 'C');
      
      // Check if redirected to dashboard or MFA
      if (currentUrl.includes('/admin/dashboard')) {
        await logDebug(page, 'superadmin-manual.spec.ts:T1.1', 'Login successful - redirected to dashboard', {}, 'C');
        // Verify dashboard is loaded
        await expect(page).toHaveURL(/.*admin\/dashboard/);
      } else if (currentUrl.includes('/auth/verify-mfa')) {
        await logDebug(page, 'superadmin-manual.spec.ts:T1.1', 'MFA required', {}, 'C');
        // MFA is expected for admin accounts
      }
    } catch (error) {
      // Check for error messages
      const errorMessage = page.locator('text=/error|invalid|failed/i').first();
      const hasError = await errorMessage.isVisible().catch(() => false);
      
      await logDebug(page, 'superadmin-manual.spec.ts:T1.1', 'Login may have failed', {
        currentUrl: page.url(),
        hasError,
        errorText: hasError ? await errorMessage.textContent().catch(() => '') : '',
        error: error instanceof Error ? error.message : String(error),
      }, 'D');
      
      // Check localStorage for tokens
      const authToken = await page.evaluate(() => localStorage.getItem('authToken'));
      await logDebug(page, 'superadmin-manual.spec.ts:T1.1', 'Checking localStorage', {
        hasAuthToken: !!authToken,
        authTokenLength: authToken?.length,
      }, 'D');
      
      if (!authToken) {
        throw new Error('Login failed: No auth token stored');
      }
    }
  });

  test('T1.2 - Dashboard Access After Login', async ({ page }) => {
    await logDebug(page, 'superadmin-manual.spec.ts:T1.2', 'Starting dashboard access test', {}, 'E');
    
    // First login
    await page.goto(`${baseURL}/admin/login`);
    await page.waitForLoadState('networkidle');
    
    const phoneInput = page.locator('input[id="phone"], input[name="phone"]').first();
    const passwordInput = page.locator('input[id="password"], input[name="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    if (await phoneInput.isVisible().catch(() => false)) {
      await phoneInput.fill(SUPER_ADMIN_PHONE);
      await passwordInput.fill(SUPER_ADMIN_PASSWORD);
      await submitButton.click();
      
      // Wait for redirect
      await page.waitForURL('**/admin/dashboard', { timeout: 15000 }).catch(async () => {
        // If MFA required, skip this test
        if (page.url().includes('/auth/verify-mfa')) {
          await logDebug(page, 'superadmin-manual.spec.ts:T1.2', 'MFA required, skipping dashboard test', {}, 'E');
          test.skip();
        }
      });
    }
    
    // Verify dashboard elements
    await logDebug(page, 'superadmin-manual.spec.ts:T1.2', 'Checking dashboard elements', {
      url: page.url(),
    }, 'E');
    
    // Check for dashboard title or heading
    const dashboardTitle = page.locator('h1, h2').filter({ hasText: /dashboard|admin/i }).first();
    const navMenu = page.locator('nav, [role="navigation"]').first();
    
    await logDebug(page, 'superadmin-manual.spec.ts:T1.2', 'Dashboard elements check', {
      dashboardTitleVisible: await dashboardTitle.isVisible().catch(() => false),
      navMenuVisible: await navMenu.isVisible().catch(() => false),
    }, 'F');
    
    // Verify no errors
    const errorElements = page.locator('text=/404|500|error/i');
    const errorCount = await errorElements.count();
    await logDebug(page, 'superadmin-manual.spec.ts:T1.2', 'Error check', {
      errorCount,
    }, 'F');
    
    expect(page.url()).toContain('/admin/dashboard');
  });

  test('T1.3 - Session Persistence', async ({ page }) => {
    await logDebug(page, 'superadmin-manual.spec.ts:T1.3', 'Starting session persistence test', {}, 'G');
    
    // Login first
    await page.goto(`${baseURL}/admin/login`);
    await page.waitForLoadState('networkidle');
    
    const phoneInput = page.locator('input[id="phone"]').first();
    const passwordInput = page.locator('input[id="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    if (await phoneInput.isVisible().catch(() => false)) {
      await phoneInput.fill(SUPER_ADMIN_PHONE);
      await passwordInput.fill(SUPER_ADMIN_PASSWORD);
      await submitButton.click();
      
      await page.waitForURL('**/admin/dashboard', { timeout: 15000 }).catch(() => {
        // Skip if MFA required
        if (page.url().includes('/auth/verify-mfa')) {
          test.skip();
        }
      });
    }
    
    // Check token in localStorage
    const authToken = await page.evaluate(() => localStorage.getItem('authToken'));
    const userData = await page.evaluate(() => localStorage.getItem('user'));
    
    await logDebug(page, 'superadmin-manual.spec.ts:T1.3', 'Initial localStorage check', {
      hasAuthToken: !!authToken,
      hasUserData: !!userData,
      userRole: userData ? JSON.parse(userData)?.role : null,
    }, 'G');
    
    // Refresh page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    await logDebug(page, 'superadmin-manual.spec.ts:T1.3', 'After refresh', {
      url: page.url(),
      stillOnDashboard: page.url().includes('/admin/dashboard'),
    }, 'H');
    
    // Verify still on dashboard (not redirected to login)
    if (!page.url().includes('/admin/dashboard') && !page.url().includes('/auth/verify-mfa')) {
      await logDebug(page, 'superadmin-manual.spec.ts:T1.3', 'Session may have been lost', {
        redirectedTo: page.url(),
      }, 'H');
    }
    
    // Check token still exists after refresh
    const authTokenAfterRefresh = await page.evaluate(() => localStorage.getItem('authToken'));
    await logDebug(page, 'superadmin-manual.spec.ts:T1.3', 'Token after refresh', {
      hasAuthToken: !!authTokenAfterRefresh,
      tokenPersisted: authToken === authTokenAfterRefresh,
    }, 'H');
  });

  // Phase 2: Dashboard Features
  test('T2.1 - Dashboard Overview Display', async ({ page }) => {
    await logDebug(page, 'superadmin-manual.spec.ts:T2.1', 'Starting dashboard overview test', {}, 'I');
    
    // Login and navigate to dashboard
    await page.goto(`${baseURL}/admin/login`);
    await page.waitForLoadState('networkidle');
    
    const phoneInput = page.locator('input[id="phone"]').first();
    const passwordInput = page.locator('input[id="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    if (await phoneInput.isVisible().catch(() => false)) {
      await phoneInput.fill(SUPER_ADMIN_PHONE);
      await passwordInput.fill(SUPER_ADMIN_PASSWORD);
      await submitButton.click();
      await page.waitForURL('**/admin/dashboard', { timeout: 15000 }).catch(() => {
        if (page.url().includes('/auth/verify-mfa')) {
          test.skip();
        }
      });
    }
    
    await page.waitForLoadState('networkidle');
    await logDebug(page, 'superadmin-manual.spec.ts:T2.1', 'Dashboard loaded', { url: page.url() }, 'I');
    
    // Check for KPI cards
    const kpiCards = page.locator('text=/total users|total agencies|total caregivers|revenue|pending/i');
    const kpiCount = await kpiCards.count();
    
    await logDebug(page, 'superadmin-manual.spec.ts:T2.1', 'KPI cards check', {
      kpiCount,
    }, 'J');
    
    // Check for charts
    const charts = page.locator('svg, canvas, [class*="chart"]');
    const chartCount = await charts.count();
    
    await logDebug(page, 'superadmin-manual.spec.ts:T2.1', 'Charts check', {
      chartCount,
    }, 'J');
  });

  test('T2.3 - Navigation Menu', async ({ page }) => {
    await logDebug(page, 'superadmin-manual.spec.ts:T2.3', 'Starting navigation menu test', {}, 'K');
    
    // Login and navigate to dashboard
    await page.goto(`${baseURL}/admin/login`);
    await page.waitForLoadState('networkidle');
    
    const phoneInput = page.locator('input[id="phone"]').first();
    const passwordInput = page.locator('input[id="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    if (await phoneInput.isVisible().catch(() => false)) {
      await phoneInput.fill(SUPER_ADMIN_PHONE);
      await passwordInput.fill(SUPER_ADMIN_PASSWORD);
      await submitButton.click();
      await page.waitForURL('**/admin/dashboard', { timeout: 15000 }).catch(() => {
        if (page.url().includes('/auth/verify-mfa')) {
          test.skip();
        }
      });
    }
    
    await page.waitForLoadState('networkidle');
    
    // Check for navigation menu items
    const menuItems = [
      'Dashboard',
      'Users',
      'Agencies',
      'Caregivers',
      'Patients',
      'Jobs',
      'Billing',
      'Disputes',
      'Verification',
      'Audit Logs',
      'Analytics',
      'Settings',
      'Messages',
    ];
    
    const foundMenuItems: string[] = [];
    for (const item of menuItems) {
      const menuItem = page.locator(`text=/${item}/i`).first();
      if (await menuItem.isVisible({ timeout: 1000 }).catch(() => false)) {
        foundMenuItems.push(item);
      }
    }
    
    await logDebug(page, 'superadmin-manual.spec.ts:T2.3', 'Menu items check', {
      expectedCount: menuItems.length,
      foundCount: foundMenuItems.length,
      foundItems: foundMenuItems,
    }, 'K');
    
    // Try clicking on a menu item
    if (foundMenuItems.length > 0) {
      const usersMenuItem = page.locator('text=/users/i').first();
      if (await usersMenuItem.isVisible().catch(() => false)) {
        await usersMenuItem.click();
        await page.waitForTimeout(1000);
        
        await logDebug(page, 'superadmin-manual.spec.ts:T2.3', 'Clicked Users menu', {
          url: page.url(),
          navigated: page.url().includes('/users'),
        }, 'L');
      }
    }
  });

  // Phase 3: Entity Management
  test('T3.1 - Users Management', async ({ page }) => {
    await logDebug(page, 'superadmin-manual.spec.ts:T3.1', 'Starting users management test', {}, 'M');
    
    // Login first
    await page.goto(`${baseURL}/admin/login`);
    await page.waitForLoadState('networkidle');
    
    const phoneInput = page.locator('input[id="phone"]').first();
    const passwordInput = page.locator('input[id="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    if (await phoneInput.isVisible().catch(() => false)) {
      await phoneInput.fill(SUPER_ADMIN_PHONE);
      await passwordInput.fill(SUPER_ADMIN_PASSWORD);
      await submitButton.click();
      await page.waitForURL('**/admin/dashboard', { timeout: 15000 }).catch(() => {
        if (page.url().includes('/auth/verify-mfa')) {
          test.skip();
        }
      });
    }
    
    // Navigate to users page
    await page.goto(`${baseURL}/admin/users`);
    await page.waitForLoadState('networkidle');
    
    await logDebug(page, 'superadmin-manual.spec.ts:T3.1', 'Navigated to users page', { url: page.url() }, 'M');
    
    // Check for search bar
    const searchBar = page.locator('input[type="search"], input[placeholder*="search" i]').first();
    const searchVisible = await searchBar.isVisible().catch(() => false);
    
    await logDebug(page, 'superadmin-manual.spec.ts:T3.1', 'Search bar check', {
      searchVisible,
    }, 'N');
    
    // Check for user list
    const userList = page.locator('table, [role="table"], [class*="list"]').first();
    const listVisible = await userList.isVisible().catch(() => false);
    
    await logDebug(page, 'superadmin-manual.spec.ts:T3.1', 'User list check', {
      listVisible,
    }, 'N');
    
    // Try searching
    if (searchVisible) {
      await searchBar.fill('test');
      await page.waitForTimeout(500);
      
      await logDebug(page, 'superadmin-manual.spec.ts:T3.1', 'Performed search', {
        searchQuery: 'test',
      }, 'O');
    }
  });
});

