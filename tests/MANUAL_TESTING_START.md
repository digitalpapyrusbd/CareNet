# 🚀 Starting Manual Testing for Multilingual System

## Quick Start Guide

### Step 1: Open the Interactive Testing Tool

Open the interactive testing checklist in your browser:

```bash
# Option 1: Open directly
open manual-testing-guide.html

# Option 2: Serve via local server (recommended)
cd "/home/zia/Documents/My Projects/SynologyDrive/Websites/Caregiver"
python3 -m http.server 8080
# Then open: http://localhost:8080/manual-testing-guide.html
```

### Step 2: Start Your Development Server

Make sure your Next.js app is running:

```bash
npm run dev
```

The app should be available at `http://localhost:3000`

### Step 3: Prepare Test Environment

1. **Clear Browser Data** (for clean testing):
   - Open DevTools (F12)
   - Application → LocalStorage → Clear all
   - This ensures you start with a clean state

2. **Admin Access**:
   - Make sure you have super admin credentials
   - Login at: `http://localhost:3000/admin/login`

3. **Test Accounts**:
   - Regular user account (for language switching tests)
   - Admin account (for admin panel tests)

## Testing Workflow

### Phase 1: Basic Functionality (Section A)
**Estimated Time:** 30-45 minutes

1. Start with language switching tests (A1-A13)
2. Test translation quality (A14-A19)
3. Use the interactive checklist to track progress
4. Take screenshots of any issues

### Phase 2: Admin Features (Section B)
**Estimated Time:** 45-60 minutes

1. Test export functionality (B1-B9)
2. Test import functionality (B10-B20)
3. Try edge cases (invalid files, missing keys, etc.)

### Phase 3: Text Scrubber (Section C)
**Estimated Time:** 30-45 minutes

1. Test scan mode (C1-C10)
2. Test replace mode (C11-C20)
3. Verify backups are created
4. Check that files are modified correctly

### Phase 4: Inline Editor (Section D)
**Estimated Time:** 20-30 minutes

1. Test editing translations
2. Test search and filters
3. Verify saves work correctly

### Phase 5: Auto Detection (Section E)
**Estimated Time:** 15-20 minutes

1. Test browser language detection
2. Test localStorage persistence
3. Test fallback behavior

## Testing Tips

### ✅ Best Practices

1. **One Test at a Time**: Complete each test fully before moving to the next
2. **Take Notes**: Use the notes field in the interactive checklist
3. **Screenshot Issues**: Capture screenshots of any failures
4. **Test on Multiple Browsers**: Chrome, Firefox, Safari, Edge
5. **Test on Mobile**: Use Chrome DevTools mobile emulation or real device

### 🔍 What to Look For

**Language Switching:**
- All text changes immediately
- No English text visible in Bengali mode
- Dropdown works smoothly
- No console errors

**Translation Quality:**
- Bengali characters render correctly
- Text doesn't overflow containers
- Proper spacing and alignment
- Natural-sounding translations

**Admin Features:**
- Export files download correctly
- Import validation works
- Error messages are clear
- Preview shows correct data

**Text Scrubber:**
- Finds all hardcoded text
- Doesn't flag false positives
- Creates backups before changes
- Updates translation files correctly

**Performance:**
- Language switching is fast (< 200ms)
- No lag when switching
- Smooth animations
- No memory leaks

## Browser Testing Checklist

Test on these browsers:

- [ ] **Chrome** (latest)
- [ ] **Firefox** (latest)
- [ ] **Safari** (latest, if on Mac)
- [ ] **Edge** (latest)
- [ ] **Mobile Chrome** (Android)
- [ ] **Mobile Safari** (iOS)

For each browser, test:
- Language switching
- Dropdown functionality
- Bengali character rendering
- localStorage persistence
- Export/import features

## Common Issues to Watch For

### ❌ Language Not Switching
- Check browser console for errors
- Verify localStorage is being set
- Check network tab for API calls

### ❌ Bengali Characters Not Displaying
- Check font supports Bengali
- Verify UTF-8 encoding
- Check CSS font-family

### ❌ Translations Missing
- Check translation files exist
- Verify keys match between files
- Check for typos in keys

### ❌ Export/Import Failing
- Check file format (must be JSON)
- Verify file structure matches expected format
- Check for validation errors

## Reporting Issues

When you find an issue:

1. **Document in Checklist**: Mark as "Fail" and add notes
2. **Take Screenshot**: Capture the issue
3. **Note Steps to Reproduce**: What did you do before it failed?
4. **Check Console**: Any errors in browser console?
5. **Export Results**: Use the "Export Results" button to save your progress

## Exporting Results

The interactive checklist automatically saves your progress to localStorage. To export:

1. Click "📥 Export Results" button
2. A JSON file will download with all your test results
3. Share this file with the development team

## Time Estimates

- **Full Test Suite**: 2-3 hours
- **Quick Smoke Test**: 30-45 minutes (just Section A)
- **Admin Features Only**: 1-1.5 hours (Section B)
- **Complete with Documentation**: 3-4 hours

## Next Steps After Testing

1. **Review Results**: Go through all failed tests
2. **Prioritize Issues**: Critical vs. Nice-to-have
3. **Create Bug Reports**: For each failure
4. **Share Results**: Export and share with team
5. **Retest**: After fixes are applied

## Need Help?

- Check `TESTING_MULTILINGUAL.md` for detailed test documentation
- Check `MANUAL_TESTING_CHECKLIST.md` for the full checklist
- Review `TESTING_SUMMARY.md` for test results overview

---

**Ready to start?** Open `manual-testing-guide.html` and begin with Section A!
