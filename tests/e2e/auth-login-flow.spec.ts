import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Authentication Flow - AUTH1.2 Valid Login
 * Based on TESTER_MANUAL_AUTH.md Phase 1
 */

test.describe('Authentication Flow - AUTH1.2 Valid Login', () => {
  
  // Test accounts from TESTER_MANUAL_AUTH.md
  const testAccounts = [
    {
      role: 'Super Admin',
      phone: '+8801712345101',
      password: 'Admin@123',
      loginUrl: '/admin/login',
      expectedDashboard: '/admin/dashboard',
    },
    {
      role: 'Guardian',
      phone: '+8801712345501',
      password: 'Guardian@123',
      loginUrl: '/auth/login',
      expectedDashboard: '/guardian/dashboard',
    },
    {
      role: 'Caregiver',
      phone: '+8801712345401',
      password: 'Caregiver@123',
      loginUrl: '/auth/login',
      expectedDashboard: '/caregiver/dashboard',
    },
  ];

  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  for (const account of testAccounts) {
    test(`AUTH1.2 - ${account.role} Login Flow`, async ({ page }) => {
      console.log(`\n🧪 Testing ${account.role} login...`);
      
      // Navigate to login page
      await page.goto(account.loginUrl);
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Check if login form is visible
      const phoneInput = page.locator('input[type="tel"], input[placeholder*="phone" i], input[placeholder*="+880" i]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      const loginButton = page.getByRole('button', { name: /login/i }).first();
      
      // Verify form elements are present
      await expect(phoneInput).toBeVisible({ timeout: 5000 });
      await expect(passwordInput).toBeVisible({ timeout: 5000 });
      await expect(loginButton).toBeVisible({ timeout: 5000 });
      
      console.log(`✅ Form elements found for ${account.role}`);
      
      // Fill in credentials
      await phoneInput.fill(account.phone);
      await passwordInput.fill(account.password);
      
      console.log(`📝 Credentials entered for ${account.role}`);
      
      // Click login button
      await loginButton.click();
      
      console.log(`🔘 Login button clicked for ${account.role}`);
      
      // Wait for navigation or response (with timeout)
      try {
        // Wait for either redirect to dashboard or error message
        await page.waitForURL(`**${account.expectedDashboard}`, { timeout: 15000 });
        console.log(`✅ Redirected to ${account.expectedDashboard}`);
      } catch (error: any) {
        // If we're still on login page or got error, log details
        const currentUrl = page.url();
        const pageContent = await page.textContent('body') || '';
        
        console.error(`❌ Login failed for ${account.role}:`);
        console.error(`   Current URL: ${currentUrl}`);
        console.error(`   Expected: ${account.expectedDashboard}`);
        console.error(`   Page contains error: ${pageContent.includes('error') || pageContent.includes('invalid')}`);
        
        // Check for error messages on page
        const errorMessages = await page.locator('text=/invalid|error|failed|incorrect/i').allTextContents();
        if (errorMessages.length > 0) {
          console.error(`   Error messages found: ${errorMessages.join(', ')}`);
        }
        
        // Take screenshot for debugging
        await page.screenshot({ path: `tests/screenshots/login-failed-${account.role.replace(/\s+/g, '-').toLowerCase()}.png`, fullPage: true });
        console.log(`   Screenshot saved to tests/screenshots/login-failed-${account.role.replace(/\s+/g, '-').toLowerCase()}.png`);
        
        throw error;
      }
      
      // Verify we're on the correct dashboard
      await expect(page).toHaveURL(new RegExp(account.expectedDashboard.replace(/\//g, '\\/')));
      
      // Wait a bit for dashboard to load
      await page.waitForLoadState('networkidle');
      
      // Verify localStorage has auth token
      const authToken = await page.evaluate(() => localStorage.getItem('authToken'));
      expect(authToken).toBeTruthy();
      console.log(`✅ Auth token stored in localStorage`);
      
      // Verify localStorage has user data
      const userData = await page.evaluate(() => localStorage.getItem('user'));
      expect(userData).toBeTruthy();
      console.log(`✅ User data stored in localStorage`);
      
      // Verify dashboard loaded (check for common dashboard elements)
      const bodyText = await page.textContent('body');
      expect(bodyText).not.toBeNull();
      
      console.log(`✅ ${account.role} login successful - redirected to ${account.expectedDashboard}\n`);
    });
  }
});

