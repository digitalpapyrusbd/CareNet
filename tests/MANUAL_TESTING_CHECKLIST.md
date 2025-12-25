# Manual Testing Checklist for Multilingual System

## Test Execution Log

**Date:** _______________  
**Tester:** _______________  
**Environment:** [ ] Development [ ] Staging [ ] Production  
**Browser:** _______________  
**Device:** [ ] Desktop [ ] Mobile [ ] Tablet

---

## A. Basic Functionality Tests

### Language Switching

- [ ] **A1.** Open app in English
  - **Expected:** All text displays in English
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **A2.** Click language selector dropdown in header
  - **Expected:** Dropdown opens showing available languages
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **A3.** Verify all available languages shown (English, Bengali)
  - **Expected:** Both languages visible with flags/icons
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **A4.** Select Bengali from dropdown
  - **Expected:** Language switches immediately
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **A5.** Verify ALL text changes to Bengali (check every page)
  - **Pages to check:**
    - [ ] Landing page
    - [ ] Login page
    - [ ] Dashboard
    - [ ] Profile page
    - [ ] Settings page
  - **Expected:** All text in Bengali
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **A6.** Verify menu items changed
  - **Expected:** Navigation items in Bengali
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **A7.** Verify buttons changed
  - **Expected:** All button labels in Bengali
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **A8.** Verify form labels changed
  - **Expected:** Input labels in Bengali
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **A9.** Verify placeholder text changed
  - **Expected:** Placeholders in Bengali
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **A10.** Verify error messages (trigger an error and check)
  - **Expected:** Error messages in Bengali
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **A11.** Refresh page - language persists
  - **Expected:** Still shows Bengali after refresh
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **A12.** Open in new tab - language persists
  - **Expected:** New tab also shows Bengali
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **A13.** Clear localStorage - resets to default language
  - **Steps:** Open DevTools → Application → LocalStorage → Clear
  - **Expected:** Resets to English (default)
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

### Translation Quality

- [ ] **A14.** Check all Bengali translations for accuracy
  - **Expected:** Translations are correct and natural
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **A15.** Check text doesn't overflow UI elements
  - **Expected:** All text fits within containers
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **A16.** Check special Bengali characters display correctly
  - **Expected:** All Bengali characters render properly
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **A17.** Check text alignment (left-to-right works properly)
  - **Expected:** Text aligns correctly
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **A18.** Check no missing translations (no English in Bengali mode)
  - **Expected:** No English text visible when Bengali selected
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **A19.** Check capitalization appropriate for each language
  - **Expected:** Proper capitalization for Bengali
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

---

## B. Admin Export/Import Tests

### Export Functionality

- [ ] **B1.** Login as super admin
  - **Expected:** Successfully logged in
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **B2.** Navigate to `/admin/translations`
  - **Expected:** Translation management page loads
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **B3.** Click "Export All Text" button
  - **Expected:** File download starts
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **B4.** Verify file downloads successfully
  - **Expected:** File appears in downloads
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **B5.** Verify file name is correct (e.g., `translations-all-YYYY-MM-DD.json`)
  - **Expected:** Correct naming format
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **B6.** Open file - verify JSON structure is correct
  - **Expected:** Valid JSON with metadata and translations
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **B7.** Verify all text is present in export
  - **Expected:** All UI text included
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **B8.** Export "Menu Only" - verify smaller file
  - **Expected:** Smaller file with only navigation items
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **B9.** Export "Page Content" - verify correct content
  - **Expected:** All content except navigation
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

### Import Functionality

- [ ] **B10.** Create a new translation file (e.g., Hindi `hi.json`)
  - **Expected:** Valid JSON file created
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **B11.** Click "Import New Language" in admin panel
  - **Expected:** File upload interface appears
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **B12.** Upload valid translation file
  - **Expected:** File accepted
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **B13.** Verify validation passes
  - **Expected:** No validation errors
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **B14.** Check preview shows correct translations
  - **Expected:** Preview displays sample translations
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **B15.** Click "Activate Language"
  - **Expected:** Language activated successfully
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **B16.** Verify new language appears in dropdown
  - **Expected:** New language visible in language selector
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **B17.** Switch to new language - verify it works
  - **Expected:** App displays in new language
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **B18.** Try uploading invalid JSON - verify error message
  - **Expected:** Clear error message displayed
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **B19.** Try uploading file with missing keys - verify warning
  - **Expected:** Warning about missing keys shown
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **B20.** Try uploading file with extra keys - verify handled gracefully
  - **Expected:** Extra keys accepted without error
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

---

## C. Text Scrubber Tests

### Scan Mode

- [ ] **C1.** Navigate to `/admin/translations/scrubber`
  - **Expected:** Text Scrubber page loads
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **C2.** Click "Scan All Components"
  - **Expected:** Scan starts and completes
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **C3.** Wait for scan to complete
  - **Expected:** Results displayed
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **C4.** Verify it found hardcoded strings
  - **Expected:** List of replacements shown
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **C5.** Check each detected string is actually hardcoded
  - **Expected:** All flagged strings are hardcoded
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **C6.** Verify it didn't flag already translated text
  - **Expected:** No false positives
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **C7.** Verify it didn't flag variable names/code
  - **Expected:** Only user-facing text flagged
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **C8.** Check suggested keys make sense
  - **Expected:** Keys are logical and descriptive
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **C9.** Preview changes for a component
  - **Expected:** Before/after preview shown
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **C10.** Verify preview shows correct before/after
  - **Expected:** Accurate preview
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

### Replace Mode

- [ ] **C11.** Select specific changes to apply (use checkboxes)
  - **Expected:** Can select individual replacements
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **C12.** Click "Apply Selected"
  - **Expected:** Confirmation dialog appears
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **C13.** Verify confirmation dialog appears
  - **Expected:** Dialog shows number of changes
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **C14.** Confirm changes
  - **Expected:** Changes applied
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **C15.** Check components updated correctly
  - **Expected:** Files modified as expected
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **C16.** Verify translation JSON updated with new keys
  - **Expected:** en.json contains new keys
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **C17.** Run app - verify no errors
  - **Expected:** App runs without errors
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **C18.** Verify text still displays correctly
  - **Expected:** Text shows with translation keys
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **C19.** Check backup files created
  - **Expected:** Backup directory exists with files
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **C20.** Export report - verify JSON report downloads
  - **Expected:** Report file downloads
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

---

## D. Inline Translation Editor Tests

- [ ] **D1.** Navigate to `/admin/translations` → "Editor" tab
  - **Expected:** Editor interface loads
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **D2.** Select target language (Bengali)
  - **Expected:** Language selector works
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **D3.** Search for a translation key
  - **Expected:** Search filters results
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **D4.** Edit a translation
  - **Expected:** Can edit translation value
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **D5.** Save the translation
  - **Expected:** Save button works
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **D6.** Verify it saves successfully
  - **Expected:** Success message shown
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **D7.** Filter by "Missing Only"
  - **Expected:** Only missing translations shown
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **D8.** Filter by "Menu Only"
  - **Expected:** Only menu items shown
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **D9.** Verify missing translations are highlighted
  - **Expected:** Missing items have yellow background
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

---

## E. Automatic Language Detection

- [ ] **E1.** Clear localStorage
  - **Steps:** DevTools → Application → LocalStorage → Clear
  - **Expected:** localStorage cleared
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **E2.** Set browser language to Bengali
  - **Steps:** Browser settings → Language → Add Bengali → Set as primary
  - **Expected:** Browser language set
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **E3.** Open app in new incognito window
  - **Expected:** App loads
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **E4.** Verify app loads in Bengali automatically
  - **Expected:** Bengali selected by default
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **E5.** Manually switch to English
  - **Expected:** Language changes to English
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **E6.** Refresh page - should stay in English (respects manual choice)
  - **Expected:** English persists after refresh
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **E7.** Clear localStorage again
  - **Expected:** Cleared
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **E8.** Set browser language to unsupported language (e.g., French)
  - **Expected:** Browser language set
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **E9.** Verify app defaults to English
  - **Expected:** English selected (fallback)
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

---

## F. Edge Cases & Error Handling

### Missing Translations

- [ ] **F1.** Remove a translation key from Bengali file manually
  - **Expected:** File modified
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **F2.** Switch to Bengali
  - **Expected:** App switches to Bengali
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **F3.** Verify fallback text shows (English or key)
  - **Expected:** Missing key shows English or key name
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **F4.** Verify no console errors
  - **Expected:** No errors in console
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **F5.** Verify app doesn't crash
  - **Expected:** App continues to work
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

### Invalid Files

- [ ] **F6.** Try uploading a text file as translation
  - **Expected:** Error message shown
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **F7.** Verify clear error message
  - **Expected:** Helpful error message
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **F8.** Try uploading malformed JSON
  - **Expected:** Validation error
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **F9.** Verify helpful error message
  - **Expected:** Specific error about JSON format
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **F10.** Try uploading JSON with wrong structure
  - **Expected:** Validation error
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **F11.** Verify specific validation error shown
  - **Expected:** Details about what's wrong
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

---

## G. Browser Compatibility

Test on multiple browsers:

- [ ] **G1.** Chrome (latest)
  - Language switching: [ ] Pass [ ] Fail
  - Dropdown display: [ ] Pass [ ] Fail
  - Bengali characters: [ ] Pass [ ] Fail
  - localStorage: [ ] Pass [ ] Fail
  - Export/import: [ ] Pass [ ] Fail

- [ ] **G2.** Firefox (latest)
  - Language switching: [ ] Pass [ ] Fail
  - Dropdown display: [ ] Pass [ ] Fail
  - Bengali characters: [ ] Pass [ ] Fail
  - localStorage: [ ] Pass [ ] Fail
  - Export/import: [ ] Pass [ ] Fail

- [ ] **G3.** Safari (latest)
  - Language switching: [ ] Pass [ ] Fail
  - Dropdown display: [ ] Pass [ ] Fail
  - Bengali characters: [ ] Pass [ ] Fail
  - localStorage: [ ] Pass [ ] Fail
  - Export/import: [ ] Pass [ ] Fail

- [ ] **G4.** Edge (latest)
  - Language switching: [ ] Pass [ ] Fail
  - Dropdown display: [ ] Pass [ ] Fail
  - Bengali characters: [ ] Pass [ ] Fail
  - localStorage: [ ] Pass [ ] Fail
  - Export/import: [ ] Pass [ ] Fail

---

## H. Mobile Responsiveness

- [ ] **H1.** Test on mobile device (or Chrome DevTools mobile view)
  - **Expected:** App works on mobile
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **H2.** Verify language selector dropdown works on mobile
  - **Expected:** Dropdown opens and works
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **H3.** Verify dropdown doesn't go off-screen
  - **Expected:** Dropdown fits on screen
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **H4.** Verify touch interactions work
  - **Expected:** Can tap to select language
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **H5.** Check text doesn't overflow on small screens
  - **Expected:** Text wraps properly
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **H6.** Test in landscape and portrait
  - **Expected:** Works in both orientations
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

---

## I. Performance Tests

- [ ] **I1.** Measure time to switch languages (should be < 200ms)
  - **Actual time:** _______ ms
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **I2.** Check for memory leaks during repeated switching
  - **Expected:** No memory leaks
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **I3.** Verify no unnecessary re-renders
  - **Expected:** Efficient rendering
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

- [ ] **I4.** Test with 1000+ translation keys
  - **Expected:** Still performs well
  - **Actual:** _______________
  - **Status:** [ ] Pass [ ] Fail [ ] N/A
  - **Notes:** _______________

---

## Summary

**Total Tests:** _______  
**Passed:** _______  
**Failed:** _______  
**Blocked:** _______  
**Not Tested:** _______

**Critical Issues Found:**  
1. _______________
2. _______________
3. _______________

**Recommendations:**  
_______________  
_______________  
_______________

**Sign-off:**  
Tester: _______________ Date: _______  
Reviewer: _______________ Date: _______
