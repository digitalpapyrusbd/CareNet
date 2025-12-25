import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Moderator Portal - Manual Testing Guide
 * Based on tests/TESTER_MANUAL_MODERATOR.md
 * 
 * Test Credentials:
 * - Phone: +8801712345201
 * - Password: Moderator@123
 * - Role: MODERATOR
 */

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
const MODERATOR_PHONE = '+8801712345201';
const MODERATOR_PASSWORD = 'Moderator@123';

// Helper function to log debug information (mirrors superadmin spec)
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

    await page.evaluate((logData: any) => {
      fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData),
      }).catch(() => {});
    }, logData);
  } catch {}
}

test.describe('Moderator Portal - Manual Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(baseURL);
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  // Phase 1: Authentication & Access
  test('M1.1 - Moderator Login', async ({ page }) => {
    await logDebug(page, 'moderator-manual.spec.ts:M1.1', 'Starting login test', {}, 'A');

    await page.goto(`${baseURL}/admin/login`);
    await page.waitForLoadState('networkidle');

    const phoneInput = page.locator('input[id="phone"], input[name="phone"], input[type="tel"]').first();
    const passwordInput = page.locator('input[id="password"], input[name="password"], input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"], button:has-text("Login")').first();

    await expect(phoneInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();

    await phoneInput.fill(MODERATOR_PHONE);
    await passwordInput.fill(MODERATOR_PASSWORD);
    await submitButton.click();

    // MFA may be required for moderator
    await page.waitForURL('**/auth/verify-mfa', { timeout: 5000 }).catch(async () => {
      await page.waitForURL('**/admin/dashboard', { timeout: 10000 });
    });

    const currentUrl = page.url();
    await logDebug(page, 'moderator-manual.spec.ts:M1.1', 'Post-login URL', { currentUrl }, 'A');

    expect(currentUrl).toMatch(/\/admin\/(dashboard|verify-mfa)/);
  });

  test('M1.2 - Dashboard Access After Login', async ({ page }) => {
    await page.goto(`${baseURL}/admin/login`);
    await page.waitForLoadState('networkidle');

    const phoneInput = page.locator('input[id="phone"], input[name="phone"]').first();
    const passwordInput = page.locator('input[id="password"], input[name="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    if (await phoneInput.isVisible().catch(() => false)) {
      await phoneInput.fill(MODERATOR_PHONE);
      await passwordInput.fill(MODERATOR_PASSWORD);
      await submitButton.click();
      await page.waitForURL('**/admin/dashboard', { timeout: 15000 }).catch(async () => {
        if (page.url().includes('/auth/verify-mfa')) test.skip();
      });
    }

    // Verify moderator-specific dashboard indicators
    const heading = page.locator('h1, h2').filter({ hasText: /moderator|dashboard/i }).first();
    const navMenu = page.locator('nav, [role="navigation"]').first();
    await expect(navMenu).toBeVisible();
    await expect(heading).toBeVisible();

    // Ensure restricted items are not present
    const settingsLink = page.locator('text=/settings/i');
    await expect(settingsLink).toHaveCount(0);
  });

  test('M1.3 - Role-Based Access Restrictions', async ({ page }) => {
    // Login
    await page.goto(`${baseURL}/admin/login`);
    const phoneInput = page.locator('input[id="phone"]').first();
    const passwordInput = page.locator('input[id="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    await phoneInput.fill(MODERATOR_PHONE);
    await passwordInput.fill(MODERATOR_PASSWORD);
    await submitButton.click();
    await page.waitForURL('**/admin/dashboard', { timeout: 15000 }).catch(async () => {
      if (page.url().includes('/auth/verify-mfa')) test.skip();
    });

    // Try to access restricted settings page
    await page.goto(`${baseURL}/admin/settings`);
    await page.waitForLoadState('networkidle');

    const forbiddenText = page.locator('text=/forbidden|insufficient permissions|permission denied/i').first();
    const errorCode = page.locator('text=/403|401/i').first();

    const isForbidden = await forbiddenText.isVisible().catch(() => false);
    const hasErrorCode = await errorCode.isVisible().catch(() => false);

    expect(isForbidden || hasErrorCode || page.url().includes('/admin/dashboard')).toBeTruthy();
  });

  // Phase 2: Dashboard Features
  test('M2.1 - Dashboard Overview Display', async ({ page }) => {
    // Login and go to dashboard
    await page.goto(`${baseURL}/admin/login`);
    const phoneInput = page.locator('input[id="phone"]').first();
    const passwordInput = page.locator('input[id="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    await phoneInput.fill(MODERATOR_PHONE);
    await passwordInput.fill(MODERATOR_PASSWORD);
    await submitButton.click();
    await page.waitForURL('**/admin/dashboard', { timeout: 15000 }).catch(async () => {
      if (page.url().includes('/auth/verify-mfa')) test.skip();
    });

    await page.waitForLoadState('networkidle');

    // KPI cards specific to moderation context
    const kpis = [
      /pending agencies/i,
      /pending caregivers/i,
      /background checks/i,
      /open disputes/i,
      /this month/i,
      /moderation actions/i,
    ];
    for (const kpi of kpis) {
      const kpiLocator = page.locator('text=', { hasText: kpi }).first();
      // Fallback: general KPI cards
      const genericKpi = page.locator('text=/pending|disputes|verifications/i').first();
      const visible = (await kpiLocator.isVisible().catch(() => false)) || (await genericKpi.isVisible().catch(() => false));
      expect(visible).toBeTruthy();
    }
  });

  test('M2.3 - Navigation Menu', async ({ page }) => {
    await page.goto(`${baseURL}/admin/login`);
    const phoneInput = page.locator('input[id="phone"]').first();
    const passwordInput = page.locator('input[id="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    await phoneInput.fill(MODERATOR_PHONE);
    await passwordInput.fill(MODERATOR_PASSWORD);
    await submitButton.click();
    await page.waitForURL('**/admin/dashboard', { timeout: 15000 }).catch(async () => {
      if (page.url().includes('/auth/verify-mfa')) test.skip();
    });

    const expectedMenuItems = [
      'Dashboard',
      'Verification',
      'Agencies',
      'Caregivers',
      'Disputes',
      /CV Pool|Resources/i,
    ];

    for (const item of expectedMenuItems) {
      const locator = typeof item === 'string' ? page.locator(`text=/${item}/i`).first() : page.locator('text=', { hasText: item }).first();
      const visible = await locator.isVisible({ timeout: 1000 }).catch(() => false);
      expect(visible).toBeTruthy();
    }

    // Ensure admin-only items not present
    const adminOnly = ['Settings', 'Billing', 'Analytics'];
    for (const item of adminOnly) {
      const locator = page.locator(`text=/${item}/i`).first();
      await expect(locator).toHaveCount(0);
    }
  });

  // Phase 3: Verification Queue
  test('M3.1 - Verification Queue Overview', async ({ page }) => {
    // Login
    await page.goto(`${baseURL}/admin/login`);
    const phoneInput = page.locator('input[id="phone"]').first();
    const passwordInput = page.locator('input[id="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    await phoneInput.fill(MODERATOR_PHONE);
    await passwordInput.fill(MODERATOR_PASSWORD);
    await submitButton.click();
    await page.waitForURL('**/admin/dashboard', { timeout: 15000 }).catch(async () => {
      if (page.url().includes('/auth/verify-mfa')) test.skip();
    });

    // Navigate to verification queue
    await page.goto(`${baseURL}/admin/verification`);
    await page.waitForLoadState('networkidle');

    const title = page.locator('h1, h2').filter({ hasText: /verification queue|verification/i }).first();
    await expect(title).toBeVisible();

    // Tabs present
    const tabs = ['Agencies', 'Caregivers', 'Background Checks'];
    for (const tab of tabs) {
      const tabLocator = page.locator(`text=/${tab}/i`).first();
      const visible = await tabLocator.isVisible().catch(() => false);
      expect(visible).toBeTruthy();
    }
  });

  test('M3.2 - Agency Verification Workflow', async ({ page }) => {
    // Login and go to verification queue
    await page.goto(`${baseURL}/admin/login`);
    const phoneInput = page.locator('input[id="phone"]').first();
    const passwordInput = page.locator('input[id="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    await phoneInput.fill(MODERATOR_PHONE);
    await passwordInput.fill(MODERATOR_PASSWORD);
    await submitButton.click();
    await page.waitForURL('**/admin/dashboard', { timeout: 15000 }).catch(async () => {
      if (page.url().includes('/auth/verify-mfa')) test.skip();
    });

    await page.goto(`${baseURL}/admin/verification`);
    await page.waitForLoadState('networkidle');

    // Click Agencies tab
    const agenciesTab = page.locator('text=/agencies/i').first();
    if (await agenciesTab.isVisible().catch(() => false)) {
      await agenciesTab.click();
    }

    // Pick first pending agency and open review
    const pendingRow = page.locator('tr:has-text("Pending"), [data-status="pending"]').first();
    const reviewBtn = pendingRow.locator('text=/review|view/i').first();

    if (await reviewBtn.isVisible().catch(() => false)) {
      await reviewBtn.click();
      await page.waitForLoadState('networkidle');

      // Verify details sections visible
      const sections = [/agency info/i, /documents/i, /verification checklist/i];
      for (const s of sections) {
        const loc = page.locator('text=', { hasText: s }).first();
        await expect(loc).toBeVisible();
      }

      // Approve flow (if buttons exist)
      const approveBtn = page.locator('button:has-text("Approve"), button:has-text("Verify")').first();
      if (await approveBtn.isVisible().catch(() => false)) {
        await approveBtn.click();
        const confirmBtn = page.locator('button:has-text(/verify|confirm/i)').first();
        if (await confirmBtn.isVisible().catch(() => false)) {
          await confirmBtn.click();
          await page.waitForTimeout(500);
          // Expect success notification or status change
          const success = page.locator('text=/verified|success/i').first();
          expect(await success.isVisible().catch(() => false)).toBeTruthy();
        }
      }
    } else {
      test.skip();
    }
  });

  test('M3.3 - Caregiver Verification Workflow', async ({ page }) => {
    // Login
    await page.goto(`${baseURL}/admin/login`);
    const phoneInput = page.locator('input[id="phone"]').first();
    const passwordInput = page.locator('input[id="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    await phoneInput.fill(MODERATOR_PHONE);
    await passwordInput.fill(MODERATOR_PASSWORD);
    await submitButton.click();
    await page.waitForURL('**/admin/dashboard', { timeout: 15000 }).catch(async () => {
      if (page.url().includes('/auth/verify-mfa')) test.skip();
    });

    await page.goto(`${baseURL}/admin/verification`);
    await page.waitForLoadState('networkidle');

    const caregiversTab = page.locator('text=/caregivers/i').first();
    if (await caregiversTab.isVisible().catch(() => false)) {
      await caregiversTab.click();
    }

    const pendingRow = page.locator('tr:has-text("Pending"), [data-status="pending"]').first();
    const reviewBtn = pendingRow.locator('text=/review|view/i').first();

    if (await reviewBtn.isVisible().catch(() => false)) {
      await reviewBtn.click();
      await page.waitForLoadState('networkidle');

      // Verify details sections
      const sections = [/caregiver info/i, /certifications|documents/i, /verification checklist/i];
      for (const s of sections) {
        const loc = page.locator('text=', { hasText: s }).first();
        expect(await loc.isVisible().catch(() => false)).toBeTruthy();
      }

      // Approve or Reject if available
      const approveBtn = page.locator('button:has-text("Approve"), button:has-text("Verify")').first();
      const rejectBtn = page.locator('button:has-text("Reject")').first();

      if (await approveBtn.isVisible().catch(() => false)) {
        await approveBtn.click();
        const confirmBtn = page.locator('button:has-text(/verify|confirm/i)').first();
        if (await confirmBtn.isVisible().catch(() => false)) {
          await confirmBtn.click();
          await page.waitForTimeout(500);
        }
      } else if (await rejectBtn.isVisible().catch(() => false)) {
        await rejectBtn.click();
        const reason = page.locator('select, [role="combobox"]').first();
        if (await reason.isVisible().catch(() => false)) {
          await reason.selectOption({ label: 'Invalid documents' }).catch(() => {});
        }
        const confirmReject = page.locator('button:has-text(/confirm/i)').first();
        if (await confirmReject.isVisible().catch(() => false)) {
          await confirmReject.click();
        }
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });

  // Phase 4: Disputes
  test('M4.1 - Disputes Review Access', async ({ page }) => {
    await page.goto(`${baseURL}/admin/login`);
    const phoneInput = page.locator('input[id="phone"]').first();
    const passwordInput = page.locator('input[id="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    await phoneInput.fill(MODERATOR_PHONE);
    await passwordInput.fill(MODERATOR_PASSWORD);
    await submitButton.click();
    await page.waitForURL('**/admin/dashboard', { timeout: 15000 }).catch(async () => {
      if (page.url().includes('/auth/verify-mfa')) test.skip();
    });

    await page.goto(`${baseURL}/admin/disputes`);
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1, h2').filter({ hasText: /disputes/i }).first();
    await expect(heading).toBeVisible();

    // Ensure actions are recommend-only (if UI indicates)
    const executeAction = page.locator('text=/refund|execute|finalize/i').first();
    const visible = await executeAction.isVisible().catch(() => false);
    expect(visible).toBeFalsy();
  });
});
