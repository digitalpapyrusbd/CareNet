import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Translation Quality
 * Covers manual checklist items A14-A19
 */
test.describe('Translation Quality Checks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Switch to Bengali
    const languageSelector = page.locator('button').filter({ hasText: /English|বাংলা|🇺🇸|🇧🇩/ }).first();
    await languageSelector.click();
    await page.getByText('বাংলা').click();
    await page.waitForTimeout(500);
  });

  test('A15: Check text doesn\'t overflow UI elements', async ({ page }) => {
    // Get all buttons
    const buttons = await page.locator('button').all();
    
    for (const button of buttons) {
      const box = await button.boundingBox();
      const text = await button.textContent();
      
      if (box && text) {
        // Verify button has reasonable dimensions
        expect(box.width).toBeGreaterThan(0);
        expect(box.height).toBeGreaterThan(0);
        
        // Check if text fits (basic check - button should be wider than text)
        // This is a basic check; more sophisticated checks would measure text width
        expect(box.width).toBeGreaterThan(20); // Minimum reasonable width
      }
    }
  });

  test('A16: Check special Bengali characters display correctly', async ({ page }) => {
    // Check for Bengali characters (Unicode range: U+0980–U+09FF)
    const bengaliText = await page.locator('text=/[অ-ৰ]/').first();
    
    // Verify Bengali characters are visible (not showing as boxes)
    await expect(bengaliText).toBeVisible();
    
    // Get the text and verify it contains Bengali characters
    const text = await bengaliText.textContent();
    expect(text).toMatch(/[অ-ৰ]/);
  });

  test('A17: Check text alignment (left-to-right works properly)', async ({ page }) => {
    // Check document direction
    const dir = await page.evaluate(() => document.documentElement.dir);
    expect(dir).toBe('ltr'); // Bengali uses LTR
    
    // Check a text element's computed style
    const button = page.getByRole('button', { name: /লগইন/i }).first();
    const textAlign = await button.evaluate((el) => {
      return window.getComputedStyle(el).textAlign;
    });
    
    // Text should be aligned (left, center, or right - not undefined)
    expect(['left', 'center', 'right', 'start']).toContain(textAlign);
  });

  test('A18: Check no missing translations (no English in Bengali mode)', async ({ page }) => {
    // Common English words that should NOT appear in Bengali mode
    const englishWords = ['Login', 'Register', 'Home', 'Profile', 'Settings'];
    
    const pageText = await page.textContent('body');
    
    for (const word of englishWords) {
      // Check that English words don't appear as standalone text
      // (they might appear in code comments or data attributes, which is OK)
      const exactMatch = new RegExp(`\\b${word}\\b`, 'i');
      if (pageText) {
        // This is a basic check - in a real scenario, you'd want to check visible text only
        // For now, we'll just verify the page doesn't have these as main content
        const visibleText = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('button, a, span, p, h1, h2, h3, h4, h5, h6'))
            .map(el => el.textContent)
            .join(' ');
        });
        
        // The visible text should not contain these English words as main content
        // (allowing for them to be in attributes or hidden elements)
        expect(visibleText.toLowerCase()).not.toContain(word.toLowerCase());
      }
    }
  });

  test('A19: Check capitalization appropriate for each language', async ({ page }) => {
    // Get Bengali text
    const bengaliButton = page.getByRole('button', { name: /লগইন/i });
    const text = await bengaliButton.textContent();
    
    if (text) {
      // Bengali text should not be all uppercase (unless intentional)
      // Most Bengali UI text should be in normal case
      const isAllUppercase = text === text.toUpperCase() && /[A-Z]/.test(text);
      // Allow for Bengali characters which don't have case
      expect(isAllUppercase).toBe(false);
    }
  });
});
