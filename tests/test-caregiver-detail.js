/**
 * Test script for Caregiver Detail Page
 * Tests the specific URL: /admin/caregivers/cmjl6m0ya000n0ppgyewwaxmm
 */

const { chromium } = require('playwright');

// Try to detect which port the server is running on
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
const CAREGIVER_ID = 'cmjl6m0ya000n0ppgyewwaxmm';
const SUPER_ADMIN_PHONE = '+8801712345101';
const SUPER_ADMIN_PASSWORD = 'Admin@123';

async function logDebug(page, location, message, data, hypothesisId) {
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
    
    await page.evaluate((logData) => {
      fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData),
      }).catch(() => {});
    }, logData);
    
    console.log(`[${hypothesisId}] ${location}: ${message}`, data || '');
  } catch (error) {
    console.error('Logging error:', error.message);
  }
}

async function testCaregiverDetailPage() {
  console.log('🚀 Testing Caregiver Detail Page\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Caregiver ID: ${CAREGIVER_ID}\n`);
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Step 1: Login
    console.log('📋 Step 1: Logging in as Super Admin');
    console.log('='.repeat(50));
    
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(5000); // Wait for React to hydrate
    
    // Check page content
    const pageContent = await page.content();
    const pageText = await page.textContent('body').catch(() => '');
    
    await logDebug(page, 'test-caregiver-detail:login', 'Navigated to login', { 
      url: page.url(),
      hasPhoneInput: pageContent.includes('phone') || pageContent.includes('Phone'),
      bodyTextLength: pageText.length,
    }, 'A');
    
    // Try multiple selectors for phone input - wait for it to appear
    const phoneInput = page.locator('input[id="phone"], input[name="phone"], input[type="tel"], input[placeholder*="phone" i], input[placeholder*="01" i], input[placeholder*="+880" i]').first();
    const passwordInput = page.locator('input[id="password"], input[name="password"], input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Log in")').first();
    
    // Wait for elements with longer timeout
    try {
      await phoneInput.waitFor({ state: 'visible', timeout: 10000 });
      await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    } catch (e) {
      await logDebug(page, 'test-caregiver-detail:login', 'Elements not visible after wait', {
        error: e.message,
      }, 'A1');
      // Try to navigate directly if we have a token from previous session
      const authToken = await page.evaluate(() => localStorage.getItem('authToken'));
      if (authToken) {
        console.log('⚠️ Using existing auth token, navigating directly');
        await page.goto(`${BASE_URL}/admin/caregivers/${CAREGIVER_ID}`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(3000);
        // Continue to detail page test
      } else {
        throw new Error('Cannot find login form elements');
      }
    }
    
    const phoneVisible = await phoneInput.isVisible().catch(() => false);
    const passwordVisible = await passwordInput.isVisible().catch(() => false);
    
    await logDebug(page, 'test-caregiver-detail:login', 'Form elements check', {
      phoneVisible,
      passwordVisible,
    }, 'A1');
    
    if (phoneVisible && passwordVisible) {
      await phoneInput.fill(SUPER_ADMIN_PHONE);
      await passwordInput.fill(SUPER_ADMIN_PASSWORD);
      await submitButton.click();
      
      await page.waitForTimeout(3000);
    }
    
    const authToken = await page.evaluate(() => localStorage.getItem('authToken'));
    await logDebug(page, 'test-caregiver-detail:login', 'After login', {
      hasAuthToken: !!authToken,
      url: page.url(),
    }, 'B');
    
    if (!authToken) {
      console.log('❌ Login failed - no auth token');
      return;
    }
    
    console.log('✅ Login successful\n');
    
    // Step 2: Navigate to caregiver detail page
    console.log('📋 Step 2: Navigating to Caregiver Detail Page');
    console.log('='.repeat(50));
    
    const detailUrl = `${BASE_URL}/admin/caregivers/${CAREGIVER_ID}`;
    await logDebug(page, 'test-caregiver-detail:navigate', 'Navigating to detail page', {
      url: detailUrl,
      caregiverId: CAREGIVER_ID,
    }, 'C');
    
    await page.goto(detailUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(3000);
    
    // Check for console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Check for network errors
    page.on('response', response => {
      if (!response.ok() && response.url().includes('caregivers')) {
        consoleErrors.push(`Network error: ${response.status()} ${response.url()}`);
      }
    });
    
    const currentUrl = page.url();
    await logDebug(page, 'test-caregiver-detail:loaded', 'Page loaded', {
      currentUrl,
      expectedUrl: detailUrl,
      matches: currentUrl.includes(CAREGIVER_ID),
      consoleErrors: consoleErrors.length,
    }, 'D');
    
    if (consoleErrors.length > 0) {
      console.log('⚠️ Console errors detected:', consoleErrors.slice(0, 3));
    }
    
    // Check for error messages
    const errorElements = page.locator('text=/error|failed|not found/i');
    const errorCount = await errorElements.count();
    
    await logDebug(page, 'test-caregiver-detail:errors', 'Error check', {
      errorCount,
    }, 'E');
    
    // Check for loading state
    const loadingElement = page.locator('text=/loading/i');
    const isLoading = await loadingElement.isVisible({ timeout: 1000 }).catch(() => false);
    
    await logDebug(page, 'test-caregiver-detail:loading', 'Loading check', {
      isLoading,
    }, 'F');
    
    // Check for caregiver data
    const caregiverName = page.locator('h1, h2, h3').first();
    const nameVisible = await caregiverName.isVisible({ timeout: 5000 }).catch(() => false);
    const nameText = nameVisible ? await caregiverName.textContent().catch(() => '') : '';
    
    await logDebug(page, 'test-caregiver-detail:content', 'Content check', {
      nameVisible,
      nameText,
    }, 'G');
    
    // Check for profile sections
    const profileCard = page.locator('text=/profile|information/i').first();
    const statsCard = page.locator('text=/statistics|rating/i').first();
    const verificationCard = page.locator('text=/verification|status/i').first();
    
    const profileVisible = await profileCard.isVisible({ timeout: 3000 }).catch(() => false);
    const statsVisible = await statsCard.isVisible({ timeout: 3000 }).catch(() => false);
    const verificationVisible = await verificationCard.isVisible({ timeout: 3000 }).catch(() => false);
    
    await logDebug(page, 'test-caregiver-detail:sections', 'Section visibility', {
      profileVisible,
      statsVisible,
      verificationVisible,
    }, 'H');
    
    // Check for action buttons
    const verifyButton = page.locator('button:has-text("Verify"), button:has-text("verify")').first();
    const rejectButton = page.locator('button:has-text("Reject"), button:has-text("reject")').first();
    
    const verifyVisible = await verifyButton.isVisible({ timeout: 2000 }).catch(() => false);
    const rejectVisible = await rejectButton.isVisible({ timeout: 2000 }).catch(() => false);
    
    await logDebug(page, 'test-caregiver-detail:actions', 'Action buttons', {
      verifyVisible,
      rejectVisible,
    }, 'I');
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST RESULTS');
    console.log('='.repeat(50));
    console.log(`URL: ${currentUrl}`);
    console.log(`Expected ID in URL: ${currentUrl.includes(CAREGIVER_ID) ? '✅' : '❌'}`);
    console.log(`Errors found: ${errorCount}`);
    console.log(`Loading state: ${isLoading ? '⚠️ Still loading' : '✅ Loaded'}`);
    console.log(`Caregiver name visible: ${nameVisible ? '✅' : '❌'} ${nameText}`);
    console.log(`Profile section: ${profileVisible ? '✅' : '❌'}`);
    console.log(`Stats section: ${statsVisible ? '✅' : '❌'}`);
    console.log(`Verification section: ${verificationVisible ? '✅' : '❌'}`);
    console.log(`Verify button: ${verifyVisible ? '✅' : '❌'}`);
    console.log(`Reject button: ${rejectVisible ? '✅' : '❌'}`);
    
    if (currentUrl.includes(CAREGIVER_ID) && !isLoading && errorCount === 0) {
      console.log('\n✅ TEST PASSED: Caregiver detail page loads successfully');
    } else {
      console.log('\n❌ TEST FAILED: Issues detected');
    }
    
    // Keep browser open for observation
    console.log('\n⏳ Keeping browser open for 10 seconds...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('❌ Test error:', error);
    await logDebug(page, 'test-caregiver-detail:error', 'Fatal error', {
      errorName: error.name,
      errorMessage: error.message,
      errorStack: error.stack?.substring(0, 200),
    }, 'J');
  } finally {
    await browser.close();
  }
}

testCaregiverDetailPage()
  .then(() => {
    console.log('\n✅ Test completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

