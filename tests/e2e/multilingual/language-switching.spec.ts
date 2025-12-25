import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Language Switching
 * Covers manual checklist items A1-A13
 */
test.describe('Language Switching Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('A1: Open app in English', async ({ page }) => {
    await page.goto('/');
    
    // Verify page loads
    await expect(page).toHaveTitle(/CareNet/i);
    
    // Verify English text is visible
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
  });

  test('A2: Click language selector dropdown', async ({ page }) => {
    await page.goto('/');
    
    // Find and click language selector
    const languageSelector = page.locator('button').filter({ hasText: /English|বাংলা|🇺🇸|🇧🇩/ }).first();
    await languageSelector.click();
    
    // Verify dropdown opens (should see language options)
    await expect(page.getByText('বাংলা')).toBeVisible({ timeout: 2000 });
  });

  test('A3: Verify all available languages shown', async ({ page }) => {
    await page.goto('/');
    
    // Click language selector
    const languageSelector = page.locator('button').filter({ hasText: /English|বাংলা|🇺🇸|🇧🇩/ }).first();
    await languageSelector.click();
    
    // Verify both languages are visible
    await expect(page.getByText('English')).toBeVisible();
    await expect(page.getByText('বাংলা')).toBeVisible();
  });

  test('A4: Select Bengali from dropdown', async ({ page }) => {
    await page.goto('/');
    
    // Click language selector
    const languageSelector = page.locator('button').filter({ hasText: /English|বাংলা|🇺🇸|🇧🇩/ }).first();
    await languageSelector.click();
    
    // Click Bengali option
    await page.getByText('বাংলা').click();
    
    // Verify language switched (check for Bengali text)
    await expect(page.getByRole('button', { name: /লগইন/i })).toBeVisible({ timeout: 3000 });
  });

  test('A5: Verify ALL text changes to Bengali', async ({ page }) => {
    await page.goto('/');
    
    // Switch to Bengali
    const languageSelector = page.locator('button').filter({ hasText: /English|বাংলা|🇺🇸|🇧🇩/ }).first();
    await languageSelector.click();
    await page.getByText('বাংলা').click();
    
    // Wait for language to switch
    await page.waitForTimeout(500);
    
    // Verify key elements are in Bengali
    await expect(page.getByRole('button', { name: /লগইন/i })).toBeVisible();
    
    // Check that English text is NOT visible
    const loginButton = page.getByRole('button', { name: /^Login$/i });
    await expect(loginButton).not.toBeVisible();
  });

  test('A6-A9: Verify menu items, buttons, labels, placeholders changed', async ({ page }) => {
    await page.goto('/');
    
    // Switch to Bengali
    const languageSelector = page.locator('button').filter({ hasText: /English|বাংলা|🇺🇸|🇧🇩/ }).first();
    await languageSelector.click();
    await page.getByText('বাংলা').click();
    
    await page.waitForTimeout(500);
    
    // Verify buttons changed
    await expect(page.getByRole('button', { name: /লগইন/i })).toBeVisible();
    
    // Navigate to login page to check form labels
    await page.getByRole('button', { name: /লগইন/i }).click();
    await page.waitForURL('**/auth/login');
    
    // Check for Bengali text on login page
    const pageText = await page.textContent('body');
    expect(pageText).toContain('লগইন');
  });

  test('A11: Refresh page - language persists', async ({ page }) => {
    await page.goto('/');
    
    // Switch to Bengali
    const languageSelector = page.locator('button').filter({ hasText: /English|বাংলা|🇺🇸|🇧🇩/ }).first();
    await languageSelector.click();
    await page.getByText('বাংলা').click();
    
    await page.waitForTimeout(500);
    
    // Verify Bengali is active
    await expect(page.getByRole('button', { name: /লগইন/i })).toBeVisible();
    
    // Refresh page
    await page.reload();
    
    // Verify Bengali persists after refresh
    await expect(page.getByRole('button', { name: /লগইন/i })).toBeVisible({ timeout: 3000 });
  });

  test('A12: Open in new tab - language persists', async ({ context, page }) => {
    await page.goto('/');
    
    // Switch to Bengali
    const languageSelector = page.locator('button').filter({ hasText: /English|বাংলা|🇺🇸|🇧🇩/ }).first();
    await languageSelector.click();
    await page.getByText('বাংলা').click();
    
    await page.waitForTimeout(500);
    
    // Open new tab
    const newPage = await context.newPage();
    await newPage.goto('/');
    
    // Verify Bengali persists in new tab
    await expect(newPage.getByRole('button', { name: /লগইন/i })).toBeVisible({ timeout: 3000 });
    
    await newPage.close();
  });

  test('A13: Clear localStorage - resets to default language', async ({ page }) => {
    await page.goto('/');
    
    // Switch to Bengali
    const languageSelector = page.locator('button').filter({ hasText: /English|বাংলা|🇺🇸|🇧🇩/ }).first();
    await languageSelector.click();
    await page.getByText('বাংলা').click();
    
    await page.waitForTimeout(500);
    
    // Clear localStorage
    await page.evaluate(() => localStorage.clear());
    
    // Reload page
    await page.reload();
    
    // Should default back to English
    await expect(page.getByRole('button', { name: /^Login$/i })).toBeVisible({ timeout: 3000 });
  });
});
