import { test, expect, devices, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { jobsSplitMarkup } from '../../jobs-split-markup';

const pixel = devices['Pixel 5'];

type CorePage = import('playwright-core').Page;

declare global {
  interface Window {
    __jobsSelectedQuery?: string;
  }
}

const readVirtualQuery = (page: Page) => page.evaluate(() => window.__jobsSelectedQuery ?? '');

test.describe('Jobs split mobile layout', () => {
  test.use({ viewport: pixel.viewport, userAgent: pixel.userAgent });

  test('stacks list above detail and keeps focusable row order', async ({ page }) => {
    await page.setContent(jobsSplitMarkup, { waitUntil: 'domcontentloaded' });

    const listBox = await page.locator('[data-testid="jobs-list"]').boundingBox();
    const detailBox = await page.locator('[data-testid="jobs-detail"]').boundingBox();

    if (!listBox || !detailBox) {
      throw new Error('Unable to capture mobile layout bounds.');
    }

    expect(listBox.y).toBeLessThan(detailBox.y);
    expect(Math.abs(listBox.width - detailBox.width)).toBeLessThan(8);

    await page.keyboard.press('Tab');
    const firstFocus = await page.evaluate(() => document.activeElement?.getAttribute('data-job-id'));
    expect(firstFocus).toBe('job-1');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await expect.poll(async () => readVirtualQuery(page)).toContain('selected=job-2');

    const mobileA11y = await new AxeBuilder({ page: page as unknown as CorePage })
      .include('#jobs-app')
      .analyze();
    expect(mobileA11y.violations).toEqual([]);
  });

  test('shows placeholders when every job is deleted', async ({ page }) => {
    await page.setContent(jobsSplitMarkup, { waitUntil: 'domcontentloaded' });

    const deleteButton = () => page.getByRole('button', { name: /Delete/i }).first();

    await deleteButton().click();
    await deleteButton().click();
    await deleteButton().click();

    await expect(page.locator('[data-testid="detail-placeholder"]')).toBeVisible();
    await expect(page.locator('[data-testid="jobs-empty"]')).toBeVisible();
  });
});
