# Follow-up Prompt: Add Text Scrubber, Inline Editor & Auto-Detection

## Context
I have already implemented the basic multilingual system with export/import functionality. Now I need to add the advanced features: Text Scrubber, Inline Translation Editor, and Automatic Language Detection.

---

## Feature 1: Text Scrubber Tool (PRIORITY)

### Purpose
Automatically find and replace ALL hardcoded text in React components with translation keys.

### Requirements

**Super Admin Interface:**
- New page/section: **"Text Scrubber Tool"**
- Two modes:
  1. **Scan Mode (Dry Run)** - Preview changes without applying
  2. **Replace Mode** - Actually modify the files

**Scan Mode UI:**
```
┌─────────────────────────────────────────────┐
│  Text Scrubber                              │
├─────────────────────────────────────────────┤
│  [Scan All Components] [Replace All]        │
│                                             │
│  Status: Found 47 hardcoded strings         │
│  in 12 components                           │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ Component: HomePage.jsx              │   │
│  │ Line 23: <h1>CareNet</h1>           │   │
│  │ Will replace with: {t('home.title')}│   │
│  │ [✓] Include  [ ] Skip                │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ Component: LoginPage.jsx             │   │
│  │ Line 45: placeholder="Enter email"   │   │
│  │ Will replace with:                   │   │
│  │   placeholder={t('form.emailPlaceholder')}│
│  │ [✓] Include  [ ] Skip                │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [Preview Changes] [Apply Selected]         │
└─────────────────────────────────────────────┘
```

**Features:**
1. **Detection Logic:**
   - Find text in JSX: `<div>Text</div>`, `<button>Click</button>`
   - Find text in attributes: `placeholder="..."`, `title="..."`, `alt="..."`
   - Ignore: variable names, imports, function names, console.logs, comments
   
2. **Smart Key Generation:**
   - Analyze component name and text context
   - Generate logical keys: `auth.loginButton`, `home.description`
   - Avoid duplicates (if "Login" appears twice, use `auth.loginButton` and `nav.login`)

3. **Auto-Code Modification:**
   - Add `import { useTranslation } from '@/hooks/useTranslation';` if missing
   - Add `const { t } = useTranslation();` at component start
   - Replace strings with `{t('key')}`
   - Update the translation JSON file with new keys

4. **Safety Features:**
   - Create backup of files before modifying
   - Show diff/preview before applying
   - Allow selective application (checkbox per change)
   - Generate a rollback script in case of issues

5. **Export Report:**
   - Download CSV/JSON of all changes made
   - Shows: Component → Old Text → New Key → Status

---

## Feature 2: Inline Translation Editor

### Purpose
Allow super admin to edit translations directly in the dashboard without downloading/uploading files.

### Requirements

**Dashboard Interface:**
```
┌─────────────────────────────────────────────────┐
│  Translation Manager                            │
├─────────────────────────────────────────────────┤
│  Language: [English ▼] [Bengali ▼]             │
│  [+ Add New Language]                           │
│                                                 │
│  Search: [________________] 🔍                  │
│  Filter: [All ▼] [Menu Only] [Missing Only]    │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ Key: home.title                           │ │
│  │ English:  CareNet                         │ │
│  │ Bengali:  [কেয়ারনেট__________] ✏️ [Save] │ │
│  │ Used in: HomePage.jsx                     │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ Key: home.tagline                         │ │
│  │ English:  Quality care, connected         │ │
│  │ Bengali:  [মানসম্মত যত্ন, সংযুক্ত_] ✏️ [Save]│ │
│  │ Used in: HomePage.jsx                     │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  [Export Current Language] [Save All Changes]  │
└─────────────────────────────────────────────────┘
```

**Features:**
1. **Side-by-side editing:**
   - Show English (reference) and target language
   - Edit one or multiple languages at once
   - Auto-save or manual save options

2. **Search & Filter:**
   - Search by key or text content
   - Filter by: Missing translations, Menu items, Errors, etc.
   - Sort by: Recently added, Alphabetical, Component

3. **Validation:**
   - Character count (warn if translation much longer/shorter than original)
   - Check for missing interpolation variables (e.g., `{name}`)
   - Preview in actual UI (optional)

4. **Bulk Operations:**
   - Select multiple translations
   - Copy from one language to another
   - Mark as "needs review"
   - Delete unused translations

5. **Real-time Updates:**
   - Changes save to JSON files immediately
   - Optional: Show live preview in a test page

---

## Feature 3: Automatic Language Detection

### Purpose
Automatically set user's language based on browser settings on first visit.

### Requirements

**Detection Logic:**
```javascript
// On first visit (no localStorage preference)
1. Check browser language (navigator.language)
2. Match to available languages:
   - "en", "en-US", "en-GB" → English
   - "bn", "bn-BD" → Bengali
3. If match found → Set that language
4. If no match → Default to English
5. Save to localStorage
```

**User Experience:**
- Silent detection (no popup)
- User can override anytime via language selector
- Once user manually selects, respect their choice (don't auto-switch again)

**Settings Panel:**
```
┌─────────────────────────────────────┐
│  Language Preferences                │
├─────────────────────────────────────┤
│  Current Language: [English ▼]      │
│                                     │
│  ☑ Auto-detect language on first visit│
│                                     │
│  Your browser language: English (en)│
└─────────────────────────────────────┘
```

**Edge Cases:**
- Browser language not available → Use default (English)
- Multiple browser languages → Use primary language
- Regional variants (en-US, en-GB) → Match to base language (en)

---

## Implementation Priority

1. **Text Scrubber** (Most Important)
   - This will save tons of manual work
   - Should be built as a one-time migration tool + ongoing validator

2. **Inline Editor** (Very Useful)
   - Makes translation management easier
   - No need to download/upload for small changes

3. **Auto-Detection** (Nice to Have)
   - Improves UX slightly
   - Quick to implement

---

## Technical Requirements

**Text Scrubber:**
- Should work with React/JSX syntax
- Handle TypeScript if used
- Use AST parsing (maybe `@babel/parser` or similar)
- Safely modify files without breaking formatting

**Inline Editor:**
- Real-time save to JSON files
- Optimistic UI updates
- Undo functionality

**Auto-Detection:**
- Use `navigator.language` or `navigator.languages`
- Fallback chain: Browser → IP-based geolocation → Default
- Respect user privacy (no tracking, just language detection)

---

## Output Expected

For each feature, provide:
1. Complete component code
2. Integration instructions
3. Testing considerations
4. Error handling

Please implement these features one by one, starting with the **Text Scrubber Tool** as it's the highest priority.