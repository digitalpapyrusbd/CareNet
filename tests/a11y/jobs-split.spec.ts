import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { jobsSplitMarkup } from '../jobs-split-markup';

type CorePage = import('playwright-core').Page;

declare global {
  interface Window {
    __jobsSelectedQuery?: string;
  }
}

const readVirtualQuery = (page: Page) => page.evaluate(() => window.__jobsSelectedQuery ?? '');

test.describe('Jobs desktop split layout', () => {
  test('maintains column ratio, updates query, and passes axe scan', async ({ page }) => {
    await page.setContent(jobsSplitMarkup, { waitUntil: 'domcontentloaded' });

    const listBox = await page.locator('[data-testid="jobs-list"]').boundingBox();
    const detailBox = await page.locator('[data-testid="jobs-detail"]').boundingBox();
    expect(listBox).not.toBeNull();
    expect(detailBox).not.toBeNull();

    if (!listBox || !detailBox) {
      throw new Error('Unable to measure jobs split layout.');
    }

    const ratio = listBox.width / (listBox.width + detailBox.width);
    expect(ratio).toBeGreaterThan(0.38);
    expect(ratio).toBeLessThan(0.42);

    await page.getByRole('button', { name: /Samiha Rahman/i }).click();
    await expect.poll(async () => readVirtualQuery(page)).toContain('selected=job-2');

    const accessibilityScan = await new AxeBuilder({ page: page as unknown as CorePage })
      .include('#jobs-app')
      .analyze();
    expect(accessibilityScan.violations).toEqual([]);
  });

  test('honors deep links via selected query param', async ({ page }) => {
    await page.goto('about:blank?selected=job-2');
    await page.setContent(jobsSplitMarkup, { waitUntil: 'domcontentloaded' });

    const selectedCard = page.locator('[data-job-id="job-2"]');
    await expect(selectedCard).toHaveClass(/selected/);
    await expect.poll(async () => readVirtualQuery(page)).toContain('selected=job-2');
  });

  test('delete cascade reselects until list is empty', async ({ page }) => {
    await page.setContent(jobsSplitMarkup, { waitUntil: 'domcontentloaded' });

    const deleteButton = () => page.getByRole('button', { name: /Delete/i }).first();

    await deleteButton().click();
    await expect.poll(async () => readVirtualQuery(page)).toContain('selected=job-2');

    await deleteButton().click();
    await expect.poll(async () => readVirtualQuery(page)).toContain('selected=job-3');

    await deleteButton().click();
    await expect.poll(async () => readVirtualQuery(page)).toEqual('');
    await expect(page.locator('[data-testid="detail-placeholder"]')).toBeVisible();
    await expect(page.locator('[data-testid="jobs-empty"]')).toBeVisible();
  });
});
