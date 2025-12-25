/**
 * Simplified test for Caregiver Detail Page
 * Tests: http://localhost:3000/admin/caregivers/cmjl6m0ya000n0ppgyewwaxmm
 */

const { chromium } = require('playwright');

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
const CAREGIVER_ID = 'cmjl6m0ya000n0ppgyewwaxmm';

async function testCaregiverDetailPage() {
  console.log('🚀 Testing Caregiver Detail Page\n');
  console.log(`URL: ${BASE_URL}/admin/caregivers/${CAREGIVER_ID}\n`);
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate directly to the caregiver detail page
    console.log('📋 Navigating to caregiver detail page...');
    await page.goto(`${BASE_URL}/admin/caregivers/${CAREGIVER_ID}`, { 
      waitUntil: 'domcontentloaded',
      timeout: 20000 
    });
    
    await page.waitForTimeout(5000);
    
    const currentUrl = page.url();
    const pageTitle = await page.title();
    const pageContent = await page.content();
    
    console.log(`Current URL: ${currentUrl}`);
    console.log(`Page Title: ${pageTitle}`);
    console.log(`Page Content Length: ${pageContent.length}`);
    
    // Check for errors
    const errorText = await page.locator('text=/error|failed|not found/i').first().textContent().catch(() => null);
    const loadingText = await page.locator('text=/loading/i').first().textContent().catch(() => null);
    
    console.log(`\nError text: ${errorText || 'None'}`);
    console.log(`Loading text: ${loadingText || 'None'}`);
    
    // Check for caregiver name or profile
    const headings = await page.locator('h1, h2, h3').allTextContents().catch(() => []);
    console.log(`\nHeadings found: ${headings.length}`);
    headings.slice(0, 5).forEach((h, i) => console.log(`  ${i + 1}. ${h.substring(0, 50)}`));
    
    // Check console logs
    const consoleMessages = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleMessages.push(`[CONSOLE ERROR] ${msg.text()}`);
      }
    });
    
    // Check network requests
    const apiRequests = [];
    page.on('response', response => {
      const url = response.url();
      if (url.includes('caregivers') || url.includes('api')) {
        apiRequests.push({
          url: url.substring(0, 100),
          status: response.status(),
          ok: response.ok(),
        });
      }
    });
    
    await page.waitForTimeout(3000);
    
    console.log(`\nConsole Errors: ${consoleMessages.length}`);
    consoleMessages.forEach(msg => console.log(`  ${msg}`));
    
    console.log(`\nAPI Requests: ${apiRequests.length}`);
    apiRequests.forEach(req => {
      console.log(`  ${req.status} ${req.ok ? '✅' : '❌'} ${req.url}`);
    });
    
    // Take a screenshot
    await page.screenshot({ path: 'caregiver-detail-test.png', fullPage: true });
    console.log('\n📸 Screenshot saved: caregiver-detail-test.png');
    
    // Keep browser open
    console.log('\n⏳ Keeping browser open for 15 seconds...');
    await page.waitForTimeout(15000);
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  } finally {
    await browser.close();
  }
}

testCaregiverDetailPage()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });


