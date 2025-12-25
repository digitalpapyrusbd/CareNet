import { test, expect } from '@playwright/test';

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
      
      // Fill in credentials
      await phoneInput.fill(account.phone);
      await passwordInput.fill(account.password);
      
      // Click login button
      await loginButton.click();
      
      // Wait for navigation or response (with timeout)
      try {
        // Wait for either redirect to dashboard or error message
        await Promise.race([
          page.waitForURL(`**${account.expectedDashboard}`, { timeout: 10000 }),
          page.waitForSelector('text=/invalid|error|failed/i', { timeout: 5000 }).then(() => {
            throw new Error('Login error detected');
          }),
        ]);
      } catch (error: any) {
        // If we're still on login page or got error, log details
        const currentUrl = page.url();
        const pageContent = await page.textContent('body');
        
        console.log(`Login failed for ${account.role}:`);
        console.log(`Current URL: ${currentUrl}`);
        console.log(`Expected: ${account.expectedDashboard}`);
        console.log(`Page contains error: ${pageContent?.includes('error') || pageContent?.includes('invalid')}`);
        
        // Take screenshot for debugging
        await page.screenshot({ path: `tests/screenshots/login-failed-${account.role.replace(/\s+/g, '-').toLowerCase()}.png`, fullPage: true });
        
        throw error;
      }
      
      // Verify we're on the correct dashboard
      await expect(page).toHaveURL(new RegExp(account.expectedDashboard.replace(/\//g, '\\/')));
      
      // Wait a bit for dashboard to load
      await page.waitForLoadState('networkidle');
      
      // Verify localStorage has auth token
      const authToken = await page.evaluate(() => localStorage.getItem('authToken'));
      expect(authToken).toBeTruthy();
      
      // Verify localStorage has user data
      const userData = await page.evaluate(() => localStorage.getItem('user'));
      expect(userData).toBeTruthy();
      
      // Verify dashboard loaded (check for common dashboard elements)
      const bodyText = await page.textContent('body');
      expect(bodyText).not.toBeNull();
      
      console.log(`✅ ${account.role} login successful - redirected to ${account.expectedDashboard}`);
    });
  }
});

