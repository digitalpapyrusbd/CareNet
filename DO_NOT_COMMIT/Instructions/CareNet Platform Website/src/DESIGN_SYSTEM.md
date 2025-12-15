# CareNet Design System

**Version:** 2.0  
**Style:** Sophisticated Glassmorphic Finance App  
**Date:** December 2024

---

## 🎨 **Background System - AUTO-APPLIED**

### ✅ Automatically Applied to ALL Pages
The conic gradient background with blur circles is **automatically applied** via `/App.tsx` to the entire application. **You don't need to add background styles to individual pages!**

### Conic Gradient with Triple Overlays
All pages automatically inherit this background system from `/App.tsx`:

```css
/* Layer 1: Conic Gradient Base */
conic-gradient(from 180deg at 0% 10%, 
  #EACEDF 0deg, 
  #DBD2FC 118.4deg, 
  #D9DFFD 152.38deg, 
  #7B7EEC 360deg)

/* Layer 2: White Overlay */
linear-gradient(239.26deg, rgba(255, 255, 255, 0.2) -3.01%, rgba(255, 255, 255, 0) 104.55%)

/* Layer 3: Pink Overlay */
linear-gradient(139.89deg, #F8C2CA -21.02%, rgba(255, 255, 255, 0) 77.14%)
```

### Decorative Blur Circles (Auto-Applied)
**7 blur circles** of varying sizes scattered throughout - **automatically rendered**:
- **2226px** - Top left (largest)
- **1668px** - Bottom left
- **1278px** - Center right
- **970px** - Center bottom
- **660px** - Bottom center with gradient
- **122px** - Bottom right (decorative)
- **64px** - Bottom left (decorative)

### ⚠️ IMPORTANT: Don't Add Background to Components
**DO NOT** add `bg-background` or any background classes to your page components. The background is already applied globally!

```tsx
// ❌ WRONG - Don't do this
<div className="min-h-screen bg-background">

// ✅ CORRECT - Background is already applied
<div className="min-h-screen">
```

---

## 🎯 **Color Tokens**

Use these CSS variables throughout your components:

### Core Text Colors (ALWAYS VISIBLE)
```css
--foreground: #535353        /* Main text color - DARK GRAY (always visible) */
--muted-foreground: #848484  /* Secondary text - MEDIUM GRAY */
```

**⚠️ IMPORTANT:** All text uses **dark gray (#535353)** by default to ensure readability on light glassmorphic backgrounds. This is enforced globally in `globals.css`.

### Financial Colors
```css
--income-color: #0E8A8E      /* Teal for income/positive */
--expense-color: #FF6666     /* Red for expenses/negative */
```

### Card Colors
```css
--card: rgba(255, 255, 255, 0.45)           /* Standard card */
--secondary: rgba(255, 255, 255, 0.61)      /* Notification badges */
--popover: rgba(255, 255, 255, 0.8)         /* Overlays */
```

### Accent Colors
```css
--primary: #8082ED           /* Purple */
--accent: #DB869A            /* Pink */
--destructive: #FF6666       /* Red */
```

### ⚠️ Text Readability Guidelines

**DO:**
- ✅ Use inline styles for specific color needs: `style={{ color: '#535353' }}`
- ✅ Text on white/light backgrounds: Use dark gray `#535353`
- ✅ Text on colored gradient backgrounds: Use white or `.text-white-gradient`
- ✅ Links/CTAs: Use pink `#DB869A` or purple `#8082ED`

**DON'T:**
- ❌ Use `text-foreground` or `text-muted-foreground` classes (not enforced properly)
- ❌ Rely on default text color without checking visibility
- ❌ Use light colors on light backgrounds

---

## 📦 **Component Classes**

### Cards

#### Standard Finance Card
```tsx
<div className="finance-card p-6">
  {/* Auto includes: blur(62px), border-radius: 14px, shadow */}
</div>
```

#### Gradient Cards (for stats, features)
```tsx
{/* Pink Card */}
<div className="gradient-pink-card p-6">...</div>

{/* Purple Card */}
<div className="gradient-purple-card p-6">...</div>

{/* Blue Card */}
<div className="gradient-blue-card p-6">...</div>

{/* Orange Card */}
<div className="gradient-orange-card p-6">...</div>

{/* Green Card */}
<div className="gradient-green-card p-6">...</div>

{/* Yellow Card */}
<div className="gradient-yellow-card p-6">...</div>
```

### Text Styles

#### White Gradient Text (for colored backgrounds)
```tsx
<h2 className="text-white-gradient">$21,000</h2>
```

#### Income/Expense Colors
```tsx
<span style={{ color: 'var(--income-color)' }}>+$2,000</span>
<span style={{ color: 'var(--expense-color)' }}>-$120</span>
```

### Buttons

#### Floating Action Button (FAB)
```tsx
<button className="fab-button">
  <DollarSign className="w-8 h-8 text-white" />
</button>
```

#### Gradient Icon Button (small, white gradient background)
```tsx
<div className="gradient-icon-button">
  <Plus className="w-5 h-5 text-white" />
</div>
```

### Navigation

#### Bottom Navigation
```tsx
<div className="bottom-nav-glass">
  {/* Auto includes: frosted glass, blur(65px), shadow */}
</div>
```

#### Notification Badge
```tsx
<div className="notification-badge">
  <Bell className="w-6 h-6" />
</div>
```

### Lists

#### Transaction Item
```tsx
<div className="transaction-item">
  <div className="flex justify-between items-center">
    <div>
      <h4>Saber Convenience Store</h4>
      <p className="text-sm text-muted-foreground">22 September 2021</p>
    </div>
    <span style={{ color: 'var(--expense-color)' }}>$22</span>
  </div>
</div>
```

#### Stat Card
```tsx
<div className="stat-card p-4">
  <div className="gradient-icon-button mb-2">
    <TrendingUp className="w-5 h-5 text-white" />
  </div>
  <p className="text-white-gradient text-sm">Income</p>
  <h3 className="text-white-gradient">$21,000</h3>
</div>
```

---

## 📐 **Spacing & Sizing**

### Standard Spacing
- **Padding**: `p-4` (16px), `p-6` (24px)
- **Margins**: `mb-4` (16px), `mb-6` (24px)
- **Gaps**: `gap-4` (16px), `gap-6` (24px)

### Border Radius
- **Cards**: `14px` (applied automatically via classes)
- **Small elements**: `4.75px` (gradient-icon-button)
- **Buttons**: `12px` (standard buttons)

### Blur Values
- **Heavy**: `blur(155px)` - Main container
- **Standard**: `blur(62px)` - Cards
- **Light**: `blur(37px)` - Gradient cards
- **Decorative**: `blur(11px)` - Background circles

---

## 🎬 **Animations & Transitions**

All interactive elements include smooth transitions:

```css
transition: all 0.3s ease;
```

### Hover Effects
- Cards: `translateY(-2px)` + enhanced shadow
- FAB: `scale(1.05)` + enhanced shadow

---

## 🧩 **Usage Example**

### Complete Dashboard Card
```tsx
export function DashboardCard() {
  return (
    <div className="finance-card p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-foreground">Account Balance</h3>
        <div className="notification-badge">
          <Bell className="w-5 h-5" />
        </div>
      </div>

      {/* Balance */}
      <div className="gradient-pink-card p-4 rounded-[14px]">
        <p className="text-white opacity-80">Lasso Kayne</p>
        <p className="text-white text-sm mt-1">4551 5667 8886 7775</p>
        <p className="text-white text-xs mt-2 opacity-70">Account Balance</p>
        <h2 className="text-white mt-1">$121,000</h2>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="stat-card p-4">
          <div className="gradient-icon-button mb-2">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <p className="text-white-gradient text-sm">Income</p>
          <h3 className="text-white-gradient">$21,000</h3>
        </div>
        
        <div className="gradient-pink-card p-4 rounded-[14px]">
          <div className="gradient-icon-button mb-2">
            <TrendingDown className="w-5 h-5 text-white" />
          </div>
          <p className="text-white-gradient text-sm">Expenditure</p>
          <h3 className="text-white-gradient">$11,000</h3>
        </div>
      </div>

      {/* Transactions */}
      <div className="space-y-3">
        <h4 className="text-foreground">Transactions</h4>
        
        <div className="transaction-item">
          <div className="flex justify-between items-center">
            <div>
              <h5 className="text-foreground">Saber Convenience Store</h5>
              <p className="text-xs text-muted-foreground">22 September 2021</p>
            </div>
            <span style={{ color: 'var(--expense-color)' }}>$22</span>
          </div>
        </div>
        
        <div className="transaction-item">
          <div className="flex justify-between items-center">
            <div>
              <h5 className="text-foreground">Salary Payment</h5>
              <p className="text-xs text-muted-foreground">20 September 2021</p>
            </div>
            <span style={{ color: 'var(--income-color)' }}>+$2,000</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 📱 **Responsive Design**

All components are mobile-first:
- Primary width: **360px** (mobile)
- Max width: **445px** (phone mockup)
- Desktop: Scales proportionally

---

## ⚡ **Performance Notes**

- Backdrop filters have heavy GPU usage - use sparingly
- Blur circles are decorative only - `pointer-events: none`
- All animations use CSS transforms for 60fps
- Glass container is applied once at root level

---

## 🔄 **Updating The System**

To modify the design system globally:

1. **Colors**: Edit `/styles/globals.css` `:root` section
2. **Cards**: Edit utility classes in `/styles/globals.css` `@layer utilities`
3. **Background**: Edit `App.tsx` background layers and blur circles

All pages will automatically inherit changes!

---

*End of Design System Documentation - v2.0*