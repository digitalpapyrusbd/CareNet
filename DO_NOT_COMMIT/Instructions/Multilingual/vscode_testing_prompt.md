# Cursor Prompt: Automated Testing Setup for Multilingual System

## Context
I have a multilingual system for CareNet and a manual testing checklist (HTML file). I want to automate as much testing as possible using:
- **Jest** for unit tests
- **React Testing Library** for component tests
- **Playwright** or **Cypress** for end-to-end tests
- **VS Code Test Explorer** integration

## Part 1: Project Setup

### Install Testing Dependencies
```bash
npm install --save-dev \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  @playwright/test \
  jest \
  jest-environment-jsdom
```

### Configure Jest
Create `jest.config.js` with proper settings for React and testing.

### Configure Playwright
Create `playwright.config.js` for E2E tests.

---

## Part 2: Unit Tests (From Manual Checklist)

### Test File Structure
```
/src
  /hooks
    useTranslation.test.js
  /contexts
    LanguageContext.test.js
  /utils
    translationValidator.test.js
  /components
    LanguageSelector.test.js
  /admin
    /translation
      ExportPanel.test.js
      ImportPanel.test.js
```

### Required Unit Tests

**1. useTranslation Hook Tests**
```javascript
// Test cases from manual checklist A1-A13:
describe('useTranslation Hook', () => {
  test('returns correct translation for valid key', () => {
    // Test implementation
  });
  
  test('returns fallback for missing key', () => {
    // Test implementation
  });
  
  test('switches language dynamically', () => {
    // Test implementation
  });
  
  test('handles nested keys correctly', () => {
    // Test implementation
  });
});
```

**2. LanguageContext Tests**
```javascript
// Tests for language persistence, localStorage, etc.
describe('LanguageContext', () => {
  test('persists language to localStorage', () => {
    // Test A11 from manual checklist
  });
  
  test('loads language from localStorage on mount', () => {
    // Test A12 from manual checklist
  });
  
  test('resets to default when localStorage cleared', () => {
    // Test A13 from manual checklist
  });
});
```

**3. Translation Validator Tests**
```javascript
// Tests for import validation (B18-B20 from manual checklist)
describe('Translation Validator', () => {
  test('accepts valid JSON translation file', () => {
    // Test B12-B13
  });
  
  test('rejects invalid JSON with error message', () => {
    // Test B18
  });
  
  test('warns about missing translation keys', () => {
    // Test B19
  });
  
  test('handles extra keys gracefully', () => {
    // Test B20
  });
});
```

---

## Part 3: Component Tests

**Language Selector Component**
```javascript
// Tests from manual checklist A2-A4
describe('LanguageSelector Component', () => {
  test('displays language dropdown when clicked', () => {
    // Test A2
  });
  
  test('shows all available languages', () => {
    // Test A3
  });
  
  test('switches language when option selected', () => {
    // Test A4
  });
  
  test('displays current language correctly', () => {
    // Visual verification
  });
});
```

**Admin Export Panel**
```javascript
// Tests from manual checklist B1-B9
describe('ExportPanel Component', () => {
  test('exports all text when button clicked', () => {
    // Test B3-B4
  });
  
  test('exported file has correct structure', () => {
    // Test B6
  });
  
  test('export includes all translations', () => {
    // Test B7
  });
});
```

**Admin Import Panel**
```javascript
// Tests from manual checklist B10-B17
describe('ImportPanel Component', () => {
  test('allows file upload', () => {
    // Test B11-B12
  });
  
  test('validates uploaded file', () => {
    // Test B13
  });
  
  test('shows preview before activation', () => {
    // Test B14
  });
  
  test('activates language successfully', () => {
    // Test B15-B17
  });
});
```

---

## Part 4: E2E Tests with Playwright

### Critical User Flows

**Test 1: Complete Language Switching Flow**
```javascript
// Covers manual tests A1-A13
import { test, expect } from '@playwright/test';

test('complete language switching flow', async ({ page }) => {
  // A1: Open app in English
  await page.goto('http://localhost:3000');
  
  // A2: Click language selector
  await page.click('[data-testid="language-selector"]');
  
  // A3: Verify languages shown
  await expect(page.locator('[data-testid="lang-english"]')).toBeVisible();
  await expect(page.locator('[data-testid="lang-bengali"]')).toBeVisible();
  
  // A4: Select Bengali
  await page.click('[data-testid="lang-bengali"]');
  
  // A5-A9: Verify all text changed
  await expect(page.locator('button:has-text("লগইন")')).toBeVisible();
  await expect(page.locator('nav >> text=হোম')).toBeVisible();
  
  // A11: Refresh and check persistence
  await page.reload();
  await expect(page.locator('button:has-text("লগইন")')).toBeVisible();
  
  // A12: Open new tab and check
  const newPage = await page.context().newPage();
  await newPage.goto('http://localhost:3000');
  await expect(newPage.locator('button:has-text("লগইন")')).toBeVisible();
});
```

**Test 2: Admin Export/Import Flow**
```javascript
// Covers manual tests B1-B20
test('admin export and import flow', async ({ page }) => {
  // B1-B2: Login and navigate
  await page.goto('http://localhost:3000/admin/login');
  await page.fill('[name="email"]', 'admin@test.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');
  await page.goto('http://localhost:3000/admin/translations');
  
  // B3-B4: Export file
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('button:has-text("Export All Text")')
  ]);
  
  // B5-B6: Verify file
  const path = await download.path();
  const fileContent = await fs.readFile(path, 'utf8');
  const json = JSON.parse(fileContent);
  expect(json.translations).toBeDefined();
  
  // B11-B17: Import new language
  await page.click('button:has-text("Import New Language")');
  await page.setInputFiles('input[type="file"]', './test-data/hi.json');
  await page.click('button:has-text("Activate Language")');
  
  // Verify new language appears
  await page.click('[data-testid="language-selector"]');
  await expect(page.locator('[data-testid="lang-hindi"]')).toBeVisible();
});
```

**Test 3: Text Scrubber Flow**
```javascript
// Covers manual tests C1-C20
test('text scrubber scan and replace', async ({ page }) => {
  await page.goto('http://localhost:3000/admin/translations/scrubber');
  
  // C2-C3: Scan components
  await page.click('button:has-text("Scan All Components")');
  await page.waitForSelector('[data-testid="scan-results"]');
  
  // C4-C5: Verify results
  const resultsCount = await page.locator('.hardcoded-string').count();
  expect(resultsCount).toBeGreaterThan(0);
  
  // C11-C14: Apply changes
  await page.click('.test-item:first-child input[type="checkbox"]');
  await page.click('button:has-text("Apply Selected")');
  
  // Verify confirmation
  await expect(page.locator('[role="dialog"]')).toBeVisible();
  await page.click('button:has-text("Confirm")');
  
  // C17: Verify app still works
  await page.goto('http://localhost:3000');
  await expect(page.locator('h1')).toBeVisible();
});
```

**Test 4: Translation Quality Checks**
```javascript
// Covers manual tests A14-A19
test('translation quality verification', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Switch to Bengali
  await page.click('[data-testid="language-selector"]');
  await page.click('[data-testid="lang-bengali"]');
  
  // A15: Check text overflow
  const buttons = await page.locator('button').all();
  for (const button of buttons) {
    const box = await button.boundingBox();
    const text = await button.textContent();
    // Verify text fits within button
    expect(box.width).toBeGreaterThan(0);
  }
  
  // A16: Check Bengali characters display
  await expect(page.locator('text=/[অ-ৰ]/')).toHaveCount({ min: 1 });
  
  // A18: Check no English fallbacks
  const englishWords = ['Login', 'Register', 'Home', 'Profile'];
  for (const word of englishWords) {
    await expect(page.locator(`text="${word}"`)).toHaveCount(0);
  }
});
```

**Test 5: Auto Language Detection**
```javascript
// Covers manual tests E1-E9
test('automatic language detection', async ({ browser }) => {
  // E2-E4: Test Bengali detection
  const bengaliContext = await browser.newContext({
    locale: 'bn-BD'
  });
  const page = await bengaliContext.newPage();
  await page.goto('http://localhost:3000');
  
  // Should load in Bengali
  await expect(page.locator('button:has-text("লগইন")')).toBeVisible();
  
  // E8-E9: Test unsupported language
  const frenchContext = await browser.newContext({
    locale: 'fr-FR'
  });
  const frenchPage = await frenchContext.newPage();
  await frenchPage.goto('http://localhost:3000');
  
  // Should default to English
  await expect(frenchPage.locator('button:has-text("Login")')).toBeVisible();
});
```

---

## Part 5: Visual Regression Tests

```javascript
// Screenshot comparison for UI consistency
test('visual regression - language selector', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('[data-testid="language-selector"]');
  
  // Take screenshot and compare
  await expect(page).toHaveScreenshot('language-dropdown-open.png');
});

test('visual regression - bengali UI', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('[data-testid="language-selector"]');
  await page.click('[data-testid="lang-bengali"]');
  
  // Screenshot each major page
  await expect(page).toHaveScreenshot('home-bengali.png');
  
  await page.goto('http://localhost:3000/profile');
  await expect(page).toHaveScreenshot('profile-bengali.png');
});
```

---

## Part 6: VS Code Integration

### Test Explorer Setup

Create `.vscode/settings.json`:
```json
{
  "jest.autoRun": "off",
  "playwright.testExplorer.enabled": true,
  "testing.automaticallyOpenPeekView": "failureInVisibleDocument"
}
```

### NPM Scripts
Add to `package.json`:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:all": "npm run test && npm run test:e2e"
  }
}
```

### VS Code Tasks
Create `.vscode/tasks.json`:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Run All Tests",
      "type": "shell",
      "command": "npm run test:all",
      "group": {
        "kind": "test",
        "isDefault": true
      }
    },
    {
      "label": "Run E2E Tests",
      "type": "shell",
      "command": "npm run test:e2e:ui",
      "group": "test"
    }
  ]
}
```

---

## Part 7: Test Data Files

Create test fixtures matching the manual checklist:

**`/tests/fixtures/translations.js`**
```javascript
export const validEnglishTranslations = {
  metadata: {
    languageCode: 'en',
    languageName: 'English',
    version: '1.0'
  },
  translations: {
    common: {
      login: 'Login',
      register: 'Register'
    },
    home: {
      title: 'CareNet',
      tagline: 'Quality care, connected'
    }
  }
};

export const validBengaliTranslations = {
  // Bengali version
};

export const invalidTranslations = {
  // Missing required keys
};
```

---

## Part 8: Coverage Reports

Generate coverage report that shows which manual tests are automated:

```javascript
// Create a mapping file
const manualToAutomatedMapping = {
  'A1': 'useTranslation.test.js:15',
  'A2': 'LanguageSelector.test.js:22',
  'A3': 'LanguageSelector.test.js:30',
  // ... map all manual tests to automated tests
};
```

---

## Output Required

Please generate:

1. **Complete Jest configuration** with React support
2. **Complete Playwright configuration** with test scripts
3. **All test files** covering manual checklist items A1-E9
4. **Test fixtures** (sample translation files)
5. **VS Code configuration files** for test explorer
6. **NPM scripts** for running tests
7. **README** explaining how to run tests
8. **Coverage report setup** showing what's tested

### Priority Order:
1. **E2E tests** for critical flows (language switching, export/import)
2. **Unit tests** for utilities (validator, scrubber)
3. **Component tests** for UI elements
4. **Visual regression tests** for UI consistency

### Success Criteria:
✅ Can run all tests with single command: `npm run test:all`
✅ Tests appear in VS Code Test Explorer
✅ Can run individual tests from VS Code
✅ Coverage report shows >80% of manual tests automated
✅ Tests run in CI/CD pipeline
✅ Visual diffs captured for UI changes

Please provide complete implementation with clear instructions for running in VS Code.