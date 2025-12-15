# AI Navigation Assistant Guide

**Feature:** Voice and text-based navigation assistant for the CaregiverBD platform  
**Languages:** Bengali (বাংলা) and English  
**AI Model:** Google Gemini 2.0 Flash (Free Tier)

---

## Overview

The CaregiverBD platform includes an intelligent AI assistant that helps users navigate pages and fill forms using voice or text commands in Bengali and English.

---

## Setup Instructions

### 1. Get Gemini API Key (Free)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure Environment

Add to `.env.local`:

```bash
GEMINI_API_KEY="your-api-key-here"
NEXT_PUBLIC_AI_AGENT_ENABLED="true"
```

### 3. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 4. Test the Assistant

1. Run `npm run dev`
2. Open `http://localhost:3000`
3. Log in to your account
4. Look for the blue floating button in the bottom-right corner
5. Click to open the AI assistant

---

## Features

- **Voice Recognition** - Speak commands in Bengali or English
- **Text Input** - Type commands in the chat interface
- **Smart Navigation** - Navigate to any page with natural language
- **Form Filling** - Auto-fill forms with voice commands
- **Bengali Support** - Full support for Bengali language
- **Role-Based** - Respects user permissions
- **Scope Restricted** - Only works within the app (no external navigation)

---

## Supported Commands

### Navigation Commands

**Bengali:**
- "রোগী দেখাও" → Go to Patients page
- "পেমেন্ট পাতায় যান" → Go to Payments page
- "ড্যাশবোর্ড" → Go to Dashboard
- "নতুন রোগী যোগ করুন" → Go to Add Patient page
- "কাজ দেখাও" → Go to Jobs page
- "প্রোফাইল" → Go to Profile page

**English:**
- "show patients" → Go to Patients page
- "go to payments" → Go to Payments page
- "dashboard" → Go to Dashboard
- "add new patient" → Go to Add Patient page
- "show jobs" → Go to Jobs page
- "profile" → Go to Profile page

### Form Filling Commands

**Bengali:**
- "নাম লিখুন জন ডো" → Fill name field with "জন ডো"
- "বয়স ৬৫" → Fill age field with 65
- "ফোন নম্বর ০১৭১২৩৪৫৬৭৮" → Fill phone number

**English:**
- "fill name John Doe" → Fill name field with "John Doe"
- "age 65" → Fill age field with 65
- "phone number 01712345678" → Fill phone number

### Help Commands

- "help" / "সাহায্য" → Get help
- "yes" / "হ্যাঁ" → Confirm action
- "no" / "না" → Cancel action

---

## Usage Tips

### Voice Commands
- Speak clearly at normal pace
- Use simple, direct commands
- Wait for microphone indicator before speaking
- Grant microphone permission when prompted

### Text Commands
- Use natural language
- Be specific about what you want
- Use keywords like "show", "go to", "fill"

---

## API Rate Limits (Free Tier)

**Google Gemini Flash 2.0:**
- 15 requests per minute
- 1 million tokens per day
- More than enough for normal usage

---

## Privacy & Security

- Voice data is processed by your browser (not stored)
- Commands only processed within this application
- Cannot navigate to external websites
- Sensitive actions require confirmation
- All navigation respects user role permissions

---

## Troubleshooting

### Voice Not Working?
1. Check microphone permissions in browser settings
2. Use Chrome, Edge, or Safari (best support)
3. Try using text commands instead

### Commands Not Understood?
1. Try rephrasing your command
2. Use simpler, more direct language
3. Switch between Bengali and English

### API Key Errors?
1. Verify `GEMINI_API_KEY` in `.env.local`
2. Restart development server after changes
3. Check API key is valid in Google AI Studio

---

## Customization

### Add More Routes
Edit: `src/services/ai-agent/route-definitions.ts`

### Adjust Prompts
Edit: `src/services/ai-agent/prompts.ts`

### Change Configuration
Edit: `src/services/ai-agent/config.ts`

### Customize UI
Edit: `src/components/ai-assistant/AIAssistant.tsx`

---

## Integration

To add the AI Assistant to a page:

```tsx
'use client';

import { AIAssistant } from '@/components/ai-assistant/AIAssistant';

export default function YourPage() {
  return (
    <div>
      <h1>Your Page Content</h1>
      <AIAssistant userRole="GUARDIAN" language="bn" />
    </div>
  );
}
```

---

## Performance Targets

- Voice recognition: < 500ms
- Intent classification: < 1000ms
- Navigation: < 200ms
- Total response: < 2 seconds

---

*Last Updated: December 2025*

