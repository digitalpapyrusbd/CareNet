# Cursor Prompt: Add Multilingual System with Text Extraction & Translation Workflow

## Context
I have a React web application called CareNet (a caregiver platform for Bangladesh) that currently has hardcoded English text. I need a system that automatically detects all hardcoded text, allows export for translation, and easy import to enable new languages.

## Core Requirements

### 1. Automatic Text Detection & Extraction
Create a script/tool that:
- **Scans all React components** for hardcoded text strings
- Identifies text in JSX elements: `<h1>Text</h1>`, `<button>Click me</button>`
- Identifies text in attributes: `placeholder="Enter name"`, `title="Help"`, `alt="Logo"`
- Ignores code variables, function names, and technical strings
- Categorizes text by:
  - **Page/Component** (e.g., HomePage, LoginPage, ProfilePage)
  - **Type** (menu items, buttons, labels, descriptions, errors)
- Generates a unique key for each text string (e.g., `home.title`, `auth.loginButton`)

### 2. Super Admin Export System
In the super admin settings panel, add:

**Export Options:**
- **Button: "Export All Text for Translation"**
  - Generates a single JSON file with ALL text in the app
  - Structure:
  ```json
  {
    "metadata": {
      "languageCode": "en",
      "languageName": "English",
      "exportDate": "2024-12-17",
      "version": "1.0"
    },
    "translations": {
      "common": {
        "login": "Login",
        "register": "Register",
        "home": "Home"
      },
      "home": {
        "title": "CareNet",
        "tagline": "Quality care, connected",
        "description": "Bangladesh's trusted platform..."
      },
      "navigation": {
        "home": "Home",
        "profile": "Profile",
        "assistant": "Assistant",
        "search": "Search",
        "back": "Back"
      }
    }
  }
  ```

**Alternative: Split Export (Your Suggestion)**
- **Button: "Export Menu Text Only"** → Smaller file with just navigation/menu items
- **Button: "Export All Page Content"** → All other text (headings, paragraphs, buttons, forms)
- This makes translation more manageable for translators

### 3. Import & Activation System
**Import Interface:**
- **"Import New Language"** button
- File upload (accepts .json)
- Validation checks:
  - Verify JSON structure matches export format
  - Check all required keys exist
  - Warn about missing translations
- Preview screen showing:
  - Language name
  - Number of translations
  - Sample translations
  - Missing keys (if any)
- **"Activate Language"** button to make it live

### 4. Text Scrubber & Auto-Replacement
**Critical Feature:**
Create a development tool that:
- Scans components and **automatically refactors** hardcoded text
- Replaces: `<h1>CareNet</h1>` with `<h1>{t('home.title')}</h1>`
- Replaces: `placeholder="Enter name"` with `placeholder={t('form.namePlaceholder')}`
- Adds `const { t } = useTranslation();` to components
- Generates a report of all changes made
- **Option to run in "dry-run" mode** to preview changes before applying

**Validation Tool:**
- Button: **"Check for Untranslated Text"**
- Scans all components for remaining hardcoded strings
- Generates report with:
  - Component name
  - Line number
  - Hardcoded text found
  - Suggested translation key

### 5. Language Switching UI
**User-Facing Interface:**
- Dropdown menu in header/navbar
- Shows current language with flag/icon (🇬🇧 English / 🇧🇩 বাংলা)
- Lists all activated languages
- Smooth transition (no page reload)
- Saves preference to localStorage

**Dropdown Design:**
```
┌─────────────────┐
│ 🇬🇧 English    ✓│
│ 🇧🇩 বাংলা       │
│ + Add Language  │ ← Takes admin to import page
└─────────────────┘
```

### 6. Super Admin Dashboard Features
**Translation Management Panel:**
- List of all active languages
- For each language:
  - Language name and code
  - Completion percentage (e.g., "95% translated")
  - Last updated date
  - Edit button (opens inline editor)
  - Export button (download that language's JSON)
  - Delete button
  - Set as default button

**Inline Editor (Optional but Useful):**
- Search translations by key or text
- Edit translations directly in the UI
- Save updates
- Export after editing

## Implementation Details

### Translation System Architecture
```
/src
  /locales
    /en
      translations.json
    /bn
      translations.json
  /contexts
    LanguageContext.jsx
  /hooks
    useTranslation.js
  /utils
    textExtractor.js        ← Scrubs components
    translationValidator.js ← Checks for missing translations
  /components
    LanguageSelector.jsx    ← User-facing dropdown
  /admin
    /translation
      TranslationDashboard.jsx
      ExportPanel.jsx
      ImportPanel.jsx
      TextScrubber.jsx
```

### Text Extraction Rules
**Include:**
- Visible text in JSX elements
- Button labels
- Form labels and placeholders
- Error messages
- Tooltips and help text
- Alt text for images (for accessibility)

**Exclude:**
- Variable names
- Function names
- API endpoints
- className values
- CSS/style values
- Console logs
- Comments

### Key Generation Strategy
Auto-generate keys using this pattern:
- `[section].[type].[descriptor]`
- Examples:
  - `home.heading.title` → "CareNet"
  - `auth.button.login` → "Login"
  - `form.placeholder.email` → "Enter your email"
  - `navigation.menu.home` → "Home"
  - `error.message.invalidEmail` → "Please enter a valid email"

## Specific Content for CareNet

### Initial Translations Needed (English to Bengali):

**Navigation:**
- Home → হোম
- Profile → প্রোফাইল
- Assistant → সহায়ক
- Search → খুঁজুন
- Back → ফিরে যান

**Authentication:**
- Login → লগইন
- Register → নিবন্ধন

**Home Page:**
- CareNet → কেয়ারনেট
- Quality care, connected → মানসম্মত যত্ন, সংযুক্ত
- Bangladesh's trusted platform for connecting families with verified caregivers and professional agencies → পরিবারগুলিকে যাচাইকৃত পরিচর্যাকারী এবং পেশাদার সংস্থার সাথে সংযুক্ত করার জন্য বাংলাদেশের বিশ্বস্ত প্ল্যাটফর্ম

## Output Expected

### Phase 1: Text Extraction Tool
1. Script that scans all components
2. Generates master English JSON file
3. Report showing all extracted text organized by component

### Phase 2: Translation System
1. Language Context and hook implementation
2. Language selector component with dropdown UI
3. Fallback handling for missing translations

### Phase 3: Super Admin Interface
1. Export panel with download buttons (combined or split)
2. Import panel with file upload and validation
3. Translation dashboard showing all languages
4. Text scrubber tool with dry-run mode

### Phase 4: Auto-Refactoring
1. Tool that automatically replaces hardcoded text with `t()` calls
2. Validation tool that checks for remaining hardcoded strings
3. Report generator

### Phase 5: Documentation
1. User guide for translators (how to translate the JSON file)
2. Admin guide (how to export/import)
3. Developer guide (how to add new text going forward)

## Technical Preferences
- React with hooks (TypeScript optional)
- Context API for state management
- No external i18n libraries if possible (lightweight solution)
- Works offline after initial load
- Mobile-responsive language selector

## Success Criteria
✅ Super admin can export all text in one click
✅ Translator receives clean JSON file
✅ Super admin can import translated file easily
✅ New language appears in dropdown immediately
✅ All text (including menus) updates when language switches
✅ System validates translations before activation
✅ Tool can detect and report any remaining hardcoded text
✅ Future developers can easily add new text that gets auto-extracted

## Workflow Example
1. Super admin clicks "Export All Text"
2. Downloads `en-master.json`
3. Sends to Bengali translator
4. Translator edits file → saves as `bn.json`
5. Super admin uploads `bn.json`
6. System validates and previews
7. Super admin clicks "Activate"
8. Bengali appears in language dropdown
9. Users can now switch to Bengali

Please provide a complete implementation that makes this workflow seamless and foolproof.