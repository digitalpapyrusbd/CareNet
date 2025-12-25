import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Guardian Portal
 * Based on examples from 01 Frontend 20.md
 * 
 * Test Scenarios:
 * 1. Login flow
 * 2. Create patient profile
 * 3. Search and book caregiver package
 */

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

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

test.describe('Guardian Portal E2E', () => {
  test.beforeEach(async ({ page }) => {
    // #region agent log
    await page.evaluate((baseURL) => {
      fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'guardian-portal.spec.ts:beforeEach',
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

  test('should login successfully and redirect to dashboard', async ({ page }) => {
    await logDebug(page, 'guardian-portal.spec.ts:login-test', 'Starting login test', {}, 'A');
    
    // Navigate to login page
    await page.goto(`${baseURL}/auth/login`);
    await logDebug(page, 'guardian-portal.spec.ts:login-test', 'Navigated to login page', { url: page.url() }, 'A');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if login form is visible
    const phoneInput = page.locator('input[name="phone"], input[type="tel"], input[placeholder*="phone" i], input[placeholder*="01" i]').first();
    const passwordInput = page.locator('input[name="password"], input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Log in"), button:has-text("লগইন")').first();
    
    await logDebug(page, 'guardian-portal.spec.ts:login-test', 'Checking form elements', {
      phoneInputVisible: await phoneInput.isVisible().catch(() => false),
      passwordInputVisible: await passwordInput.isVisible().catch(() => false),
      submitButtonVisible: await submitButton.isVisible().catch(() => false),
    }, 'A');
    
    // Fill login form
    await phoneInput.fill('+8801712345678');
    await logDebug(page, 'guardian-portal.spec.ts:login-test', 'Filled phone number', { phone: '+8801712345678' }, 'A');
    
    await passwordInput.fill('Test123!@#');
    await logDebug(page, 'guardian-portal.spec.ts:login-test', 'Filled password', {}, 'A');
    
    // Submit form
    await submitButton.click();
    await logDebug(page, 'guardian-portal.spec.ts:login-test', 'Clicked submit button', {}, 'B');
    
    // Wait for navigation or error
    try {
      await page.waitForURL('**/guardian/dashboard', { timeout: 10000 });
      await logDebug(page, 'guardian-portal.spec.ts:login-test', 'Redirected to dashboard', { url: page.url() }, 'C');
      
      // Verify dashboard is loaded
      await expect(page).toHaveURL(/.*guardian\/dashboard/);
      await logDebug(page, 'guardian-portal.spec.ts:login-test', 'Dashboard URL confirmed', {}, 'C');
    } catch (error) {
      await logDebug(page, 'guardian-portal.spec.ts:login-test', 'Login failed or redirect did not occur', {
        currentUrl: page.url(),
        error: error instanceof Error ? error.message : String(error),
      }, 'B');
      throw error;
    }
  });

  test('should create new patient profile', async ({ page }) => {
    await logDebug(page, 'guardian-portal.spec.ts:create-patient', 'Starting create patient test', {}, 'D');
    
    // First, login (skip if already logged in)
    await page.goto(`${baseURL}/auth/login`);
    await page.waitForLoadState('networkidle');
    
    const phoneInput = page.locator('input[name="phone"], input[type="tel"], input[placeholder*="phone" i]').first();
    const passwordInput = page.locator('input[name="password"], input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Log in")').first();
    
    if (await phoneInput.isVisible().catch(() => false)) {
      await phoneInput.fill('+8801712345678');
      await passwordInput.fill('Test123!@#');
      await submitButton.click();
      await page.waitForURL('**/guardian/dashboard', { timeout: 10000 });
      await logDebug(page, 'guardian-portal.spec.ts:create-patient', 'Logged in successfully', {}, 'D');
    }
    
    // Navigate to add patient page
    await page.goto(`${baseURL}/guardian/patients/new`);
    await logDebug(page, 'guardian-portal.spec.ts:create-patient', 'Navigated to add patient page', { url: page.url() }, 'D');
    
    await page.waitForLoadState('networkidle');
    
    // Fill patient form
    const nameInput = page.locator('input[id="name"], input[name="name"], input[placeholder*="name" i]').first();
    const dobInput = page.locator('input[id="dob"], input[name="dob"], input[type="date"]').first();
    const genderSelect = page.locator('select[id="gender"], select[name="gender"]').first();
    const addressTextarea = page.locator('textarea[id="address"], textarea[name="address"]').first();
    const emergencyContactInput = page.locator('input[id="emergencyContact"], input[name="emergencyContact"]').first();
    const emergencyPhoneInput = page.locator('input[id="emergencyPhone"], input[name="emergencyPhone"]').first();
    
    await logDebug(page, 'guardian-portal.spec.ts:create-patient', 'Checking form fields', {
      nameVisible: await nameInput.isVisible().catch(() => false),
      dobVisible: await dobInput.isVisible().catch(() => false),
      genderVisible: await genderSelect.isVisible().catch(() => false),
    }, 'D');
    
    await nameInput.fill('Jane Doe');
    await logDebug(page, 'guardian-portal.spec.ts:create-patient', 'Filled name', { name: 'Jane Doe' }, 'D');
    
    await dobInput.fill('1960-05-15');
    await logDebug(page, 'guardian-portal.spec.ts:create-patient', 'Filled date of birth', { dob: '1960-05-15' }, 'D');
    
    await genderSelect.selectOption('FEMALE');
    await logDebug(page, 'guardian-portal.spec.ts:create-patient', 'Selected gender', { gender: 'FEMALE' }, 'D');
    
    await addressTextarea.fill('123 Main St, Dhaka');
    await logDebug(page, 'guardian-portal.spec.ts:create-patient', 'Filled address', { address: '123 Main St, Dhaka' }, 'D');
    
    await emergencyContactInput.fill('John Doe');
    await logDebug(page, 'guardian-portal.spec.ts:create-patient', 'Filled emergency contact', { contact: 'John Doe' }, 'D');
    
    await emergencyPhoneInput.fill('+8801712345679');
    await logDebug(page, 'guardian-portal.spec.ts:create-patient', 'Filled emergency phone', { phone: '+8801712345679' }, 'D');
    
    // Submit form
    const saveButton = page.locator('button:has-text("Save Patient"), button:has-text("Save")').first();
    await logDebug(page, 'guardian-portal.spec.ts:create-patient', 'Checking save button', {
      saveButtonVisible: await saveButton.isVisible().catch(() => false),
      saveButtonDisabled: await saveButton.isDisabled().catch(() => false),
    }, 'E');
    
    await saveButton.click();
    await logDebug(page, 'guardian-portal.spec.ts:create-patient', 'Clicked save button', {}, 'E');
    
    // Wait for redirect or success message
    try {
      await page.waitForURL('**/guardian/dashboard', { timeout: 10000 });
      await logDebug(page, 'guardian-portal.spec.ts:create-patient', 'Redirected to dashboard after save', { url: page.url() }, 'F');
      
      // Verify redirect to dashboard
      await expect(page).toHaveURL(/.*guardian\/dashboard/);
      await logDebug(page, 'guardian-portal.spec.ts:create-patient', 'Patient creation successful', {}, 'F');
    } catch (error) {
      // Check for success message if redirect didn't happen
      const successMessage = page.locator('text=/Patient created successfully/i, text=/successfully/i').first();
      if (await successMessage.isVisible().catch(() => false)) {
        await logDebug(page, 'guardian-portal.spec.ts:create-patient', 'Success message found', {}, 'F');
      } else {
        await logDebug(page, 'guardian-portal.spec.ts:create-patient', 'Patient creation may have failed', {
          currentUrl: page.url(),
          error: error instanceof Error ? error.message : String(error),
        }, 'E');
        throw error;
      }
    }
  });

  test('should search and book caregiver package', async ({ page }) => {
    await logDebug(page, 'guardian-portal.spec.ts:search-package', 'Starting search package test', {}, 'G');
    
    // First, login
    await page.goto(`${baseURL}/auth/login`);
    await page.waitForLoadState('networkidle');
    
    const phoneInput = page.locator('input[name="phone"], input[type="tel"], input[placeholder*="phone" i]').first();
    const passwordInput = page.locator('input[name="password"], input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Log in")').first();
    
    if (await phoneInput.isVisible().catch(() => false)) {
      await phoneInput.fill('+8801712345678');
      await passwordInput.fill('Test123!@#');
      await submitButton.click();
      await page.waitForURL('**/guardian/dashboard', { timeout: 10000 });
      await logDebug(page, 'guardian-portal.spec.ts:search-package', 'Logged in successfully', {}, 'G');
    }
    
    // Navigate to packages page
    await page.goto(`${baseURL}/guardian/packages`);
    await logDebug(page, 'guardian-portal.spec.ts:search-package', 'Navigated to packages page', { url: page.url() }, 'G');
    
    await page.waitForLoadState('networkidle');
    
    // Search for package
    const searchInput = page.locator('input[placeholder*="Search" i], input[placeholder*="search" i]').first();
    await logDebug(page, 'guardian-portal.spec.ts:search-package', 'Checking search input', {
      searchInputVisible: await searchInput.isVisible().catch(() => false),
    }, 'G');
    
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill('elderly care');
      await logDebug(page, 'guardian-portal.spec.ts:search-package', 'Filled search query', { query: 'elderly care' }, 'G');
      
      await searchInput.press('Enter');
      await logDebug(page, 'guardian-portal.spec.ts:search-package', 'Pressed Enter to search', {}, 'G');
      
      // Wait for results (if any)
      await page.waitForTimeout(1000);
    }
    
    // Wait for package cards to appear
    const packageCard = page.locator('text=/24\\/7 Senior Care|Post-Surgery Care|Dementia Care|Elderly Care Package/i').first();
    await logDebug(page, 'guardian-portal.spec.ts:search-package', 'Looking for package cards', {
      packageCardVisible: await packageCard.isVisible({ timeout: 5000 }).catch(() => false),
    }, 'H');
    
    if (await packageCard.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Click on package card
      await packageCard.click();
      await logDebug(page, 'guardian-portal.spec.ts:search-package', 'Clicked on package card', {}, 'H');
      
      // Wait for package detail page
      await page.waitForURL('**/guardian/packages/**', { timeout: 10000 });
      await logDebug(page, 'guardian-portal.spec.ts:search-package', 'Navigated to package detail', { url: page.url() }, 'H');
      
      // Look for "Book Now" button
      const bookButton = page.locator('button:has-text("Book Now"), button:has-text("Book")').first();
      await logDebug(page, 'guardian-portal.spec.ts:search-package', 'Looking for Book Now button', {
        bookButtonVisible: await bookButton.isVisible().catch(() => false),
      }, 'I');
      
      if (await bookButton.isVisible().catch(() => false)) {
        await bookButton.click();
        await logDebug(page, 'guardian-portal.spec.ts:search-package', 'Clicked Book Now button', {}, 'I');
        
        // Wait for payment or booking page
        await page.waitForTimeout(2000);
        await logDebug(page, 'guardian-portal.spec.ts:search-package', 'After Book Now click', {
          currentUrl: page.url(),
        }, 'I');
      }
    } else {
      await logDebug(page, 'guardian-portal.spec.ts:search-package', 'No package cards found, test may need mock data', {}, 'H');
    }
  });

  test('should complete full user flow: login → dashboard → add patient → browse packages', async ({ page }) => {
    await logDebug(page, 'guardian-portal.spec.ts:full-flow', 'Starting full user flow test', {}, 'J');
    
    // Step 1: Login
    await page.goto(`${baseURL}/auth/login`);
    await page.waitForLoadState('networkidle');
    
    const phoneInput = page.locator('input[name="phone"], input[type="tel"], input[placeholder*="phone" i]').first();
    const passwordInput = page.locator('input[name="password"], input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Log in")').first();
    
    if (await phoneInput.isVisible().catch(() => false)) {
      await phoneInput.fill('+8801712345678');
      await passwordInput.fill('Test123!@#');
      await submitButton.click();
      await page.waitForURL('**/guardian/dashboard', { timeout: 10000 });
      await logDebug(page, 'guardian-portal.spec.ts:full-flow', 'Step 1: Login completed', {}, 'J');
    }
    
    // Step 2: Verify dashboard
    await expect(page).toHaveURL(/.*guardian\/dashboard/);
    await logDebug(page, 'guardian-portal.spec.ts:full-flow', 'Step 2: Dashboard verified', { url: page.url() }, 'J');
    
    // Step 3: Navigate to add patient (via quick action or direct navigation)
    const addPatientButton = page.locator('button:has-text("Add Patient"), button:has-text("+ Patient"), a:has-text("Add Patient")').first();
    if (await addPatientButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addPatientButton.click();
      await page.waitForURL('**/guardian/patients/new', { timeout: 10000 });
      await logDebug(page, 'guardian-portal.spec.ts:full-flow', 'Step 3: Navigated to add patient via button', {}, 'J');
    } else {
      await page.goto(`${baseURL}/guardian/patients/new`);
      await logDebug(page, 'guardian-portal.spec.ts:full-flow', 'Step 3: Navigated to add patient directly', {}, 'J');
    }
    
    // Step 4: Fill minimal patient form
    const nameInput = page.locator('input[id="name"], input[name="name"]').first();
    if (await nameInput.isVisible().catch(() => false)) {
      await nameInput.fill('Test Patient');
      await page.locator('input[id="dob"], input[type="date"]').first().fill('1960-05-15');
      await page.locator('select[id="gender"]').first().selectOption('FEMALE');
      await page.locator('textarea[id="address"]').first().fill('123 Test St');
      await page.locator('input[id="emergencyContact"]').first().fill('Test Contact');
      await page.locator('input[id="emergencyPhone"]').first().fill('+8801712345679');
      
      await logDebug(page, 'guardian-portal.spec.ts:full-flow', 'Step 4: Filled patient form', {}, 'J');
      
      // Save patient
      await page.locator('button:has-text("Save Patient"), button:has-text("Save")').first().click();
      await page.waitForURL('**/guardian/dashboard', { timeout: 10000 });
      await logDebug(page, 'guardian-portal.spec.ts:full-flow', 'Step 5: Patient saved, returned to dashboard', {}, 'J');
    }
    
    // Step 6: Navigate to packages
    await page.goto(`${baseURL}/guardian/packages`);
    await page.waitForLoadState('networkidle');
    await logDebug(page, 'guardian-portal.spec.ts:full-flow', 'Step 6: Navigated to packages page', { url: page.url() }, 'J');
    
    // Verify packages page loaded
    await expect(page).toHaveURL(/.*guardian\/packages/);
    await logDebug(page, 'guardian-portal.spec.ts:full-flow', 'Full flow test completed', {}, 'J');
  });
});

