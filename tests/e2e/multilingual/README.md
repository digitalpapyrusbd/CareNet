# Multilingual System E2E Tests

This directory contains end-to-end tests for the multilingual system, covering the manual testing checklist items.

## Test Files

- **`language-switching.spec.ts`** - Tests A1-A13: Basic language switching functionality
- **`translation-quality.spec.ts`** - Tests A14-A19: Translation quality checks
- **`admin-export-import.spec.ts`** - Tests B1-B20: Admin export/import features (requires admin access)
- **`auto-language-detection.spec.ts`** - Tests E1-E9: Automatic language detection

## Running Tests

### Run All Multilingual Tests
```bash
npm run test:e2e:multilingual
```

### Run Specific Test File
```bash
npx playwright test tests/e2e/multilingual/language-switching.spec.ts
```

### Run in UI Mode (Interactive)
```bash
npm run test:e2e:ui
```

### Run in Headed Mode (See Browser)
```bash
npm run test:e2e:headed
```

## Test Coverage

### ✅ Fully Automated
- A1-A13: Language switching flow
- A14-A19: Translation quality checks
- E1-E9: Auto language detection

### ⚠️ Partially Automated (Requires Setup)
- B1-B20: Admin export/import (tests are written but skipped - unskip when admin auth is configured)

### 📝 Manual Testing Still Needed
- C1-C20: Text Scrubber (complex UI interactions)
- D1-D9: Inline Translation Editor (requires admin access)

## Prerequisites

1. **Development server running**: `npm run dev`
2. **Playwright browsers installed**: `npx playwright install`

## Configuration

Tests use the base URL from `playwright.config.ts`. Default is `http://localhost:3000`.

To change:
```bash
PLAYWRIGHT_BASE_URL=http://localhost:3001 npm run test:e2e
```

## Notes

- Some admin tests are skipped by default (marked with `test.skip()`) as they require authentication
- Unskip and configure authentication when you have test admin credentials
- Tests clear localStorage before each test to ensure clean state
- Bengali text matching uses regex patterns to handle Unicode characters
