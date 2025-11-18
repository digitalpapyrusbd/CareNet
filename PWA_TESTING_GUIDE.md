# PWA Installation & Testing Guide

## Prerequisites

Before testing, ensure:
- ✅ Application is running on HTTPS (required for PWA)
- ✅ Service worker is registered (`/sw.js` accessible)
- ✅ Manifest is linked in HTML (`/manifest.json` accessible)
- ✅ Icons are available in `/public/icons/` directory

## Icon Setup Required

**Create the following icon files in `/public/icons/`:**

```bash
# Icon sizes needed:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png
```

You can generate these from a single high-res logo using:
- [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
- ImageMagick: `convert logo.png -resize 512x512 icon-512x512.png`

---

## PWA-004: Android Installation Testing

### Step 1: Deploy to HTTPS
```bash
# Option A: Deploy to Vercel/Netlify
npm run build
# Follow deployment instructions

# Option B: Local HTTPS testing
npm install -g local-ssl-proxy
npm run dev
# In another terminal:
local-ssl-proxy --source 3001 --target 3000
# Access at https://localhost:3001
```

### Step 2: Test in Chrome (Android)

1. **Open the app in Chrome:**
   - Navigate to `https://your-domain.com` (or `https://localhost:3001`)
   - Wait for page to fully load

2. **Verify Install Prompt:**
   - Chrome should show "Add to Home Screen" banner automatically
   - If not, tap Menu (⋮) → "Add to Home Screen"
   - Alternative: "Install app" prompt in address bar

3. **Install the PWA:**
   - Tap "Add" or "Install"
   - Choose app name (or use default: "Care247 Caregiver")
   - App icon appears on home screen

4. **Launch Standalone Mode:**
   - Tap the home screen icon
   - Verify app opens WITHOUT browser UI (no address bar/tabs)
   - Check status bar shows theme color (#00AEEF)

### Step 3: Test Offline Functionality

1. **Enable Airplane Mode:**
   - Settings → Network → Airplane Mode ON
   - Or swipe down → tap Airplane icon

2. **Test Cached Routes:**
   - Open the installed PWA
   - Navigate to: Dashboard, Jobs, Earnings, Profile
   - Should load from cache (if visited while online)

3. **Test Offline Fallback:**
   - Try navigating to unvisited route
   - Should show `/offline` page with retry button

4. **Test Background Sync:**
   - While offline, create a care log entry
   - Should save to IndexedDB queue
   - Re-enable network → check if sync completes

### Step 4: Test PWA Features

**Bottom Navigation:**
- ✅ Navigation visible at bottom on mobile
- ✅ Active tab highlighted in cyan
- ✅ Haptic feedback on tap (vibration)

**GPS Geolocation:**
- Grant location permission when prompted
- Test check-in location verification
- Verify accuracy within 100m radius

**Camera Capture:**
- Grant camera permission when prompted
- Test taking check-in selfie
- Verify image compression (<2MB)
- Check preview before send

**Push Notifications:**
- Grant notification permission
- Test receiving job notifications
- Verify vibration pattern works

### Step 5: Chrome DevTools Check

```bash
# On desktop Chrome, inspect the PWA:
1. Open Chrome DevTools (F12)
2. Go to "Application" tab
3. Check:
   - Manifest: All fields populated correctly
   - Service Workers: Active and running
   - Cache Storage: "caregiver-v1" and "caregiver-api-v1" present
   - IndexedDB: "CaregiverDB" exists
```

**Expected Results:**
- ✅ Manifest valid, no warnings
- ✅ Service worker active
- ✅ Install prompt shows
- ✅ Offline functionality works
- ✅ Background sync queues pending actions

---

## PWA-005: iOS Installation Testing

### Step 1: Deploy to HTTPS
Same as Android (see above). iOS requires HTTPS for PWA features.

### Step 2: Test in Safari (iOS)

1. **Open the app in Safari:**
   - Navigate to `https://your-domain.com`
   - **Important:** Must use Safari (not Chrome/Firefox on iOS)

2. **Add to Home Screen:**
   - Tap Share button (box with arrow)
   - Scroll down → tap "Add to Home Screen"
   - Edit name if desired → tap "Add"
   - App icon appears on home screen

3. **Launch Web Clip:**
   - Tap the home screen icon
   - App opens in standalone mode (no Safari UI)

### Step 3: Test iOS Limitations

**What Works:**
- ✅ Home screen icon
- ✅ Standalone mode (no browser UI)
- ✅ Basic offline caching (limited)
- ✅ GPS geolocation
- ✅ Camera access

**Known Limitations:**
- ❌ No install prompt (manual only)
- ❌ Limited service worker (8MB cache max, cleared after 2 weeks)
- ❌ No background sync
- ❌ Push notifications require native app
- ❌ No "Add to Home Screen" shortcut

### Step 4: Test Core Features

1. **Bottom Navigation:**
   - Should work normally
   - Haptic feedback may not work (iOS Safari limitation)

2. **GPS Check-in:**
   - Grant location permission
   - Test check-in location verification
   - Should work same as Android

3. **Camera Capture:**
   - Grant camera permission
   - Take check-in selfie
   - Verify image compression works

4. **Offline Mode:**
   - Enable Airplane Mode
   - Reopen PWA from home screen
   - Previously visited pages should load from cache
   - Background sync will NOT work (queue items until online)

### Step 5: Safari Web Inspector (macOS)

```bash
# On Mac, inspect iOS PWA:
1. Connect iPhone via USB
2. iPhone: Settings → Safari → Advanced → Web Inspector: ON
3. Mac: Safari → Develop → [Your iPhone] → [Your PWA]
4. Check Console for errors
```

**Expected Results:**
- ✅ App installs to home screen
- ✅ Opens in standalone mode
- ✅ Basic offline caching works
- ⚠️ Background sync disabled
- ⚠️ Push notifications unavailable

---

## Testing Checklist

### Android (Chrome)
- [ ] HTTPS deployment accessible
- [ ] All 8 icon sizes present
- [ ] Install prompt appears
- [ ] App installs to home screen
- [ ] Standalone mode (no browser UI)
- [ ] Theme color applied to status bar
- [ ] Bottom navigation visible
- [ ] Haptic feedback on tap
- [ ] GPS location works
- [ ] Camera capture works
- [ ] Offline page shows when network fails
- [ ] Service worker caches pages
- [ ] Background sync queues care logs
- [ ] Push notifications work

### iOS (Safari)
- [ ] HTTPS deployment accessible
- [ ] Apple touch icons present
- [ ] "Add to Home Screen" available in Share menu
- [ ] App installs to home screen
- [ ] Standalone mode (no Safari UI)
- [ ] Bottom navigation visible
- [ ] GPS location works
- [ ] Camera capture works
- [ ] Offline caching works (limited)
- [ ] No background sync (expected)
- [ ] No push notifications (expected)

---

## Troubleshooting

### Install Prompt Not Showing (Android)

**Check:**
1. Using HTTPS (not HTTP)
2. Manifest linked in HTML head
3. Service worker registered successfully
4. All required manifest fields present
5. Icons available at specified paths

**Fix:**
```javascript
// In browser console:
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('Install prompt fired!', e);
});
```

### Service Worker Not Registering

**Check DevTools Console:**
```javascript
// In browser console:
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Registrations:', regs);
});
```

**Common Issues:**
- Service worker file not at `/sw.js`
- Scope issues (must be root level)
- HTTPS not enabled
- Browser cache preventing update

**Fix:**
```javascript
// Unregister old service workers:
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.unregister());
});
// Refresh page
```

### Offline Page Not Showing

**Check:**
1. `/offline` route exists
2. Service worker precaches offline page
3. Fetch event fallback implemented

**Test:**
```javascript
// In DevTools → Network tab:
// - Check "Offline" checkbox
// - Navigate to new route
// - Should show /offline page
```

### Icons Not Appearing

**Verify paths:**
```bash
# Check files exist:
ls -lh public/icons/

# Should output:
# icon-72x72.png
# icon-96x96.png
# ... (all 8 sizes)
```

**Generate missing icons:**
```bash
# Using ImageMagick:
for size in 72 96 128 144 152 192 384 512; do
  convert logo.png -resize ${size}x${size} public/icons/icon-${size}x${size}.png
done
```

---

## Performance Testing

### Lighthouse Audit

```bash
# In Chrome DevTools:
1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select:
   - Performance
   - PWA
   - Best Practices
4. Click "Analyze page load"

# Target Scores:
- Performance: >90
- PWA: 100
- Best Practices: >90
```

### PWA Criteria Checklist

- [ ] Served over HTTPS
- [ ] Registers a service worker
- [ ] Responds with 200 when offline
- [ ] Has a valid web app manifest
- [ ] Configured for custom splash screen
- [ ] Sets theme color
- [ ] Content sized for viewport
- [ ] Page load fast on mobile (3G)

---

## Next Steps After Testing

1. **Document Issues:** Create GitHub issues for any failures
2. **Fix Critical Bugs:** Service worker errors, manifest issues
3. **Optimize Performance:** If Lighthouse <90
4. **Create Icon Assets:** If using placeholder icons
5. **Enable Analytics:** Track install rate, offline usage
6. **Update Documentation:** User guide for installing PWA

---

## Deployment Commands

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Local HTTPS Testing
```bash
# Terminal 1:
npm run dev

# Terminal 2:
npx local-ssl-proxy --source 3001 --target 3000
# Access at https://localhost:3001
```

---

## Resources

- [PWA Builder](https://www.pwabuilder.com/) - Generate manifest, icons, service worker
- [Workbox](https://developers.google.com/web/tools/workbox) - Advanced service worker library
- [Web.dev PWA Checklist](https://web.dev/pwa-checklist/) - Official PWA requirements
- [Can I Use](https://caniuse.com/?search=service%20worker) - Browser support matrix
- [iOS PWA Limitations](https://medium.com/@firt/pwas-on-ios-12-2-13-0-13-2-and-13-3-18-db7dd102e84d) - iOS PWA support details
