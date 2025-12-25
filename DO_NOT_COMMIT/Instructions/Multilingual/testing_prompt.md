# Testing Prompt: Comprehensive Testing for Multilingual System

## Context
I have implemented a multilingual system for CareNet with the following features:
- Export/Import translation files
- Language switching
- Text scrubber tool
- Admin dashboard for translation management

I need a complete testing strategy including unit tests, integration tests, and manual testing checklists.

---

## Part 1: Automated Testing

### Unit Tests Required

**1. Translation Hook Tests (`useTranslation.test.js`)**
```javascript
// Test cases needed:
✓ Returns correct translation for valid key
✓ Returns fallback text for missing key
✓ Returns key itself when translation missing (fallback mode)
✓ Handles nested keys (e.g., 'home.header.title')
✓ Handles interpolation (e.g., 'Hello {name}' with name='John')
✓ Handles pluralization if implemented
✓ Switches language dynamically
```

**2. Language Context Tests (`LanguageContext.test.js`)**
```javascript
// Test cases needed:
✓ Provides current language
✓ Changes language when setLanguage called
✓ Persists language to localStorage
✓ Loads language from localStorage on mount
✓ Falls back to default language if localStorage invalid
✓ Handles invalid language codes gracefully
```

**3. Translation File Validator Tests (`translationValidator.test.js`)**
```javascript
// Test cases needed:
✓ Validates correct JSON structure
✓ Detects missing required keys
✓ Detects extra keys not in master
✓ Validates metadata format
✓ Checks for empty translations
✓ Validates interpolation variables match
✓ Returns list of errors
```

**4. Text Scrubber Tests (`textScrubber.test.js`)**
```javascript
// Test cases needed:
✓ Detects hardcoded text in JSX
✓ Detects hardcoded text in attributes
✓ Ignores variable names
✓ Ignores function names
✓ Ignores comments
✓ Generates unique keys
✓ Handles duplicate text with different contexts
✓ Doesn't break existing translated text
```

**5. Export/Import Tests**
```javascript
// Test cases needed:
✓ Exports all translations to JSON
✓ Exports with correct structure
✓ Imports valid JSON successfully
✓ Rejects invalid JSON format
✓ Rejects files with missing keys
✓ Handles large translation files
✓ Maintains special characters (Bengali characters)
```

### Integration Tests

**1. End-to-End Language Switching**
```javascript
// Test flow:
1. User opens app → Sees English by default
2. User clicks language selector
3. User selects Bengali
4. All text updates to Bengali
5. Page reload → Still shows Bengali
6. User switches back to English → Works
```

**2. Admin Export/Import Flow**
```javascript
// Test flow:
1. Admin clicks "Export All Text"
2. File downloads successfully
3. Admin modifies translation file
4. Admin uploads modified file
5. System validates file
6. Admin activates new language
7. New language appears in selector
8. Users can switch to new language
```

**3. Text Scrubber Flow**
```javascript
// Test flow:
1. Admin runs text scrubber scan
2. System finds hardcoded text
3. Admin previews changes
4. Admin applies changes
5. Files are updated correctly
6. Translation keys added to JSON
7. App still works without errors
```

---

## Part 2: Test Implementation

### Setup Testing Framework

**Install Dependencies:**
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest
```

**Create Test Files Structure:**
```
/src
  /hooks
    useTranslation.js
    useTranslation.test.js
  /contexts
    LanguageContext.jsx
    LanguageContext.test.js
  /utils
    translationValidator.js
    translationValidator.test.js
    textScrubber.js
    textScrubber.test.js
  /components
    LanguageSelector.jsx
    LanguageSelector.test.js
  /__tests__
    /integration
      languageSwitching.test.js
      exportImport.test.js
```

**Sample Test Templates:**

Generate complete test files for each component/utility with:
- Proper setup and teardown
- Mock data (sample translations)
- Coverage for happy path and edge cases
- Clear test descriptions

---

## Part 3: Manual Testing Checklist

### A. Basic Functionality Tests

**Language Switching:**
```
☐ 1. Open app in English
☐ 2. Click language selector dropdown
☐ 3. Verify all available languages shown
☐ 4. Select Bengali
☐ 5. Verify ALL text changes to Bengali (check every page)
☐ 6. Verify menu items changed
☐ 7. Verify buttons changed
☐ 8. Verify form labels changed
☐ 9. Verify placeholder text changed
☐ 10. Verify error messages (trigger an error and check)
☐ 11. Refresh page - language persists
☐ 12. Open in new tab - language persists
☐ 13. Clear localStorage - resets to default language
```

**Translation Quality:**
```
☐ 1. Check all Bengali translations for accuracy
☐ 2. Check text doesn't overflow UI elements
☐ 3. Check special Bengali characters display correctly
☐ 4. Check text alignment (left-to-right works properly)
☐ 5. Check no missing translations (no English in Bengali mode)
☐ 6. Check capitalization appropriate for each language
```

### B. Admin Export/Import Tests

**Export Functionality:**
```
☐ 1. Login as super admin
☐ 2. Navigate to translation management
☐ 3. Click "Export All Text"
☐ 4. Verify file downloads
☐ 5. Verify file name is correct (e.g., en-translations.json)
☐ 6. Open file - verify JSON structure is correct
☐ 7. Verify all text is present in export
☐ 8. Export "Menu Only" - verify smaller file
☐ 9. Export "Page Content" - verify correct content
```

**Import Functionality:**
```
☐ 1. Create a new translation file (e.g., Hindi)
☐ 2. Click "Import New Language"
☐ 3. Upload valid translation file
☐ 4. Verify validation passes
☐ 5. Check preview shows correct translations
☐ 6. Click "Activate Language"
☐ 7. Verify new language appears in dropdown
☐ 8. Switch to new language - verify it works
☐ 9. Try uploading invalid JSON - verify error message
☐ 10. Try uploading file with missing keys - verify warning
☐ 11. Try uploading file with extra keys - verify handled gracefully
```

### C. Text Scrubber Tests

**Scan Mode:**
```
☐ 1. Navigate to Text Scrubber tool
☐ 2. Click "Scan All Components"
☐ 3. Wait for scan to complete
☐ 4. Verify it found hardcoded strings
☐ 5. Check each detected string is actually hardcoded
☐ 6. Verify it didn't flag already translated text
☐ 7. Verify it didn't flag variable names/code
☐ 8. Check suggested keys make sense
☐ 9. Preview changes for a component
☐ 10. Verify preview shows correct before/after
```

**Replace Mode:**
```
☐ 1. Select specific changes to apply
☐ 2. Click "Apply Selected"
☐ 3. Verify confirmation dialog appears
☐ 4. Confirm changes
☐ 5. Check components updated correctly
☐ 6. Verify translation JSON updated with new keys
☐ 7. Run app - verify no errors
☐ 8. Verify text still displays correctly
☐ 9. Check backup files created
☐ 10. Try "Replace All" option
```

### D. Edge Cases & Error Handling

**Missing Translations:**
```
☐ 1. Remove a translation key from Bengali file
☐ 2. Switch to Bengali
☐ 3. Verify fallback text shows (English or key)
☐ 4. Verify no console errors
☐ 5. Verify app doesn't crash
```

**Invalid Files:**
```
☐ 1. Try uploading a text file as translation
☐ 2. Verify clear error message
☐ 3. Try uploading malformed JSON
☐ 4. Verify helpful error message
☐ 5. Try uploading JSON with wrong structure
☐ 6. Verify specific validation error shown
```

**Large Files:**
```
☐ 1. Export with 500+ translation keys
☐ 2. Verify export completes
☐ 3. Import the large file
☐ 4. Verify import handles it
☐ 5. Verify language switching is still fast
```

**Special Characters:**
```
☐ 1. Add translations with emojis 🎉
☐ 2. Add translations with quotes "text"
☐ 3. Add translations with line breaks
☐ 4. Verify all display correctly
☐ 5. Verify export/import preserves them
```

### E. Browser Compatibility

**Test on Multiple Browsers:**
```
☐ Chrome (latest)
☐ Firefox (latest)
☐ Safari (latest)
☐ Edge (latest)
☐ Mobile Safari (iOS)
☐ Mobile Chrome (Android)
```

**For Each Browser:**
```
☐ Language switching works
☐ Dropdown displays correctly
☐ Bengali characters render properly
☐ localStorage persists
☐ Export/import works
```

### F. Mobile Responsiveness

```
☐ 1. Test on mobile device (or Chrome DevTools mobile view)
☐ 2. Verify language selector dropdown works on mobile
☐ 3. Verify dropdown doesn't go off-screen
☐ 4. Verify touch interactions work
☐ 5. Check text doesn't overflow on small screens
☐ 6. Test in landscape and portrait
```

### G. Performance Tests

```
☐ 1. Measure time to switch languages (should be < 200ms)
☐ 2. Check for memory leaks during repeated switching
☐ 3. Verify no unnecessary re-renders
☐ 4. Test with 1000+ translation keys
☐ 5. Check bundle size increase is reasonable
```

---

## Part 4: User Acceptance Testing (UAT)

### Test with Real Users

**Bengali Speakers:**
```
☐ 1. Ask 3-5 native Bengali speakers to test
☐ 2. Get feedback on translation quality
☐ 3. Check for cultural appropriateness
☐ 4. Note any awkward phrasing
☐ 5. Fix issues based on feedback
```

**Non-Technical Admins:**
```
☐ 1. Ask someone non-technical to try export/import
☐ 2. Observe if they can complete tasks without help
☐ 3. Note any confusion points
☐ 4. Improve UI/instructions based on feedback
```

---

## Part 5: Output Required

Please generate:

1. **Complete test files** for all unit tests mentioned above
2. **Integration test suite** using React Testing Library
3. **Test data/fixtures** (sample translation files for testing)
4. **GitHub Actions workflow** or CI/CD config for automated testing
5. **Testing documentation** with:
   - How to run tests
   - How to add new tests
   - Coverage requirements
6. **Manual testing spreadsheet/checklist** (can be Google Sheets format)
7. **Bug report template** for issues found during testing

---

## Success Criteria

✅ All automated tests pass
✅ Test coverage > 80% for translation system code
✅ Manual checklist 100% complete with no critical issues
✅ At least 3 Bengali speakers approve translations
✅ Works on all major browsers
✅ Works on mobile devices
✅ Admin can export/import without technical help
✅ No console errors in production build
✅ Language switching is smooth and fast

---

## Priority Order

1. **Critical Tests First:**
   - Language switching works
   - Export/import works
   - No crashes or errors

2. **Important Tests:**
   - Translation quality
   - Mobile responsiveness
   - Edge cases handled

3. **Nice to Have:**
   - Performance optimization
   - Advanced error scenarios
   - Browser edge cases

Please provide complete test implementation starting with the most critical tests.