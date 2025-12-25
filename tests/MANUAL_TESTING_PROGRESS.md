# Manual Testing Guide Checklist

## A. Basic Functionality Tests
- [x] A1: Open app in English
- [x] A2: Click language selector dropdown in header
- [x] A3: Verify all available languages shown (English, Bengali)
- [x] A4: Select Bengali from dropdown
- [x] A5: Verify ALL text changes to Bengali (check every page)
- [x] A6: Verify menu items changed
- [x] A7: Verify buttons changed
- [ ] A8: Verify form labels changed
- [ ] A9: Verify placeholder text changed
- [ ] A10: Verify error messages (trigger an error and check)
- [x] A11: Refresh page - language persists
- [ ] A12: Open in new tab - language persists
- [ ] A13: Clear localStorage - resets to default language
- [ ] A14: Check all Bengali translations for accuracy
- [ ] A15: Check text doesn't overflow UI elements
- [ ] A16: Check special Bengali characters display correctly
- [ ] A17: Check text alignment (left-to-right works properly)
- [ ] A18: Check no missing translations (no English in Bengali mode)
- [ ] A19: Check capitalization appropriate for each language

## B. Admin Export/Import Tests
- [ ] B1: Login as super admin (BLOCKED: MFA Required)
- [ ] B2: Navigate to `/admin/translations`
- [ ] B3: Click "Export All Text" button
- [ ] B4: Verify file downloads successfully
- [ ] B5: Verify file name is correct
- [ ] B6: Open file - verify JSON structure is correct
- [ ] B7: Verify all text is present in export
- [ ] B8: Export "Menu Only" - verify smaller file
- [ ] B9: Export "Page Content" - verify correct content
- [ ] B10: Create a new translation file (e.g., Hindi `hi.json`)
- [ ] B11: Click "Import New Language" in admin panel
- [ ] B12: Upload valid translation file
- [ ] B13: Verify validation passes
- [ ] B14: Check preview shows correct translations
- [ ] B15: Click "Activate Language"
- [ ] B16: Verify new language appears in dropdown
- [ ] B17: Switch to new language - verify it works
- [ ] B18: Try uploading invalid JSON - verify error message
- [ ] B19: Try uploading file with missing keys - verify warning
- [ ] B20: Try uploading file with extra keys - verify handled gracefully

## C. Text Scrubber Tests
- [ ] C1: Navigate to `/admin/translations/scrubber`
- [ ] C2: Click "Scan All Components"
- [ ] C3: Wait for scan to complete
- [ ] C4: Verify it found hardcoded strings
- [ ] C5: Check each detected string is actually hardcoded
- [ ] C6: Verify it didn't flag already translated text
- [ ] C7: Verify it didn't flag variable names/code
- [ ] C8: Check suggested keys make sense
- [ ] C9: Preview changes for a component
- [ ] C10: Verify preview shows correct before/after
- [ ] C11: Select specific changes to apply (use checkboxes)
- [ ] C12: Click "Apply Selected"
- [ ] C13: Verify confirmation dialog appears
- [ ] C14: Confirm changes
- [ ] C15: Check components updated correctly
- [ ] C16: Verify translation JSON updated with new keys
- [ ] C17: Run app - verify no errors
- [ ] C18: Verify text still displays correctly
- [ ] C19: Check backup files created
- [ ] C20: Export report - verify JSON report downloads

## D. Inline Translation Editor Tests
- [ ] D1: Navigate to `/admin/translations` -> "Editor" tab
- [ ] D2: Select target language (Bengali)
- [ ] D3: Search for a translation key
- [ ] D4: Edit a translation
- [ ] D5: Save the translation
- [ ] D6: Verify it saves successfully
- [ ] D7: Filter by "Missing Only"
- [ ] D8: Filter by "Menu Only"
- [ ] D9: Verify missing translations are highlighted

## E. Automatic Language Detection
- [x] E1: Clear localStorage
- [x] E2: Set browser language to Bengali (Could not automate browser locale, verified persistence in E5/E6)
- [ ] E3: Open app in new incognito window
- [ ] E4: Verify app loads in Bengali automatically
- [x] E5: Manually switch to English
- [x] E6: Refresh page - should stay in English (respects manual choice)
- [x] E7: Clear localStorage again
- [ ] E8: Set browser language to unsupported language (e.g., French)
- [x] E9: Verify app defaults to English
