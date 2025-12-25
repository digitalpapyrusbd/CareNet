# 🎯 Quick Reference Guide for Manual Testing

## 🚀 Quick Start Commands

```bash
# Option 1: Use the startup script
./START_TESTING.sh

# Option 2: Manual start
npm run dev                    # Start dev server
xdg-open manual-testing-guide.html  # Open checklist (Linux)
open manual-testing-guide.html     # Open checklist (Mac)
```

## 📍 Key URLs to Test

| Feature | URL | What to Test |
|---------|-----|--------------|
| Landing Page | `http://localhost:3000/` | Language switcher in header |
| Login Page | `http://localhost:3000/auth/login` | Form labels, buttons |
| Admin Translations | `http://localhost:3000/admin/translations` | Export/Import, Editor |
| Text Scrubber | `http://localhost:3000/admin/translations/scrubber` | Scan & Replace |

## ✅ Testing Priority Order

### 🔴 Critical (Do First - 30 min)
1. **A1-A4**: Basic language switching
2. **A5**: Verify ALL text changes (spot check 3-4 pages)
3. **A11**: Refresh page - language persists
4. **A18**: No missing translations

### 🟡 Important (Do Next - 45 min)
5. **B1-B9**: Export functionality
6. **B10-B17**: Import functionality
7. **C1-C10**: Text Scrubber scan mode
8. **D1-D6**: Inline Editor basic functions

### 🟢 Nice to Have (If Time Permits - 30 min)
9. **E1-E9**: Auto language detection
10. **C11-C20**: Text Scrubber replace mode
11. Browser compatibility tests

## 🎯 Test Execution Tips

### For Each Test:
1. ✅ **Read** the test description
2. ✅ **Perform** the action
3. ✅ **Verify** the expected result
4. ✅ **Click** Pass/Fail/N/A in checklist
5. ✅ **Add notes** if anything unexpected

### Common Test Scenarios:

**Language Switching Test:**
```
1. Open app → Should be in English
2. Click language selector (top right)
3. Select "বাংলা (Bengali)"
4. Verify ALL text changes immediately
5. Check: Header, buttons, labels, placeholders
```

**Export Test:**
```
1. Login as admin
2. Go to /admin/translations
3. Click "Export All Text"
4. File downloads
5. Open file → Should be valid JSON
```

**Import Test:**
```
1. Create test translation file (hi.json)
2. Go to /admin/translations → Import tab
3. Upload file
4. Verify validation passes
5. Activate language
6. Check language appears in selector
```

## 🔍 What to Look For

### ✅ Good Signs:
- Language switches instantly (< 200ms)
- All text changes (no English left)
- Bengali characters render correctly
- Dropdown works smoothly
- No console errors
- localStorage persists

### ❌ Red Flags:
- English text visible in Bengali mode
- Bengali characters show as boxes
- Language doesn't persist after refresh
- Console errors
- Slow switching (> 500ms)
- Dropdown doesn't open/close

## 📸 Screenshot Checklist

Take screenshots of:
- [ ] Language selector dropdown open
- [ ] App in Bengali mode (full page)
- [ ] Export file preview
- [ ] Import validation success
- [ ] Text Scrubber scan results
- [ ] Inline Editor interface
- [ ] Any errors or issues

## 🐛 Common Issues & Quick Fixes

| Issue | Quick Check |
|-------|-------------|
| Language not switching | Check browser console, verify localStorage |
| Bengali not displaying | Check font, verify UTF-8 encoding |
| Export not working | Check file permissions, verify JSON structure |
| Import failing | Check file format, verify validation errors |
| Dropdown not opening | Check z-index, verify click events |

## ⏱️ Time Estimates

- **Quick Smoke Test**: 15-20 min (A1-A5, A11, A18)
- **Basic Functionality**: 30-45 min (All of Section A)
- **Admin Features**: 45-60 min (Section B)
- **Full Test Suite**: 2-3 hours (All sections)

## 📊 Progress Tracking

The interactive checklist shows:
- **Total Tests**: All test cases
- **Completed**: Tests with Pass/Fail/N/A
- **Passed**: Green checkmarks
- **Failed**: Red X marks
- **Progress %**: Completion percentage

## 💾 Saving Progress

- ✅ Progress auto-saves to browser localStorage
- ✅ Click "Export Results" to download JSON
- ✅ JSON file can be shared with team
- ✅ Can resume testing later (progress persists)

## 🎓 Testing Best Practices

1. **One test at a time** - Don't skip ahead
2. **Take notes** - Document any issues
3. **Screenshot issues** - Visual proof helps
4. **Test systematically** - Follow the order
5. **Be thorough** - Don't rush

## 🔄 After Testing

1. **Review failures** - What went wrong?
2. **Export results** - Save your work
3. **Create bug reports** - For each failure
4. **Share findings** - With development team
5. **Retest after fixes** - Verify issues resolved

---

**Ready?** Open `manual-testing-guide.html` and click "Pass" on your first test! 🚀
