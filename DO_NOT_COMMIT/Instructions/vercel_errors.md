12:48:08.686 Running build in Washington, D.C., USA (East) – iad1
12:48:08.687 Build machine configuration: 2 cores, 8 GB
12:48:08.697 Cloning github.com/digitalpapyrusbd/CareNet (Branch: main, Commit: 6600731)
12:48:08.697 Skipping build cache, deployment was triggered without cache.
12:48:09.778 Cloning completed: 1.080s
12:48:10.398 Warning: Detected "engines": { "node": ">=18.17.0" } in your `package.json` that will automatically upgrade when a new major Node.js Version is released. Learn More: http://vercel.link/node-version
12:48:10.399 Running "vercel build"
12:48:10.804 Vercel CLI 50.0.1
12:48:11.295 Warning: Detected "engines": { "node": ">=18.17.0" } in your `package.json` that will automatically upgrade when a new major Node.js Version is released. Learn More: http://vercel.link/node-version
12:48:11.314 Installing dependencies...
12:48:17.316 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
12:48:18.012 npm warn deprecated npmlog@6.0.2: This package is no longer supported.
12:48:18.768 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
12:48:20.054 npm warn deprecated crypto@1.0.1: This package is no longer supported. It's now a built-in Node module. If you've depended on crypto, you should switch to the one that's built-in.
12:48:20.108 npm warn deprecated domexception@4.0.0: Use your platform's native DOMException instead
12:48:20.561 npm warn deprecated gauge@4.0.4: This package is no longer supported.
12:48:20.694 npm warn deprecated abab@2.0.6: Use your platform's native atob() and btoa() methods instead
12:48:20.778 npm warn deprecated are-we-there-yet@3.0.1: This package is no longer supported.
12:48:20.832 npm warn deprecated critters@0.0.25: Ownership of Critters has moved to the Nuxt team, who will be maintaining the project going forward. If you'd like to keep using Critters, please switch to the actively-maintained fork at https://github.com/danielroe/beasties
12:48:21.028 npm warn deprecated @types/bcryptjs@3.0.0: This is a stub types definition. bcryptjs provides its own type definitions, so you do not need this installed.
12:48:22.274 npm warn deprecated @npmcli/move-file@1.1.2: This functionality has been moved to @npmcli/fs
12:48:22.816 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
12:48:23.107 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
12:48:23.919 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
12:48:24.018 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
12:48:24.094 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
12:48:24.329 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
12:48:24.330 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
12:48:24.671 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
12:48:24.765 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
12:48:25.205 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
12:48:25.368 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
12:48:25.653 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
12:48:32.080 npm warn deprecated @opentelemetry/otlp-proto-exporter-base@0.41.2: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
12:48:35.235 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
12:49:03.252 
12:49:03.253 > caregiver-platform@0.1.0 prepare
12:49:03.253 > husky install
12:49:03.253 
12:49:03.292 husky - Git hooks installed
12:49:03.338 
12:49:03.338 added 1803 packages in 52s
12:49:03.338 
12:49:03.339 292 packages are looking for funding
12:49:03.339   run `npm fund` for details
12:49:03.392 Detected Next.js version: 14.0.4
12:49:03.407 Running "npm run build"
12:49:03.706 
12:49:03.706 > caregiver-platform@0.1.0 build
12:49:03.707 > next build
12:49:03.707 
12:49:04.201 Attention: Next.js now collects completely anonymous telemetry regarding usage.
12:49:04.202 This information is used to shape Next.js' roadmap and prioritize features.
12:49:04.204 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
12:49:04.205 https://nextjs.org/telemetry
12:49:04.205 
12:49:04.281    ▲ Next.js 14.0.4
12:49:04.283    - Experiments (use at your own risk):
12:49:04.283      · optimizeCss
12:49:04.283      · scrollRestoration
12:49:04.283 
12:49:04.284    Creating an optimized production build ...
12:49:39.017  ✓ Compiled successfully
12:49:39.018    Linting and checking validity of types ...
12:50:04.182 
12:50:04.184 Failed to compile.
12:50:04.185 
12:50:04.185 ./src/app/admin/analytics/page.tsx
12:50:04.185 6:10  Warning: 'TrendingUp' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.185 6:10  Error: 'TrendingUp' is defined but never used.  no-unused-vars
12:50:04.187 11:9  Warning: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.187 11:9  Error: 'router' is assigned a value but never used.  no-unused-vars
12:50:04.188 50:61  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.188 
12:50:04.188 ./src/app/admin/audit-logs/page.tsx
12:50:04.188 6:28  Warning: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.189 6:28  Error: 'Filter' is defined but never used.  no-unused-vars
12:50:04.189 12:9  Warning: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.189 12:9  Error: 'router' is assigned a value but never used.  no-unused-vars
12:50:04.190 65:71  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.190 
12:50:04.191 ./src/app/admin/billing/page.tsx
12:50:04.191 11:9  Warning: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.192 11:9  Error: 'router' is assigned a value but never used.  no-unused-vars
12:50:04.192 47:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.193 
12:50:04.193 ./src/app/admin/cv-pool/page.tsx
12:50:04.194 12:9  Warning: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.195 12:9  Error: 'router' is assigned a value but never used.  no-unused-vars
12:50:04.195 
12:50:04.195 ./src/app/admin/dashboard/page.tsx
12:50:04.195 6:25  Warning: 'Building2' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.197 6:25  Error: 'Building2' is defined but never used.  no-unused-vars
12:50:04.197 7:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.197 7:10  Error: 'Button' is defined but never used.  no-unused-vars
12:50:04.198 
12:50:04.198 ./src/app/admin/disputes/page.tsx
12:50:04.198 6:18  Warning: 'AlertTriangle' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.198 6:18  Error: 'AlertTriangle' is defined but never used.  no-unused-vars
12:50:04.198 6:33  Warning: 'Clock' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.198 6:33  Error: 'Clock' is defined but never used.  no-unused-vars
12:50:04.198 31:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.198 
12:50:04.198 ./src/app/admin/locked-accounts/[id]/unlock/page.tsx
12:50:04.198 28:5  Warning: Unexpected console statement.  no-console
12:50:04.198 
12:50:04.199 ./src/app/admin/locked-accounts/page.tsx
12:50:04.199 12:9  Warning: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.199 12:9  Error: 'router' is assigned a value but never used.  no-unused-vars
12:50:04.199 
12:50:04.199 ./src/app/admin/messages/page.tsx
12:50:04.199 11:9  Warning: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.199 11:9  Error: 'router' is assigned a value but never used.  no-unused-vars
12:50:04.199 
12:50:04.199 ./src/app/admin/moderators/[id]/page.tsx
12:50:04.206 6:30  Warning: 'Edit' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.206 6:30  Error: 'Edit' is defined but never used.  no-unused-vars
12:50:04.206 
12:50:04.206 ./src/app/admin/moderators/page.tsx
12:50:04.206 46:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.206 
12:50:04.206 ./src/app/admin/submissions/[id]/decision/page.tsx
12:50:04.206 29:5  Warning: Unexpected console statement.  no-console
12:50:04.206 78:53  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.206 136:51  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.206 
12:50:04.206 ./src/app/admin/submissions/page.tsx
12:50:04.206 31:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.206 
12:50:04.206 ./src/app/admin/system-settings/page.tsx
12:50:04.206 6:10  Warning: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.206 6:10  Error: 'Settings' is defined but never used.  no-unused-vars
12:50:04.206 
12:50:04.206 ./src/app/admin/tickets/page.tsx
12:50:04.207 12:9  Warning: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.207 12:9  Error: 'router' is assigned a value but never used.  no-unused-vars
12:50:04.207 48:61  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.207 
12:50:04.207 ./src/app/agency/caregivers/[id]/page.tsx
12:50:04.207 6:33  Warning: 'Briefcase' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.207 6:33  Error: 'Briefcase' is defined but never used.  no-unused-vars
12:50:04.207 
12:50:04.207 ./src/app/agency/dashboard/page.tsx
12:50:04.207 6:52  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.207 6:52  Error: 'Package' is defined but never used.  no-unused-vars
12:50:04.207 6:61  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.207 6:61  Error: 'Calendar' is defined but never used.  no-unused-vars
12:50:04.207 6:71  Warning: 'TrendingUp' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.207 6:71  Error: 'TrendingUp' is defined but never used.  no-unused-vars
12:50:04.207 7:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.207 7:10  Error: 'Button' is defined but never used.  no-unused-vars
12:50:04.207 
12:50:04.207 ./src/app/agency/inquiries/[id]/page.tsx
12:50:04.207 6:21  Warning: 'MessageSquare' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.207 6:21  Error: 'MessageSquare' is defined but never used.  no-unused-vars
12:50:04.207 
12:50:04.208 ./src/app/agency/jobs/[id]/page.tsx
12:50:04.208 6:32  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.208 6:32  Error: 'User' is defined but never used.  no-unused-vars
12:50:04.208 6:38  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.208 6:38  Error: 'Calendar' is defined but never used.  no-unused-vars
12:50:04.213 6:48  Warning: 'MessageSquare' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.213 6:48  Error: 'MessageSquare' is defined but never used.  no-unused-vars
12:50:04.213 
12:50:04.213 ./src/app/agency/messages/[id]/page.tsx
12:50:04.213 6:52  Warning: 'ImageIcon' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.220 6:52  Error: 'ImageIcon' is defined but never used.  no-unused-vars
12:50:04.220 14:9  Warning: 'id' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.220 14:9  Error: 'id' is assigned a value but never used.  no-unused-vars
12:50:04.220 
12:50:04.221 ./src/app/agency/messages/page.tsx
12:50:04.221 8:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.221 8:10  Error: 'Button' is defined but never used.  no-unused-vars
12:50:04.221 
12:50:04.221 ./src/app/agency/packages/[id]/edit/page.tsx
12:50:04.221 6:27  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.222 6:27  Error: 'Package' is defined but never used.  no-unused-vars
12:50:04.222 
12:50:04.222 ./src/app/agency/registration/step-5/page.tsx
12:50:04.222 40:94  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.222 
12:50:04.222 ./src/app/agency-manager/feedback/[id]/respond/page.tsx
12:50:04.222 6:27  Warning: 'MessageSquare' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.222 6:27  Error: 'MessageSquare' is defined but never used.  no-unused-vars
12:50:04.222 
12:50:04.222 ./src/app/agency-manager/login/page.tsx
12:50:04.222 14:30  Warning: 'credentials' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.222 14:30  Error: 'credentials' is defined but never used.  no-unused-vars
12:50:04.222 
12:50:04.222 ./src/app/api/admin/audit/route.ts
12:50:04.222 11:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.222 26:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.222 
12:50:04.222 ./src/app/api/admin/moderation/content/route.ts
12:50:04.222 17:70  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.222 23:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.222 
12:50:04.223 ./src/app/api/admin/users/role/route.ts
12:50:04.223 18:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.230 
12:50:04.230 ./src/app/api/ai-agent/chat/route.ts
12:50:04.230 34:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.230 35:9  Warning: Unexpected console statement.  no-console
12:50:04.230 
12:50:04.230 ./src/app/api/ai-agent/routes/route.ts
12:50:04.230 26:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.230 27:9  Warning: Unexpected console statement.  no-console
12:50:04.230 
12:50:04.230 ./src/app/api/analytics/chat/route.ts
12:50:04.230 8:6  Error: 'UserRole' is already defined.  no-redeclare
12:50:04.230 45:11  Warning: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.230 45:11  Error: 'user' is assigned a value but never used.  no-unused-vars
12:50:04.230 45:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.230 70:5  Warning: Unexpected console statement.  no-console
12:50:04.230 106:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.230 123:5  Warning: Unexpected console statement.  no-console
12:50:04.230 180:5  Warning: Unexpected console statement.  no-console
12:50:04.230 218:5  Warning: Unexpected console statement.  no-console
12:50:04.231 
12:50:04.231 ./src/app/api/analytics/route.ts
12:50:04.231 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.231 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
12:50:04.231 41:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.231 46:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.231 135:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.231 185:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.231 249:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.231 249:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.231 250:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.231 256:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.231 256:51  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.231 257:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.231 263:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.231 263:64  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.231 265:39  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.231 268:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.231 268:60  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.231 270:38  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.231 286:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.231 346:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.231 396:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.231 397:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.231 425:5  Warning: Unexpected console statement.  no-console
12:50:04.231 
12:50:04.231 ./src/app/api/analytics/vitals/route.ts
12:50:04.231 18:7  Warning: Unexpected console statement.  no-console
12:50:04.231 47:5  Warning: Unexpected console statement.  no-console
12:50:04.231 
12:50:04.231 ./src/app/api/auth/login/route.ts
12:50:04.231 7:57  Warning: 'verifySessionMFA' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.231 7:57  Error: 'verifySessionMFA' is defined but never used.  no-unused-vars
12:50:04.231 190:28  Warning: '_' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.232 190:28  Error: '_' is assigned a value but never used.  no-unused-vars
12:50:04.232 190:43  Warning: '__' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.232 190:43  Error: '__' is assigned a value but never used.  no-unused-vars
12:50:04.232 212:5  Warning: Unexpected console statement.  no-console
12:50:04.232 292:5  Warning: Unexpected console statement.  no-console
12:50:04.232 331:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.232 337:13  Error: 'deleteUserSessions' is not defined.  no-undef
12:50:04.232 341:18  Warning: 'session' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.232 341:18  Error: 'session' is assigned a value but never used.  no-unused-vars
12:50:04.232 401:5  Warning: Unexpected console statement.  no-console
12:50:04.232 491:5  Warning: Unexpected console statement.  no-console
12:50:04.232 
12:50:04.232 ./src/app/api/auth/me/route.ts
12:50:04.232 115:5  Warning: Unexpected console statement.  no-console
12:50:04.232 165:5  Warning: Unexpected console statement.  no-console
12:50:04.232 
12:50:04.232 ./src/app/api/auth/register/route.ts
12:50:04.232 265:7  Warning: Unexpected console statement.  no-console
12:50:04.232 298:5  Warning: Unexpected console statement.  no-console
12:50:04.232 
12:50:04.232 ./src/app/api/auth/reset-password/route.ts
12:50:04.232 3:24  Warning: 'verifyPassword' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.232 3:24  Error: 'verifyPassword' is defined but never used.  no-unused-vars
12:50:04.232 4:26  Warning: 'updateUserLastLogin' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.232 4:26  Error: 'updateUserLastLogin' is defined but never used.  no-unused-vars
12:50:04.232 184:7  Warning: Unexpected console statement.  no-console
12:50:04.232 187:7  Warning: Unexpected console statement.  no-console
12:50:04.232 199:63  Error: 'resetUrl' is not defined.  no-undef
12:50:04.232 204:5  Warning: Unexpected console statement.  no-console
12:50:04.232 297:5  Warning: Unexpected console statement.  no-console
12:50:04.232 408:5  Warning: Unexpected console statement.  no-console
12:50:04.232 487:11  Warning: 'timeSinceRequest' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.232 487:11  Error: 'timeSinceRequest' is assigned a value but never used.  no-unused-vars
12:50:04.232 504:5  Warning: Unexpected console statement.  no-console
12:50:04.232 549:5  Warning: Unexpected console statement.  no-console
12:50:04.233 
12:50:04.233 ./src/app/api/auth/send-otp/route.ts
12:50:04.233 52:7  Warning: Unexpected console statement.  no-console
12:50:04.233 61:5  Warning: Unexpected console statement.  no-console
12:50:04.233 
12:50:04.233 ./src/app/api/auth/setup-mfa/route.ts
12:50:04.233 81:55  Warning: '_' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.233 81:55  Error: '_' is defined but never used.  no-unused-vars
12:50:04.233 81:58  Warning: 'i' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.233 81:58  Error: 'i' is defined but never used.  no-unused-vars
12:50:04.233 117:5  Warning: Unexpected console statement.  no-console
12:50:04.233 158:5  Warning: Unexpected console statement.  no-console
12:50:04.233 
12:50:04.233 ./src/app/api/auth/verify-email/route.ts
12:50:04.233 5:8  Warning: 'crypto' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.233 5:8  Error: 'crypto' is defined but never used.  no-unused-vars
12:50:04.233 64:19  Error: 'generateEmailVerificationToken' is not defined.  no-undef
12:50:04.233 83:5  Warning: Unexpected console statement.  no-console
12:50:04.233 96:5  Warning: Unexpected console statement.  no-console
12:50:04.233 208:9  Warning: 'updateData' is never reassigned. Use 'const' instead.  prefer-const
12:50:04.233 208:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.233 236:5  Warning: Unexpected console statement.  no-console
12:50:04.233 257:11  Warning: 'token' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.233 257:11  Error: 'token' is assigned a value but never used.  no-unused-vars
12:50:04.233 298:5  Warning: Unexpected console statement.  no-console
12:50:04.233 329:5  Warning: Unexpected console statement.  no-console
12:50:04.233 
12:50:04.233 ./src/app/api/auth/verify-otp/route.ts
12:50:04.233 14:13  Warning: 'phone' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.233 14:13  Error: 'phone' is assigned a value but never used.  no-unused-vars
12:50:04.233 75:5  Warning: Unexpected console statement.  no-console
12:50:04.233 
12:50:04.233 ./src/app/api/care-logs/route.ts
12:50:04.233 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.234 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
12:50:04.234 18:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.234 33:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.234 38:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.234 42:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.234 42:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.234 64:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.234 161:5  Warning: Unexpected console statement.  no-console
12:50:04.234 179:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.234 290:5  Warning: Unexpected console statement.  no-console
12:50:04.234 
12:50:04.234 ./src/app/api/caregivers/route.ts
12:50:04.234 12:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.234 26:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.234 114:5  Warning: Unexpected console statement.  no-console
12:50:04.234 128:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.234 238:5  Warning: Unexpected console statement.  no-console
12:50:04.234 
12:50:04.235 ./src/app/api/cdn/upload/route.ts
12:50:04.235 16:11  Warning: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.235 16:11  Error: 'user' is assigned a value but never used.  no-unused-vars
12:50:04.235 16:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.235 74:5  Warning: Unexpected console statement.  no-console
12:50:04.235 119:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.235 126:5  Warning: Unexpected console statement.  no-console
12:50:04.235 168:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.235 175:5  Warning: Unexpected console statement.  no-console
12:50:04.235 
12:50:04.235 ./src/app/api/companies/route.ts
12:50:04.235 4:29  Warning: 'authorizeOwnResource' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.235 4:29  Error: 'authorizeOwnResource' is defined but never used.  no-unused-vars
12:50:04.236 32:7  Warning: 'packageSchema' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.236 32:7  Error: 'packageSchema' is assigned a value but never used.  no-unused-vars
12:50:04.236 46:7  Warning: 'serviceZoneSchema' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.236 46:7  Error: 'serviceZoneSchema' is assigned a value but never used.  no-unused-vars
12:50:04.236 65:70  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.236 75:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.236 113:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.236 199:5  Warning: Unexpected console statement.  no-console
12:50:04.236 283:5  Warning: Unexpected console statement.  no-console
12:50:04.236 390:5  Warning: Unexpected console statement.  no-console
12:50:04.236 430:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.236 451:5  Warning: Unexpected console statement.  no-console
12:50:04.236 
12:50:04.236 ./src/app/api/dashboard/stats/route.ts
12:50:04.236 2:24  Warning: 'authorize' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.236 2:24  Error: 'authorize' is defined but never used.  no-unused-vars
12:50:04.236 12:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.236 15:16  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.236 20:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.236 58:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.236 101:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.236 162:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.236 205:5  Warning: Unexpected console statement.  no-console
12:50:04.236 215:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.236 220:7  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.236 256:38  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.236 264:36  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.236 272:44  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.237 283:7  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.237 332:7  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.237 361:50  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.237 369:40  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.237 380:7  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.237 408:38  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.237 416:46  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.237 
12:50:04.237 ./src/app/api/disputes/[id]/route.ts
12:50:04.237 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.237 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
12:50:04.237 32:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.237 37:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.237 51:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.237 130:5  Warning: Unexpected console statement.  no-console
12:50:04.237 150:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.237 377:5  Warning: Unexpected console statement.  no-console
12:50:04.237 
12:50:04.237 ./src/app/api/disputes/route.ts
12:50:04.237 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.237 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
12:50:04.237 18:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.237 31:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.237 45:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.237 141:5  Warning: Unexpected console statement.  no-console
12:50:04.237 160:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.237 215:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.237 310:5  Warning: Unexpected console statement.  no-console
12:50:04.238 
12:50:04.238 ./src/app/api/docs/route.ts
12:50:04.238 1:23  Warning: 'NextResponse' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.238 1:23  Error: 'NextResponse' is defined but never used.  no-unused-vars
12:50:04.238 
12:50:04.238 ./src/app/api/escrow/route.ts
12:50:04.238 40:7  Warning: 'getEscrowSchema' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.238 40:7  Error: 'getEscrowSchema' is assigned a value but never used.  no-unused-vars
12:50:04.238 44:7  Warning: 'getUserEscrowSchema' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.238 44:7  Error: 'getUserEscrowSchema' is assigned a value but never used.  no-unused-vars
12:50:04.238 54:27  Error: 'getServerSession' is not defined.  no-undef
12:50:04.238 54:44  Error: 'authOptions' is not defined.  no-undef
12:50:04.238 106:5  Warning: Unexpected console statement.  no-console
12:50:04.238 120:27  Error: 'getServerSession' is not defined.  no-undef
12:50:04.238 120:44  Error: 'authOptions' is not defined.  no-undef
12:50:04.238 148:5  Warning: Unexpected console statement.  no-console
12:50:04.238 159:41  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.238 159:55  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.238 187:5  Warning: Unexpected console statement.  no-console
12:50:04.238 198:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.238 198:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.238 231:5  Warning: Unexpected console statement.  no-console
12:50:04.238 242:41  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.238 242:55  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.238 275:5  Warning: Unexpected console statement.  no-console
12:50:04.238 286:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.238 286:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.238 320:5  Warning: Unexpected console statement.  no-console
12:50:04.238 331:80  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.239 363:78  Warning: 'escrowData' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.239 363:78  Error: 'escrowData' is defined but never used.  no-unused-vars
12:50:04.239 363:90  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.239 401:78  Warning: 'escrowId' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.239 401:78  Error: 'escrowId' is defined but never used.  no-unused-vars
12:50:04.239 
12:50:04.239 ./src/app/api/fcm/register/route.ts
12:50:04.239 21:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.239 56:5  Warning: Unexpected console statement.  no-console
12:50:04.239 80:11  Warning: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.239 80:11  Error: 'user' is assigned a value but never used.  no-unused-vars
12:50:04.239 80:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.239 108:5  Warning: Unexpected console statement.  no-console
12:50:04.239 
12:50:04.239 ./src/app/api/fcm/send/route.ts
12:50:04.239 46:11  Warning: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.239 46:11  Error: 'user' is assigned a value but never used.  no-unused-vars
12:50:04.239 46:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.239 130:5  Warning: Unexpected console statement.  no-console
12:50:04.239 
12:50:04.239 ./src/app/api/fcm/subscribe/route.ts
12:50:04.239 2:24  Warning: 'authorize' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.239 2:24  Error: 'authorize' is defined but never used.  no-unused-vars
12:50:04.239 7:6  Warning: 'UserRole' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.239 7:6  Error: 'UserRole' is defined but never used.  no-unused-vars
12:50:04.239 29:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.239 53:5  Warning: Unexpected console statement.  no-console
12:50:04.239 78:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.239 109:5  Warning: Unexpected console statement.  no-console
12:50:04.239 
12:50:04.239 ./src/app/api/feedback/[id]/respond/route.ts
12:50:04.239 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.239 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
12:50:04.239 15:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.240 118:5  Warning: Unexpected console statement.  no-console
12:50:04.240 
12:50:04.240 ./src/app/api/feedback/[id]/route.ts
12:50:04.240 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.240 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
12:50:04.240 21:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.240 26:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.240 40:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.240 111:5  Warning: Unexpected console statement.  no-console
12:50:04.240 195:5  Warning: Unexpected console statement.  no-console
12:50:04.241 
12:50:04.241 ./src/app/api/feedback/route.ts
12:50:04.241 18:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.241 32:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.241 46:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.241 125:5  Warning: Unexpected console statement.  no-console
12:50:04.241 139:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.241 196:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.241 267:61  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.241 295:5  Warning: Unexpected console statement.  no-console
12:50:04.241 
12:50:04.241 ./src/app/api/health-records/route.ts
12:50:04.241 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.241 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
12:50:04.241 17:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.241 30:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.241 35:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.241 39:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.241 39:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.241 56:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.241 122:5  Warning: Unexpected console statement.  no-console
12:50:04.241 141:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.241 233:5  Warning: Unexpected console statement.  no-console
12:50:04.241 252:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.241 350:5  Warning: Unexpected console statement.  no-console
12:50:04.241 
12:50:04.241 ./src/app/api/jobs/route.ts
12:50:04.241 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.241 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
12:50:04.241 18:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.241 30:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.241 49:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.241 158:5  Warning: Unexpected console statement.  no-console
12:50:04.241 176:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.241 304:5  Warning: Unexpected console statement.  no-console
12:50:04.241 
12:50:04.242 ./src/app/api/marketplace-jobs/route.ts
12:50:04.242 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.242 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
12:50:04.242 17:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.242 31:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.243 147:5  Warning: Unexpected console statement.  no-console
12:50:04.243 165:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.243 251:5  Warning: Unexpected console statement.  no-console
12:50:04.243 269:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.243 389:5  Warning: Unexpected console statement.  no-console
12:50:04.243 
12:50:04.243 ./src/app/api/moderation/route.ts
12:50:04.243 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.243 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
12:50:04.243 35:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.243 75:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.243 120:70  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.243 173:70  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.243 199:5  Warning: Unexpected console statement.  no-console
12:50:04.243 216:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.243 251:5  Warning: Unexpected console statement.  no-console
12:50:04.243 268:33  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.246 307:35  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.246 339:33  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.246 371:35  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.246 
12:50:04.246 ./src/app/api/notifications/[id]/route.ts
12:50:04.246 44:5  Warning: Unexpected console statement.  no-console
12:50:04.246 104:5  Warning: Unexpected console statement.  no-console
12:50:04.246 157:5  Warning: Unexpected console statement.  no-console
12:50:04.246 
12:50:04.246 ./src/app/api/notifications/route.ts
12:50:04.246 26:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.247 82:5  Warning: Unexpected console statement.  no-console
12:50:04.247 143:5  Warning: Unexpected console statement.  no-console
12:50:04.247 
12:50:04.247 ./src/app/api/notifications/send/route.ts
12:50:04.247 4:8  Warning: 'notificationService' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.247 4:8  Error: 'notificationService' is defined but never used.  no-unused-vars
12:50:04.247 38:37  Error: 'NotificationService' is not defined.  no-undef
12:50:04.247 59:5  Warning: Unexpected console statement.  no-console
12:50:04.247 
12:50:04.247 ./src/app/api/notifications/settings/route.ts
12:50:04.247 15:9  Warning: 'currentUser' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.247 15:9  Error: 'currentUser' is assigned a value but never used.  no-unused-vars
12:50:04.247 39:5  Warning: Unexpected console statement.  no-console
12:50:04.247 57:9  Warning: 'currentUser' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.247 57:9  Error: 'currentUser' is assigned a value but never used.  no-unused-vars
12:50:04.247 75:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.247 78:16  Error: Do not access Object.prototype method 'hasOwnProperty' from target object.  no-prototype-builtins
12:50:04.247 93:5  Warning: Unexpected console statement.  no-console
12:50:04.247 
12:50:04.247 ./src/app/api/packages/route.ts
12:50:04.247 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.247 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
12:50:04.247 17:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.247 30:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.247 99:5  Warning: Unexpected console statement.  no-console
12:50:04.247 117:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.247 199:5  Warning: Unexpected console statement.  no-console
12:50:04.247 
12:50:04.247 ./src/app/api/patients/[id]/route.ts
12:50:04.248 11:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.248 22:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.248 32:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.248 
12:50:04.248 ./src/app/api/patients/route.ts
12:50:04.248 31:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.248 31:10  Error: 'authenticate' is defined but never used.  no-unused-vars
12:50:04.248 41:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.248 52:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.248 117:5  Warning: Unexpected console statement.  no-console
12:50:04.248 
12:50:04.248 ./src/app/api/payments/[id]/route.ts
12:50:04.248 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.248 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
12:50:04.248 23:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.248 28:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.248 38:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.248 103:5  Warning: Unexpected console statement.  no-console
12:50:04.248 219:5  Warning: Unexpected console statement.  no-console
12:50:04.248 
12:50:04.248 ./src/app/api/payments/bkash/callback/route.ts
12:50:04.248 16:43  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.248 29:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.248 
12:50:04.248 ./src/app/api/payments/bkash/checkout/route.ts
12:50:04.248 4:10  Warning: 'extractTokenFromHeader' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.248 4:10  Error: 'extractTokenFromHeader' is defined but never used.  no-unused-vars
12:50:04.249 4:34  Warning: 'verifyAccessToken' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.249 4:34  Error: 'verifyAccessToken' is defined but never used.  no-unused-vars
12:50:04.249 24:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.249 24:52  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.249 25:33  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.249 34:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.249 
12:50:04.249 ./src/app/api/payments/bkash/create/route.ts
12:50:04.249 105:5  Warning: Unexpected console statement.  no-console
12:50:04.249 129:11  Warning: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.249 129:11  Error: 'user' is assigned a value but never used.  no-unused-vars
12:50:04.249 189:5  Warning: Unexpected console statement.  no-console
12:50:04.249 
12:50:04.249 ./src/app/api/payments/bkash/route.ts
12:50:04.249 91:5  Warning: Unexpected console statement.  no-console
12:50:04.249 122:7  Warning: Unexpected console statement.  no-console
12:50:04.249 133:7  Warning: Unexpected console statement.  no-console
12:50:04.249 
12:50:04.249 ./src/app/api/payments/create/route.ts
12:50:04.249 77:47  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.249 98:47  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.249 112:5  Warning: Unexpected console statement.  no-console
12:50:04.249 
12:50:04.249 ./src/app/api/payments/nagad/callback/route.ts
12:50:04.249 34:7  Warning: Unexpected console statement.  no-console
12:50:04.249 63:7  Warning: Unexpected console statement.  no-console
12:50:04.249 71:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.249 73:41  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.249 100:5  Warning: Unexpected console statement.  no-console
12:50:04.250 
12:50:04.250 ./src/app/api/payments/nagad/create/route.ts
12:50:04.250 106:5  Warning: Unexpected console statement.  no-console
12:50:04.250 187:5  Warning: Unexpected console statement.  no-console
12:50:04.250 
12:50:04.250 ./src/app/api/payments/nagad/route.ts
12:50:04.250 72:5  Warning: Unexpected console statement.  no-console
12:50:04.250 83:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.250 111:5  Warning: Unexpected console statement.  no-console
12:50:04.250 122:43  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.250 140:5  Warning: Unexpected console statement.  no-console
12:50:04.250 151:40  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.250 169:5  Warning: Unexpected console statement.  no-console
12:50:04.250 180:35  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.250 202:5  Warning: Unexpected console statement.  no-console
12:50:04.250 222:5  Warning: Unexpected console statement.  no-console
12:50:04.250 
12:50:04.250 ./src/app/api/payments/refund/route.ts
12:50:04.250 4:10  Warning: 'extractTokenFromHeader' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.250 4:10  Error: 'extractTokenFromHeader' is defined but never used.  no-unused-vars
12:50:04.250 4:34  Warning: 'verifyAccessToken' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.250 4:34  Error: 'verifyAccessToken' is defined but never used.  no-unused-vars
12:50:04.250 4:53  Warning: 'hasPermission' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.250 4:53  Error: 'hasPermission' is defined but never used.  no-unused-vars
12:50:04.250 18:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.250 18:52  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.250 19:33  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.251 22:32  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.251 30:33  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.251 36:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.251 
12:50:04.251 ./src/app/api/payments/route.ts
12:50:04.251 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.251 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
12:50:04.251 20:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.251 33:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.251 43:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.251 131:5  Warning: Unexpected console statement.  no-console
12:50:04.251 151:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.251 266:5  Warning: Unexpected console statement.  no-console
12:50:04.251 
12:50:04.251 ./src/app/api/refunds/route.ts
12:50:04.251 31:7  Warning: 'getRefundSchema' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.251 31:7  Error: 'getRefundSchema' is assigned a value but never used.  no-unused-vars
12:50:04.251 35:7  Warning: 'getStatisticsSchema' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.251 35:7  Error: 'getStatisticsSchema' is assigned a value but never used.  no-unused-vars
12:50:04.251 46:27  Error: 'getServerSession' is not defined.  no-undef
12:50:04.251 46:44  Error: 'authOptions' is not defined.  no-undef
12:50:04.251 114:5  Warning: Unexpected console statement.  no-console
12:50:04.251 128:27  Error: 'getServerSession' is not defined.  no-undef
12:50:04.251 128:44  Error: 'authOptions' is not defined.  no-undef
12:50:04.251 156:5  Warning: Unexpected console statement.  no-console
12:50:04.251 167:41  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.251 167:55  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.252 203:5  Warning: Unexpected console statement.  no-console
12:50:04.252 214:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.252 214:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.252 245:5  Warning: Unexpected console statement.  no-console
12:50:04.252 256:41  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.252 256:55  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.252 288:5  Warning: Unexpected console statement.  no-console
12:50:04.252 299:45  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.252 299:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.252 327:5  Warning: Unexpected console statement.  no-console
12:50:04.252 338:80  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.252 
12:50:04.252 ./src/app/api/sessions/route.ts
12:50:04.253 48:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.253 56:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.253 59:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.253 76:5  Warning: Unexpected console statement.  no-console
12:50:04.253 137:5  Warning: Unexpected console statement.  no-console
12:50:04.253 194:5  Warning: Unexpected console statement.  no-console
12:50:04.253 
12:50:04.253 ./src/app/api/sync/route.ts
12:50:04.253 20:11  Warning: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.253 20:11  Error: 'user' is assigned a value but never used.  no-unused-vars
12:50:04.253 20:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.253 43:5  Warning: Unexpected console statement.  no-console
12:50:04.253 91:5  Warning: Unexpected console statement.  no-console
12:50:04.253 130:5  Warning: Unexpected console statement.  no-console
12:50:04.253 
12:50:04.253 ./src/app/api/upload/route.ts
12:50:04.253 88:5  Warning: Unexpected console statement.  no-console
12:50:04.253 116:5  Warning: Unexpected console statement.  no-console
12:50:04.253 131:9  Warning: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.253 131:9  Error: 'user' is assigned a value but never used.  no-unused-vars
12:50:04.253 152:5  Warning: Unexpected console statement.  no-console
12:50:04.253 
12:50:04.253 ./src/app/api/users/[id]/route.ts
12:50:04.253 16:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.253 91:5  Warning: Unexpected console statement.  no-console
12:50:04.253 109:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.253 127:7  Warning: 'isVerified' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.253 127:7  Error: 'isVerified' is assigned a value but never used.  no-unused-vars
12:50:04.254 131:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.254 168:5  Warning: Unexpected console statement.  no-console
12:50:04.254 211:5  Warning: Unexpected console statement.  no-console
12:50:04.254 
12:50:04.254 ./src/app/api/users/route.ts
12:50:04.254 4:10  Warning: 'authorizeResource' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.254 4:10  Error: 'authorizeResource' is defined but never used.  no-unused-vars
12:50:04.254 4:29  Warning: 'authorizeOwnResource' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.254 4:29  Error: 'authorizeOwnResource' is defined but never used.  no-unused-vars
12:50:04.254 5:10  Warning: 'hashPassword' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.254 5:10  Error: 'hashPassword' is defined but never used.  no-unused-vars
12:50:04.254 5:24  Warning: 'verifyPassword' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.254 5:24  Error: 'verifyPassword' is defined but never used.  no-unused-vars
12:50:04.254 9:10  Warning: 'kv' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.254 9:10  Error: 'kv' is defined but never used.  no-unused-vars
12:50:04.254 24:7  Warning: 'deactivateUserSchema' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.254 24:7  Error: 'deactivateUserSchema' is assigned a value but never used.  no-unused-vars
12:50:04.254 57:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.254 90:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.254 191:5  Warning: Unexpected console statement.  no-console
12:50:04.254 318:5  Warning: Unexpected console statement.  no-console
12:50:04.254 378:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.254 440:5  Warning: Unexpected console statement.  no-console
12:50:04.254 483:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.254 550:11  Warning: Unexpected console statement.  no-console
12:50:04.254 554:9  Warning: Unexpected console statement.  no-console
12:50:04.254 574:5  Warning: Unexpected console statement.  no-console
12:50:04.255 655:5  Warning: Unexpected console statement.  no-console
12:50:04.255 
12:50:04.255 ./src/app/api/verification/route.ts
12:50:04.255 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.255 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
12:50:04.255 39:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.255 117:5  Warning: Unexpected console statement.  no-console
12:50:04.255 134:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.255 208:31  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.255 209:31  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.256 229:5  Warning: Unexpected console statement.  no-console
12:50:04.256 
12:50:04.256 ./src/app/auth/login/page.tsx
12:50:04.256 166:16  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.256 
12:50:04.257 ./src/app/auth/reset-password/step-3/page.tsx
12:50:04.257 63:68  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.257 
12:50:04.257 ./src/app/auth/role-selection/page.tsx
12:50:04.257 102:27  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.257 
12:50:04.257 ./src/app/auth/setup-mfa/page.tsx
12:50:04.257 101:74  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.257 117:16  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.257 
12:50:04.257 ./src/app/auth/verify-mfa/page.tsx
12:50:04.257 61:5  Warning: Unexpected console statement.  no-console
12:50:04.257 
12:50:04.257 ./src/app/caregiver/availability/page.tsx
12:50:04.257 6:21  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.257 6:21  Error: 'Calendar' is defined but never used.  no-unused-vars
12:50:04.257 
12:50:04.257 ./src/app/caregiver/care-logs/activities/page.tsx
12:50:04.257 6:47  Warning: 'Plus' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.257 6:47  Error: 'Plus' is defined but never used.  no-unused-vars
12:50:04.257 
12:50:04.257 ./src/app/caregiver/care-logs/medications/page.tsx
12:50:04.257 6:27  Warning: 'Plus' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.257 6:27  Error: 'Plus' is defined but never used.  no-unused-vars
12:50:04.257 8:10  Warning: 'Textarea' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.263 8:10  Error: 'Textarea' is defined but never used.  no-unused-vars
12:50:04.263 
12:50:04.263 ./src/app/caregiver/check-in/page.tsx
12:50:04.263 17:10  Warning: 'locationMatch' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.263 17:10  Error: 'locationMatch' is assigned a value but never used.  no-unused-vars
12:50:04.263 19:10  Warning: 'photo' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.263 19:10  Error: 'photo' is assigned a value but never used.  no-unused-vars
12:50:04.263 145:42  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.263 263:18  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.263 
12:50:04.263 ./src/app/caregiver/check-out/page.tsx
12:50:04.263 16:10  Warning: 'photo' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.263 16:10  Error: 'photo' is assigned a value but never used.  no-unused-vars
12:50:04.263 
12:50:04.263 ./src/app/caregiver/checkin/confirmation/page.tsx
12:50:04.263 29:77  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.263 
12:50:04.264 ./src/app/caregiver/checkin/photo/page.tsx
12:50:04.264 22:102  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.264 
12:50:04.264 ./src/app/caregiver/dashboard/page.tsx
12:50:04.264 7:51  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.264 7:51  Error: 'Calendar' is defined but never used.  no-unused-vars
12:50:04.264 
12:50:04.264 ./src/app/caregiver/earnings/withdraw/page.tsx
12:50:04.264 6:21  Warning: 'DollarSign' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.264 6:21  Error: 'DollarSign' is defined but never used.  no-unused-vars
12:50:04.264 6:39  Warning: 'CreditCard' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.264 6:39  Error: 'CreditCard' is defined but never used.  no-unused-vars
12:50:04.264 
12:50:04.264 ./src/app/caregiver/emergency/page.tsx
12:50:04.264 6:32  Warning: 'MessageSquare' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.264 6:32  Error: 'MessageSquare' is defined but never used.  no-unused-vars
12:50:04.264 6:47  Warning: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.264 6:47  Error: 'FileText' is defined but never used.  no-unused-vars
12:50:04.264 
12:50:04.264 ./src/app/caregiver/jobs/[id]/page.tsx
12:50:04.264 6:32  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.264 6:32  Error: 'User' is defined but never used.  no-unused-vars
12:50:04.264 6:38  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.264 6:38  Error: 'Calendar' is defined but never used.  no-unused-vars
12:50:04.264 6:48  Warning: 'MapPin' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.264 6:48  Error: 'MapPin' is defined but never used.  no-unused-vars
12:50:04.264 
12:50:04.264 ./src/app/caregiver/messages/[id]/page.tsx
12:50:04.264 6:52  Warning: 'ImageIcon' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.264 6:52  Error: 'ImageIcon' is defined but never used.  no-unused-vars
12:50:04.265 14:9  Warning: 'id' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.265 14:9  Error: 'id' is assigned a value but never used.  no-unused-vars
12:50:04.265 
12:50:04.265 ./src/app/caregiver/messages/page.tsx
12:50:04.265 73:52  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.265 
12:50:04.265 ./src/app/caregiver/verification/physical/page.tsx
12:50:04.265 6:41  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.265 6:41  Error: 'Calendar' is defined but never used.  no-unused-vars
12:50:04.265 
12:50:04.265 ./src/app/caregiver/verification/psych/page.tsx
12:50:04.265 6:30  Warning: 'XCircle' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.265 6:30  Error: 'XCircle' is defined but never used.  no-unused-vars
12:50:04.265 63:52  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
12:50:04.265 63:58  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
12:50:04.265 
12:50:04.265 ./src/app/guardian/billing/page.tsx
12:50:04.265 6:48  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.265 6:48  Error: 'Calendar' is defined but never used.  no-unused-vars
12:50:04.265 111:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.265 
12:50:04.265 ./src/app/guardian/dashboard/page.tsx
12:50:04.265 7:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.265 7:10  Error: 'Button' is defined but never used.  no-unused-vars
12:50:04.265 
12:50:04.265 ./src/app/guardian/jobs/[id]/page.tsx
12:50:04.265 142:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.265 
12:50:04.265 ./src/app/guardian/jobs/page.tsx
12:50:04.265 7:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.265 7:10  Error: 'Button' is defined but never used.  no-unused-vars
12:50:04.266 89:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.266 
12:50:04.266 ./src/app/guardian/messages/[id]/page.tsx
12:50:04.266 37:5  Warning: Unexpected console statement.  no-console
12:50:04.266 
12:50:04.267 ./src/app/guardian/negotiation/waiting/page.tsx
12:50:04.267 84:68  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.267 
12:50:04.267 ./src/app/guardian/packages/[id]/page.tsx
12:50:04.267 116:65  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.267 
12:50:04.267 ./src/app/guardian/packages/filters/page.tsx
12:50:04.267 7:10  Warning: 'X' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.267 7:10  Error: 'X' is defined but never used.  no-unused-vars
12:50:04.267 31:5  Warning: Unexpected console statement.  no-console
12:50:04.267 
12:50:04.267 ./src/app/guardian/patients/[id]/edit/page.tsx
12:50:04.267 6:33  Warning: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.267 6:33  Error: 'Phone' is defined but never used.  no-unused-vars
12:50:04.267 6:40  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.267 6:40  Error: 'Calendar' is defined but never used.  no-unused-vars
12:50:04.267 6:50  Warning: 'MapPin' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.267 6:50  Error: 'MapPin' is defined but never used.  no-unused-vars
12:50:04.267 
12:50:04.267 ./src/app/guardian/patients/[id]/health-records/page.tsx
12:50:04.267 6:21  Warning: 'Upload' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.267 6:21  Error: 'Upload' is defined but never used.  no-unused-vars
12:50:04.267 78:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.267 
12:50:04.267 ./src/app/guardian/patients/[id]/page.tsx
12:50:04.267 6:52  Warning: 'Activity' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.267 6:52  Error: 'Activity' is defined but never used.  no-unused-vars
12:50:04.267 6:83  Warning: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.267 6:83  Error: 'Phone' is defined but never used.  no-unused-vars
12:50:04.267 115:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.268 
12:50:04.268 ./src/app/guardian/patients/new/page.tsx
12:50:04.268 61:5  Warning: Unexpected console statement.  no-console
12:50:04.268 
12:50:04.268 ./src/app/guardian/settings/page.tsx
12:50:04.268 56:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.268 
12:50:04.268 ./src/app/moderator/dashboard/page.tsx
12:50:04.272 6:62  Warning: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.272 6:62  Error: 'FileText' is defined but never used.  no-unused-vars
12:50:04.272 
12:50:04.272 ./src/app/moderator/disputes/[id]/page.tsx
12:50:04.272 6:21  Warning: 'Shield' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.272 6:21  Error: 'Shield' is defined but never used.  no-unused-vars
12:50:04.272 
12:50:04.272 ./src/app/moderator/packages/agency/page.tsx
12:50:04.272 6:21  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.272 6:21  Error: 'Package' is defined but never used.  no-unused-vars
12:50:04.272 6:30  Warning: 'Plus' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.272 6:30  Error: 'Plus' is defined but never used.  no-unused-vars
12:50:04.272 
12:50:04.272 ./src/app/moderator/packages/caregiver/page.tsx
12:50:04.272 6:21  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.272 6:21  Error: 'Package' is defined but never used.  no-unused-vars
12:50:04.272 6:30  Warning: 'Plus' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.272 6:30  Error: 'Plus' is defined but never used.  no-unused-vars
12:50:04.272 
12:50:04.272 ./src/app/moderator/subscription/agency/page.tsx
12:50:04.272 5:21  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.272 5:21  Error: 'Package' is defined but never used.  no-unused-vars
12:50:04.272 5:42  Warning: 'Check' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.272 5:42  Error: 'Check' is defined but never used.  no-unused-vars
12:50:04.272 9:10  Warning: 'Textarea' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.272 9:10  Error: 'Textarea' is defined but never used.  no-unused-vars
12:50:04.272 34:5  Warning: Unexpected console statement.  no-console
12:50:04.272 
12:50:04.272 ./src/app/moderator/subscription/caregiver/page.tsx
12:50:04.272 5:21  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.272 5:21  Error: 'Package' is defined but never used.  no-unused-vars
12:50:04.272 32:5  Warning: Unexpected console statement.  no-console
12:50:04.272 
12:50:04.272 ./src/app/moderator/tickets/[id]/page.tsx
12:50:04.272 6:21  Warning: 'MessageSquare' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.272 6:21  Error: 'MessageSquare' is defined but never used.  no-unused-vars
12:50:04.272 
12:50:04.272 ./src/app/moderator/verification/agencies/[id]/page.tsx
12:50:04.273 6:54  Warning: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.273 6:54  Error: 'FileText' is defined but never used.  no-unused-vars
12:50:04.273 
12:50:04.273 ./src/app/moderator/verification/caregivers/[id]/page.tsx
12:50:04.273 6:50  Warning: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.273 6:50  Error: 'FileText' is defined but never used.  no-unused-vars
12:50:04.273 
12:50:04.273 ./src/app/not-found/page.tsx
12:50:04.273 28:23  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.273 28:44  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.273 
12:50:04.273 ./src/app/not-found.tsx
12:50:04.273 42:29  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.273 42:50  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.273 
12:50:04.273 ./src/app/offline/page.tsx
12:50:04.273 19:85  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.273 21:28  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.273 47:53  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.273 
12:50:04.273 ./src/app/page.tsx
12:50:04.273 45:23  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.273 
12:50:04.273 ./src/app/patient/dashboard/page.tsx
12:50:04.273 9:20  Warning: 'Pill' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.273 9:20  Error: 'Pill' is defined but never used.  no-unused-vars
12:50:04.274 
12:50:04.275 ./src/app/patient/schedule/page.tsx
12:50:04.275 6:21  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.275 6:21  Error: 'Calendar' is defined but never used.  no-unused-vars
12:50:04.275 6:38  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.275 6:38  Error: 'User' is defined but never used.  no-unused-vars
12:50:04.275 38:66  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.275 
12:50:04.275 ./src/app/privacy/page.tsx
12:50:04.275 117:69  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.275 
12:50:04.275 ./src/app/shop/orders/[id]/page.tsx
12:50:04.275 6:35  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.275 6:35  Error: 'Package' is defined but never used.  no-unused-vars
12:50:04.275 6:44  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.275 6:44  Error: 'User' is defined but never used.  no-unused-vars
12:50:04.275 
12:50:04.275 ./src/app/shop/orders/[id]/update-status/page.tsx
12:50:04.275 6:21  Warning: 'RefreshCw' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.275 6:21  Error: 'RefreshCw' is defined but never used.  no-unused-vars
12:50:04.275 
12:50:04.275 ./src/app/shop/pending-verification/page.tsx
12:50:04.275 51:127  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.275 
12:50:04.275 ./src/app/shop/products/[id]/page.tsx
12:50:04.275 6:21  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.275 6:21  Error: 'Package' is defined but never used.  no-unused-vars
12:50:04.275 6:30  Warning: 'Edit' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.275 6:30  Error: 'Edit' is defined but never used.  no-unused-vars
12:50:04.275 
12:50:04.275 ./src/app/shop/products/new/page.tsx
12:50:04.275 11:16  Warning: 'X' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.276 11:16  Error: 'X' is defined but never used.  no-unused-vars
12:50:04.276 23:10  Warning: 'images' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.276 23:10  Error: 'images' is assigned a value but never used.  no-unused-vars
12:50:04.276 23:18  Warning: 'setImages' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.276 23:18  Error: 'setImages' is assigned a value but never used.  no-unused-vars
12:50:04.276 
12:50:04.276 ./src/app/shop-manager/inquiries/page.tsx
12:50:04.276 30:78  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
12:50:04.276 30:97  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
12:50:04.276 
12:50:04.276 ./src/app/shop-manager/inventory/update/page.tsx
12:50:04.276 14:24  Warning: 'setCurrentStock' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.276 14:24  Error: 'setCurrentStock' is assigned a value but never used.  no-unused-vars
12:50:04.276 
12:50:04.276 ./src/app/shop-manager/orders/[id]/page.tsx
12:50:04.276 6:35  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.276 6:35  Error: 'Package' is defined but never used.  no-unused-vars
12:50:04.276 6:44  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.276 6:44  Error: 'User' is defined but never used.  no-unused-vars
12:50:04.276 
12:50:04.276 ./src/components/admin/AddModerator.tsx
12:50:04.276 8:24  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.276 
12:50:04.276 ./src/components/admin/AdminBillingManagement.tsx
12:50:04.276 1:41  Warning: 'Building' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.276 1:41  Error: 'Building' is defined but never used.  no-unused-vars
12:50:04.276 
12:50:04.276 ./src/components/admin/AdminDashboard.tsx
12:50:04.276 1:25  Warning: 'Building2' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.276 1:25  Error: 'Building2' is defined but never used.  no-unused-vars
12:50:04.277 2:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.277 2:10  Error: 'Button' is defined but never used.  no-unused-vars
12:50:04.277 18:3  Warning: 'onAnalytics' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.277 18:3  Error: 'onAnalytics' is defined but never used.  no-unused-vars
12:50:04.277 
12:50:04.277 ./src/components/admin/AdminDecisionPanel.tsx
12:50:04.277 1:43  Warning: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.277 1:43  Error: 'FileText' is defined but never used.  no-unused-vars
12:50:04.277 84:70  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.278 
12:50:04.278 ./src/components/admin/AdminMessages.tsx
12:50:04.278 1:25  Warning: 'Send' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.278 1:25  Error: 'Send' is defined but never used.  no-unused-vars
12:50:04.278 1:31  Warning: 'Paperclip' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.278 1:31  Error: 'Paperclip' is defined but never used.  no-unused-vars
12:50:04.278 2:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.278 2:10  Error: 'Button' is defined but never used.  no-unused-vars
12:50:04.278 
12:50:04.278 ./src/components/admin/AgencyPackageTemplateEditor.tsx
12:50:04.278 18:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.278 
12:50:04.278 ./src/components/admin/AgencySubscriptionPackageCreatorAdmin.tsx
12:50:04.278 1:10  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.278 1:10  Error: 'Package' is defined but never used.  no-unused-vars
12:50:04.278 9:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.278 10:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.278 
12:50:04.278 ./src/components/admin/AuditLogs.tsx
12:50:04.278 1:28  Warning: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.278 1:28  Error: 'Filter' is defined but never used.  no-unused-vars
12:50:04.278 67:71  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.278 
12:50:04.278 ./src/components/admin/CVPoolManagementAdmin.tsx
12:50:04.278 1:25  Warning: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.278 1:25  Error: 'Filter' is defined but never used.  no-unused-vars
12:50:04.278 
12:50:04.278 ./src/components/admin/CaregiverDirectVerificationQueue.tsx
12:50:04.278 1:24  Warning: 'CheckCircle' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.278 1:24  Error: 'CheckCircle' is defined but never used.  no-unused-vars
12:50:04.278 
12:50:04.278 ./src/components/admin/CaregiverPackageTemplateEditor.tsx
12:50:04.278 18:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.278 
12:50:04.278 ./src/components/admin/CaregiverPsychAnalysisReview.tsx
12:50:04.279 1:10  Warning: 'Brain' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.279 1:10  Error: 'Brain' is defined but never used.  no-unused-vars
12:50:04.279 
12:50:04.279 ./src/components/admin/CaregiverSubscriptionPackageCreatorAdmin.tsx
12:50:04.279 1:10  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.279 1:10  Error: 'Package' is defined but never used.  no-unused-vars
12:50:04.279 9:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.279 10:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.279 
12:50:04.279 ./src/components/admin/DisputeCenterEscalated.tsx
12:50:04.279 1:25  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.279 1:25  Error: 'User' is defined but never used.  no-unused-vars
12:50:04.279 1:59  Warning: 'XCircle' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.279 1:59  Error: 'XCircle' is defined but never used.  no-unused-vars
12:50:04.279 
12:50:04.279 ./src/components/admin/EditModerator.tsx
12:50:04.279 1:10  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.279 1:10  Error: 'User' is defined but never used.  no-unused-vars
12:50:04.279 1:16  Warning: 'Mail' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.279 1:16  Error: 'Mail' is defined but never used.  no-unused-vars
12:50:04.279 20:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.279 
12:50:04.279 ./src/components/admin/FinancialOversight.tsx
12:50:04.279 44:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.279 
12:50:04.279 ./src/components/admin/ManualUnlock.tsx
12:50:04.279 1:31  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.279 1:31  Error: 'User' is defined but never used.  no-unused-vars
12:50:04.279 
12:50:04.279 ./src/components/admin/ModeratorManagement.tsx
12:50:04.279 51:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.279 
12:50:04.279 ./src/components/admin/ModeratorSubmissionsQueue.tsx
12:50:04.279 1:25  Warning: 'CheckCircle' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.280 1:25  Error: 'CheckCircle' is defined but never used.  no-unused-vars
12:50:04.280 1:38  Warning: 'XCircle' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.280 1:38  Error: 'XCircle' is defined but never used.  no-unused-vars
12:50:04.280 1:47  Warning: 'ArrowLeft' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.280 1:47  Error: 'ArrowLeft' is defined but never used.  no-unused-vars
12:50:04.280 36:24  Warning: 'type' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.280 36:24  Error: 'type' is defined but never used.  no-unused-vars
12:50:04.280 50:50  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.280 
12:50:04.280 ./src/components/admin/PlatformAnalytics.tsx
12:50:04.280 1:10  Warning: 'TrendingUp' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.280 1:10  Error: 'TrendingUp' is defined but never used.  no-unused-vars
12:50:04.280 45:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.280 
12:50:04.280 ./src/components/admin/SubmissionReviewPanel.tsx
12:50:04.280 57:62  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.280 
12:50:04.280 ./src/components/admin/SupportTicketsEscalated.tsx
12:50:04.280 1:22  Warning: 'Clock' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.280 1:22  Error: 'Clock' is defined but never used.  no-unused-vars
12:50:04.280 
12:50:04.282 ./src/components/admin/SystemMonitoring.tsx
12:50:04.282 1:10  Warning: 'Activity' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.282 1:10  Error: 'Activity' is defined but never used.  no-unused-vars
12:50:04.282 1:56  Warning: 'TrendingUp' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.282 1:56  Error: 'TrendingUp' is defined but never used.  no-unused-vars
12:50:04.282 
12:50:04.282 ./src/components/admin/SystemSettings.tsx
12:50:04.282 1:10  Warning: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.282 1:10  Error: 'Settings' is defined but never used.  no-unused-vars
12:50:04.282 15:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.282 
12:50:04.282 ./src/components/admin/UserManagement.tsx
12:50:04.282 65:71  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.282 77:77  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.282 
12:50:04.282 ./src/components/agency/AddCaregiverOptions.tsx
12:50:04.282 16:25  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.282 29:56  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.282 29:84  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.282 
12:50:04.282 ./src/components/agency/AgencyAdminDashboard.tsx
12:50:04.282 1:52  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.282 1:52  Error: 'Package' is defined but never used.  no-unused-vars
12:50:04.282 1:61  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.282 1:61  Error: 'Calendar' is defined but never used.  no-unused-vars
12:50:04.282 1:71  Warning: 'TrendingUp' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.282 1:71  Error: 'TrendingUp' is defined but never used.  no-unused-vars
12:50:04.285 2:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.285 2:10  Error: 'Button' is defined but never used.  no-unused-vars
12:50:04.285 18:3  Warning: 'onViewCaregivers' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.285 18:3  Error: 'onViewCaregivers' is defined but never used.  no-unused-vars
12:50:04.285 19:3  Warning: 'onViewFinance' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.285 19:3  Error: 'onViewFinance' is defined but never used.  no-unused-vars
12:50:04.285 
12:50:04.285 ./src/components/agency/AgencyAnalytics.tsx
12:50:04.285 41:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.286 
12:50:04.286 ./src/components/agency/AgencyManagerDashboard.tsx
12:50:04.287 2:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.287 2:10  Error: 'Button' is defined but never used.  no-unused-vars
12:50:04.287 
12:50:04.287 ./src/components/agency/AgencyOnboarding.tsx
12:50:04.288 14:14  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.288 
12:50:04.288 ./src/components/agency/AgencyPendingVerification.tsx
12:50:04.288 1:17  Warning: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.288 1:17  Error: 'FileText' is defined but never used.  no-unused-vars
12:50:04.288 107:26  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.288 
12:50:04.288 ./src/components/agency/AgencyProfile.tsx
12:50:04.288 40:15  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
12:50:04.288 
12:50:04.288 ./src/components/agency/AgencyRegistration.tsx
12:50:04.288 1:46  Warning: 'Mail' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.288 1:46  Error: 'Mail' is defined but never used.  no-unused-vars
12:50:04.288 9:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.289 13:50  Warning: 'onBack' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.289 13:50  Error: 'onBack' is defined but never used.  no-unused-vars
12:50:04.289 
12:50:04.289 ./src/components/agency/AgencyRegistrationStep3.tsx
12:50:04.289 9:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.290 
12:50:04.291 ./src/components/agency/AgencyRegistrationStep4.tsx
12:50:04.291 1:47  Warning: 'X' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.291 1:47  Error: 'X' is defined but never used.  no-unused-vars
12:50:04.291 7:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.291 108:19  Warning: Image elements must have an alt prop, either with meaningful text, or an empty string for decorative images.  jsx-a11y/alt-text
12:50:04.291 
12:50:04.291 ./src/components/agency/AgencyRegistrationStep5.tsx
12:50:04.291 8:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.291 45:67  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.291 
12:50:04.291 ./src/components/agency/AgencySettings.tsx
12:50:04.291 20:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.291 
12:50:04.291 ./src/components/agency/AssignCaregiverFlow.tsx
12:50:04.291 1:22  Warning: 'Briefcase' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.291 1:22  Error: 'Briefcase' is defined but never used.  no-unused-vars
12:50:04.291 27:3  Warning: 'jobId' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.291 27:3  Error: 'jobId' is defined but never used.  no-unused-vars
12:50:04.291 
12:50:04.291 ./src/components/agency/BillingHistory.tsx
12:50:04.291 41:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.291 
12:50:04.291 ./src/components/agency/CaregiverPoolSearch.tsx
12:50:04.291 94:25  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
12:50:04.291 
12:50:04.291 ./src/components/agency/CaregiverProfileView.tsx
12:50:04.291 1:37  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.291 1:37  Error: 'Calendar' is defined but never used.  no-unused-vars
12:50:04.291 
12:50:04.291 ./src/components/agency/CaregiverRoster.tsx
12:50:04.291 1:49  Warning: 'Clock' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.291 1:49  Error: 'Clock' is defined but never used.  no-unused-vars
12:50:04.296 131:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.296 
12:50:04.296 ./src/components/agency/FeedbackQueue.tsx
12:50:04.296 1:25  Warning: 'Clock' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.296 1:25  Error: 'Clock' is defined but never used.  no-unused-vars
12:50:04.296 37:45  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.296 
12:50:04.296 ./src/components/agency/JobInbox.tsx
12:50:04.296 77:50  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.296 
12:50:04.296 ./src/components/agency/ManagerReports.tsx
12:50:04.296 1:30  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.296 1:30  Error: 'Calendar' is defined but never used.  no-unused-vars
12:50:04.296 
12:50:04.297 ./src/components/agency/PackageInquiries.tsx
12:50:04.298 44:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.298 
12:50:04.298 ./src/components/agency/PackageManagement.tsx
12:50:04.298 117:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.299 
12:50:04.299 ./src/components/agency/QADashboard.tsx
12:50:04.299 1:10  Warning: 'TrendingUp' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.299 1:10  Error: 'TrendingUp' is defined but never used.  no-unused-vars
12:50:04.299 
12:50:04.299 ./src/components/agency/ReviewCounterOffer.tsx
12:50:04.299 96:72  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.299 
12:50:04.299 ./src/components/ai-assistant/AIAssistant.tsx
12:50:04.299 16:5  Warning: 'X' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.299 16:5  Error: 'X' is defined but never used.  no-unused-vars
12:50:04.299 18:5  Warning: 'Maximize2' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.299 18:5  Error: 'Maximize2' is defined but never used.  no-unused-vars
12:50:04.299 21:5  Warning: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.299 21:5  Error: 'Settings' is defined but never used.  no-unused-vars
12:50:04.299 22:5  Warning: 'HelpCircle' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.299 22:5  Error: 'HelpCircle' is defined but never used.  no-unused-vars
12:50:04.299 24:30  Warning: 'IntentType' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.308 24:30  Error: 'IntentType' is defined but never used.  no-unused-vars
12:50:04.309 60:45  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.309 
12:50:04.309 ./src/components/auth/Login.tsx
12:50:04.309 158:16  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.309 
12:50:04.309 ./src/components/auth/RoleSelection.tsx
12:50:04.309 3:10  Warning: 'Card' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.310 3:10  Error: 'Card' is defined but never used.  no-unused-vars
12:50:04.310 61:27  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.310 
12:50:04.310 ./src/components/caregiver/CareLogInterface.tsx
12:50:04.310 1:51  Warning: 'Plus' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.310 1:51  Error: 'Plus' is defined but never used.  no-unused-vars
12:50:04.310 9:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.310 15:59  Warning: 'onBack' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.310 15:59  Error: 'onBack' is defined but never used.  no-unused-vars
12:50:04.310 81:68  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.310 
12:50:04.310 ./src/components/caregiver/CaregiverDashboard.tsx
12:50:04.310 1:18  Warning: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.310 1:18  Error: 'Phone' is defined but never used.  no-unused-vars
12:50:04.316 1:60  Warning: 'MessageSquare' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.316 1:60  Error: 'MessageSquare' is defined but never used.  no-unused-vars
12:50:04.316 1:75  Warning: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.316 1:75  Error: 'Settings' is defined but never used.  no-unused-vars
12:50:04.316 57:68  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.316 
12:50:04.316 ./src/components/caregiver/CaregiverRegistration.tsx
12:50:04.316 2:50  Warning: 'CalendarIcon' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.317 2:50  Error: 'CalendarIcon' is defined but never used.  no-unused-vars
12:50:04.317 16:53  Warning: 'onBack' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.317 16:53  Error: 'onBack' is defined but never used.  no-unused-vars
12:50:04.317 39:10  Warning: 'certifications' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.317 39:10  Error: 'certifications' is assigned a value but never used.  no-unused-vars
12:50:04.317 39:26  Warning: 'setCertifications' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.317 39:26  Error: 'setCertifications' is assigned a value but never used.  no-unused-vars
12:50:04.318 42:10  Warning: 'hourlyRate' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.318 42:10  Error: 'hourlyRate' is assigned a value but never used.  no-unused-vars
12:50:04.318 42:22  Warning: 'setHourlyRate' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.318 42:22  Error: 'setHourlyRate' is assigned a value but never used.  no-unused-vars
12:50:04.318 
12:50:04.318 ./src/components/caregiver/CaregiverVerification.tsx
12:50:04.318 10:72  Warning: 'onComplete' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.318 10:72  Error: 'onComplete' is defined but never used.  no-unused-vars
12:50:04.318 65:48  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.318 224:19  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.318 263:19  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.318 274:20  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.318 
12:50:04.318 ./src/components/caregiver/CheckIn.tsx
12:50:04.318 1:46  Warning: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.318 1:46  Error: 'FileText' is defined but never used.  no-unused-vars
12:50:04.318 3:10  Warning: 'Badge' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.318 3:10  Error: 'Badge' is defined but never used.  no-unused-vars
12:50:04.319 39:16  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.319 39:53  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.319 117:19  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.319 117:33  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.319 
12:50:04.319 ./src/components/caregiver/CheckInFlow.tsx
12:50:04.319 16:31  Warning: 'jobId' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.319 16:31  Error: 'jobId' is defined but never used.  no-unused-vars
12:50:04.319 19:10  Warning: 'locationMatch' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.319 19:10  Error: 'locationMatch' is assigned a value but never used.  no-unused-vars
12:50:04.319 21:10  Warning: 'photo' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.319 21:10  Error: 'photo' is assigned a value but never used.  no-unused-vars
12:50:04.319 150:42  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.319 270:18  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.319 
12:50:04.319 ./src/components/caregiver/CheckOutFlow.tsx
12:50:04.319 1:28  Warning: 'Star' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.319 1:28  Error: 'Star' is defined but never used.  no-unused-vars
12:50:04.320 10:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.320 16:32  Warning: 'jobId' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.320 16:32  Error: 'jobId' is defined but never used.  no-unused-vars
12:50:04.320 
12:50:04.320 ./src/components/caregiver/Earnings.tsx
12:50:04.320 1:10  Warning: 'DollarSign' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.320 1:10  Error: 'DollarSign' is defined but never used.  no-unused-vars
12:50:04.320 18:28  Warning: 'onNavigate' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.320 18:28  Error: 'onNavigate' is defined but never used.  no-unused-vars
12:50:04.320 
12:50:04.320 ./src/components/caregiver/EarningsSummary.tsx
12:50:04.320 1:44  Warning: 'Download' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.320 1:44  Error: 'Download' is defined but never used.  no-unused-vars
12:50:04.320 1:54  Warning: 'Eye' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.320 1:54  Error: 'Eye' is defined but never used.  no-unused-vars
12:50:04.320 
12:50:04.322 ./src/components/caregiver/EmergencyProtocol.tsx
12:50:04.322 12:26  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.322 17:3  Warning: 'guardianPhone' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.322 17:3  Error: 'guardianPhone' is defined but never used.  no-unused-vars
12:50:04.322 
12:50:04.322 ./src/components/caregiver/GenerateInvoice.tsx
12:50:04.322 1:20  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.322 1:20  Error: 'Calendar' is defined but never used.  no-unused-vars
12:50:04.322 1:30  Warning: 'DollarSign' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.322 1:30  Error: 'DollarSign' is defined but never used.  no-unused-vars
12:50:04.324 1:42  Warning: 'Download' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.324 1:42  Error: 'Download' is defined but never used.  no-unused-vars
12:50:04.324 1:52  Warning: 'Send' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.324 1:52  Error: 'Send' is defined but never used.  no-unused-vars
12:50:04.324 8:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.330 
12:50:04.330 ./src/components/caregiver/JobDetail.tsx
12:50:04.331 1:51  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.331 1:51  Error: 'User' is defined but never used.  no-unused-vars
12:50:04.331 73:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.331 
12:50:04.331 ./src/components/caregiver/MyJobs.tsx
12:50:04.331 1:10  Warning: 'Briefcase' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.331 1:10  Error: 'Briefcase' is defined but never used.  no-unused-vars
12:50:04.331 1:21  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.331 1:21  Error: 'Calendar' is defined but never used.  no-unused-vars
12:50:04.331 1:46  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.331 1:46  Error: 'User' is defined but never used.  no-unused-vars
12:50:04.331 1:65  Warning: 'AlertCircle' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.331 1:65  Error: 'AlertCircle' is defined but never used.  no-unused-vars
12:50:04.331 23:26  Warning: 'onNavigate' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.331 23:26  Error: 'onNavigate' is defined but never used.  no-unused-vars
12:50:04.331 
12:50:04.331 ./src/components/caregiver/MyJobsList.tsx
12:50:04.331 2:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.332 2:10  Error: 'Button' is defined but never used.  no-unused-vars
12:50:04.332 81:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.332 
12:50:04.332 ./src/components/caregiver/RateGuardian.tsx
12:50:04.332 9:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.332 13:46  Warning: 'jobId' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.332 13:46  Error: 'jobId' is defined but never used.  no-unused-vars
12:50:04.332 
12:50:04.332 ./src/components/caregiver/SubscriptionPlans.tsx
12:50:04.332 10:64  Warning: 'onBack' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.332 10:64  Error: 'onBack' is defined but never used.  no-unused-vars
12:50:04.332 
12:50:04.332 ./src/components/caregiver/TrainingResources.tsx
12:50:04.332 49:71  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.332 
12:50:04.332 ./src/components/caregiver/VerificationComplete.tsx
12:50:04.332 27:77  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.333 
12:50:04.333 ./src/components/caregiver/VerificationPsychTest.tsx
12:50:04.333 86:52  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
12:50:04.333 86:58  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
12:50:04.333 
12:50:04.333 ./src/components/caregiver/ViewJobHistory.tsx
12:50:04.333 34:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.333 
12:50:04.333 ./src/components/caregiver/WithdrawEarnings.tsx
12:50:04.333 9:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.333 
12:50:04.333 ./src/components/common/Notifications.tsx
12:50:04.333 1:10  Warning: 'Bell' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.333 1:10  Error: 'Bell' is defined but never used.  no-unused-vars
12:50:04.333 3:10  Warning: 'Badge' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.333 3:10  Error: 'Badge' is defined but never used.  no-unused-vars
12:50:04.333 18:33  Warning: 'onNavigate' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.334 18:33  Error: 'onNavigate' is defined but never used.  no-unused-vars
12:50:04.340 
12:50:04.341 ./src/components/common/Settings.tsx
12:50:04.341 1:73  Warning: 'Sun' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.341 1:73  Error: 'Sun' is defined but never used.  no-unused-vars
12:50:04.341 1:78  Warning: 'Volume2' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.341 1:78  Error: 'Volume2' is defined but never used.  no-unused-vars
12:50:04.341 
12:50:04.341 ./src/components/global/AISearch.tsx
12:50:04.341 3:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.341 3:10  Error: 'Button' is defined but never used.  no-unused-vars
12:50:04.341 
12:50:04.341 ./src/components/global/BottomNav.tsx
12:50:04.341 15:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.341 
12:50:04.341 ./src/components/global/ProfileMenu.tsx
12:50:04.342 1:10  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.342 1:10  Error: 'User' is defined but never used.  no-unused-vars
12:50:04.342 9:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.342 
12:50:04.342 ./src/components/global/ThemeSelector.tsx
12:50:04.342 2:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.342 2:10  Error: 'Button' is defined but never used.  no-unused-vars
12:50:04.342 
12:50:04.342 ./src/components/global/TopBar.tsx
12:50:04.342 2:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.342 2:10  Error: 'Button' is defined but never used.  no-unused-vars
12:50:04.342 17:49  Warning: 'onLogout' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.342 17:49  Error: 'onLogout' is defined but never used.  no-unused-vars
12:50:04.342 
12:50:04.342 ./src/components/guardian/ActiveJobs.tsx
12:50:04.342 1:10  Warning: 'Briefcase' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.342 1:10  Error: 'Briefcase' is defined but never used.  no-unused-vars
12:50:04.342 1:52  Warning: 'DollarSign' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.343 1:52  Error: 'DollarSign' is defined but never used.  no-unused-vars
12:50:04.343 23:30  Warning: 'onNavigate' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.343 23:30  Error: 'onNavigate' is defined but never used.  no-unused-vars
12:50:04.343 
12:50:04.343 ./src/components/guardian/ActiveJobsList.tsx
12:50:04.343 1:18  Warning: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.343 1:18  Error: 'Filter' is defined but never used.  no-unused-vars
12:50:04.343 1:42  Warning: 'MapPin' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.343 1:42  Error: 'MapPin' is defined but never used.  no-unused-vars
12:50:04.343 1:50  Warning: 'AlertCircle' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.343 1:50  Error: 'AlertCircle' is defined but never used.  no-unused-vars
12:50:04.343 2:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.343 2:10  Error: 'Button' is defined but never used.  no-unused-vars
12:50:04.343 94:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.343 
12:50:04.343 ./src/components/guardian/AddPatient.tsx
12:50:04.343 10:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.343 60:5  Warning: Unexpected console statement.  no-console
12:50:04.344 
12:50:04.344 ./src/components/guardian/BillingInvoices.tsx
12:50:04.344 1:48  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.344 1:48  Error: 'Calendar' is defined but never used.  no-unused-vars
12:50:04.344 116:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.344 
12:50:04.344 ./src/components/guardian/EditPatient.tsx
12:50:04.344 1:33  Warning: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.344 1:33  Error: 'Phone' is defined but never used.  no-unused-vars
12:50:04.344 1:40  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.344 1:40  Error: 'Calendar' is defined but never used.  no-unused-vars
12:50:04.344 1:50  Warning: 'MapPin' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.344 1:50  Error: 'MapPin' is defined but never used.  no-unused-vars
12:50:04.344 22:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.344 26:31  Warning: 'patientId' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.358 26:31  Error: 'patientId' is defined but never used.  no-unused-vars
12:50:04.358 
12:50:04.358 ./src/components/guardian/GuardianDashboard.tsx
12:50:04.358 2:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.359 2:10  Error: 'Button' is defined but never used.  no-unused-vars
12:50:04.359 
12:50:04.359 ./src/components/guardian/GuardianRegistration.tsx
12:50:04.359 15:52  Warning: 'onBack' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.359 15:52  Error: 'onBack' is defined but never used.  no-unused-vars
12:50:04.359 41:5  Warning: Unexpected console statement.  no-console
12:50:04.359 57:5  Warning: Unexpected console statement.  no-console
12:50:04.359 66:5  Warning: Unexpected console statement.  no-console
12:50:04.359 
12:50:04.359 ./src/components/guardian/JobDetail.tsx
12:50:04.359 13:29  Warning: 'jobId' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.359 13:29  Error: 'jobId' is defined but never used.  no-unused-vars
12:50:04.359 141:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.359 
12:50:04.359 ./src/components/guardian/MyPatients.tsx
12:50:04.359 1:10  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.360 1:10  Error: 'User' is defined but never used.  no-unused-vars
12:50:04.360 1:22  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.360 1:22  Error: 'Calendar' is defined but never used.  no-unused-vars
12:50:04.360 1:47  Warning: 'Mail' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.360 1:47  Error: 'Mail' is defined but never used.  no-unused-vars
12:50:04.361 1:67  Warning: 'ArrowUpRight' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.361 1:67  Error: 'ArrowUpRight' is defined but never used.  no-unused-vars
12:50:04.361 
12:50:04.361 ./src/components/guardian/NegotiationFlow.tsx
12:50:04.361 15:24  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.364 23:3  Warning: 'packageId' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.364 23:3  Error: 'packageId' is defined but never used.  no-unused-vars
12:50:04.364 174:70  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.364 
12:50:04.364 ./src/components/guardian/PackageDetail.tsx
12:50:04.365 12:33  Warning: 'packageId' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.365 12:33  Error: 'packageId' is defined but never used.  no-unused-vars
12:50:04.365 115:65  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.365 
12:50:04.365 ./src/components/guardian/PackageFilters.tsx
12:50:04.365 10:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.365 
12:50:04.365 ./src/components/guardian/PatientDetail.tsx
12:50:04.365 1:52  Warning: 'Activity' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.367 1:52  Error: 'Activity' is defined but never used.  no-unused-vars
12:50:04.367 1:83  Warning: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.367 1:83  Error: 'Phone' is defined but never used.  no-unused-vars
12:50:04.367 13:33  Warning: 'patientId' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.367 13:33  Error: 'patientId' is defined but never used.  no-unused-vars
12:50:04.368 115:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.368 
12:50:04.368 ./src/components/guardian/PatientHealthRecords.tsx
12:50:04.368 1:21  Warning: 'Upload' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.368 1:21  Error: 'Upload' is defined but never used.  no-unused-vars
12:50:04.368 12:40  Warning: 'patientId' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.377 12:40  Error: 'patientId' is defined but never used.  no-unused-vars
12:50:04.377 75:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.377 
12:50:04.377 ./src/components/guardian/PaymentSuccess.tsx
12:50:04.377 94:65  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.377 
12:50:04.377 ./src/components/guardian/PrescriptionUpload.tsx
12:50:04.377 9:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.377 12:38  Warning: 'patientId' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.377 12:38  Error: 'patientId' is defined but never used.  no-unused-vars
12:50:04.377 
12:50:04.377 ./src/components/guardian/RateReviewCaregiver.tsx
12:50:04.377 1:19  Warning: 'ThumbsUp' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.377 1:19  Error: 'ThumbsUp' is defined but never used.  no-unused-vars
12:50:04.377 1:29  Warning: 'ThumbsDown' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.377 1:29  Error: 'ThumbsDown' is defined but never used.  no-unused-vars
12:50:04.377 10:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.378 
12:50:04.378 ./src/components/guardian/ReportIssue.tsx
12:50:04.378 10:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.378 
12:50:04.378 ./src/components/guardian/ViewPrescriptionDetail.tsx
12:50:04.378 115:71  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.378 124:15  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
12:50:04.378 
12:50:04.382 ./src/components/layout/Layout.tsx
12:50:04.382 7:10  Warning: 'LanguageSwitcher' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.382 7:10  Error: 'LanguageSwitcher' is defined but never used.  no-unused-vars
12:50:04.382 7:28  Warning: 'ThemeSwitcher' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.382 7:28  Error: 'ThemeSwitcher' is defined but never used.  no-unused-vars
12:50:04.382 32:7  Warning: Unexpected console statement.  no-console
12:50:04.382 
12:50:04.382 ./src/components/layout/Navigation.tsx
12:50:04.382 7:10  Warning: 'UserRole' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.383 7:10  Error: 'UserRole' is defined but never used.  no-unused-vars
12:50:04.383 
12:50:04.383 ./src/components/layout/UniversalNav.tsx
12:50:04.383 5:54  Warning: 'Menu' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.383 5:54  Error: 'Menu' is defined but never used.  no-unused-vars
12:50:04.383 
12:50:04.383 ./src/components/lazy/index.tsx
12:50:04.383 90:61  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.383 
12:50:04.383 ./src/components/moderator/AgencyPackageTemplateCreator.tsx
12:50:04.383 1:10  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.383 1:10  Error: 'Package' is defined but never used.  no-unused-vars
12:50:04.383 9:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.383 
12:50:04.383 ./src/components/moderator/AgencyReviewQueue.tsx
12:50:04.383 35:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.383 
12:50:04.383 ./src/components/moderator/AgencySubscriptionPackageCreator.tsx
12:50:04.383 1:10  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.384 1:10  Error: 'Package' is defined but never used.  no-unused-vars
12:50:04.384 9:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.384 10:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.384 
12:50:04.384 ./src/components/moderator/CaregiverPackageTemplateCreator.tsx
12:50:04.384 1:10  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.384 1:10  Error: 'Package' is defined but never used.  no-unused-vars
12:50:04.384 9:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.384 
12:50:04.384 ./src/components/moderator/CaregiverPsychAnalysisQueue.tsx
12:50:04.384 1:44  Warning: 'AlertCircle' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.384 1:44  Error: 'AlertCircle' is defined but never used.  no-unused-vars
12:50:04.384 
12:50:04.384 ./src/components/moderator/CaregiverSubscriptionPackageCreator.tsx
12:50:04.384 1:10  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.385 1:10  Error: 'Package' is defined but never used.  no-unused-vars
12:50:04.385 9:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.385 10:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.385 
12:50:04.385 ./src/components/moderator/CaregiverVerificationQueue.tsx
12:50:04.385 60:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.385 
12:50:04.385 ./src/components/moderator/DisputeDetail.tsx
12:50:04.385 1:10  Warning: 'AlertTriangle' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.386 1:10  Error: 'AlertTriangle' is defined but never used.  no-unused-vars
12:50:04.386 
12:50:04.386 ./src/components/moderator/DisputeResolution.tsx
12:50:04.386 53:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.386 65:67  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.386 
12:50:04.386 ./src/components/moderator/InterviewScheduler.tsx
12:50:04.388 27:78  Warning: 'onAssignCaregiver' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.390 27:78  Error: 'onAssignCaregiver' is defined but never used.  no-unused-vars
12:50:04.390 30:10  Warning: 'selectedSlot' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.390 30:10  Error: 'selectedSlot' is assigned a value but never used.  no-unused-vars
12:50:04.390 
12:50:04.390 ./src/components/moderator/ModeratorDashboard.tsx
12:50:04.390 1:62  Warning: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.390 1:62  Error: 'FileText' is defined but never used.  no-unused-vars
12:50:04.390 17:3  Warning: 'onAnalytics' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.390 17:3  Error: 'onAnalytics' is defined but never used.  no-unused-vars
12:50:04.391 
12:50:04.391 ./src/components/moderator/ModeratorSettings.tsx
12:50:04.391 1:28  Warning: 'Mail' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.391 1:28  Error: 'Mail' is defined but never used.  no-unused-vars
12:50:04.391 17:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.391 
12:50:04.391 ./src/components/moderator/SupportTickets.tsx
12:50:04.391 54:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.391 66:67  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.391 
12:50:04.391 ./src/components/moderator/TicketResponse.tsx
12:50:04.392 1:10  Warning: 'HelpCircle' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.392 1:10  Error: 'HelpCircle' is defined but never used.  no-unused-vars
12:50:04.392 
12:50:04.392 ./src/components/moderator/VerificationQueue.tsx
12:50:04.392 130:18  Error: 'X' is not defined.  react/jsx-no-undef
12:50:04.392 130:18  Error: 'X' is not defined.  no-undef
12:50:04.392 
12:50:04.392 ./src/components/patient/AppointmentsSchedule.tsx
12:50:04.393 1:35  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.393 1:35  Error: 'User' is defined but never used.  no-unused-vars
12:50:04.393 68:50  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.393 
12:50:04.393 ./src/components/patient/CareLogsView.tsx
12:50:04.393 8:32  Warning: 'patientName' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.393 8:32  Error: 'patientName' is defined but never used.  no-unused-vars
12:50:04.393 93:55  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.393 
12:50:04.393 ./src/components/patient/EmergencyContacts.tsx
12:50:04.393 3:10  Warning: 'useState' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.394 3:10  Error: 'useState' is defined but never used.  no-unused-vars
12:50:04.394 
12:50:04.394 ./src/components/patient/EmergencySOS.tsx
12:50:04.394 1:30  Warning: 'MapPin' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.394 1:30  Error: 'MapPin' is defined but never used.  no-unused-vars
12:50:04.395 1:38  Warning: 'Heart' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.400 1:38  Error: 'Heart' is defined but never used.  no-unused-vars
12:50:04.401 21:32  Warning: 'patientName' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.401 21:32  Error: 'patientName' is defined but never used.  no-unused-vars
12:50:04.402 
12:50:04.402 ./src/components/patient/MedicationSchedule.tsx
12:50:04.402 10:38  Warning: 'patientName' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.402 10:38  Error: 'patientName' is defined but never used.  no-unused-vars
12:50:04.402 114:51  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.402 
12:50:04.402 ./src/components/patient/MyCaregiverProfile.tsx
12:50:04.402 1:54  Warning: 'Heart' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.403 1:54  Error: 'Heart' is defined but never used.  no-unused-vars
12:50:04.403 38:15  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
12:50:04.403 
12:50:04.403 ./src/components/patient/PatientDashboard.tsx
12:50:04.403 68:66  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.403 115:51  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.403 
12:50:04.404 ./src/components/patient/PatientSettings.tsx
12:50:04.404 1:10  Warning: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.404 1:10  Error: 'Settings' is defined but never used.  no-unused-vars
12:50:04.404 11:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.404 
12:50:04.404 ./src/components/patient/RateCaregiverPatient.tsx
12:50:04.404 8:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.404 
12:50:04.404 ./src/components/patient/ViewHealthRecords.tsx
12:50:04.405 25:66  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.405 
12:50:04.405 ./src/components/patients/PatientForm.tsx
12:50:04.405 5:81  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.405 5:102  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.407 33:7  Warning: Unexpected console statement.  no-console
12:50:04.407 
12:50:04.407 ./src/components/providers/ClientProviders.tsx
12:50:04.408 15:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.409 
12:50:04.410 ./src/components/providers/ServiceWorkerRegistration.tsx
12:50:04.410 11:11  Warning: Unexpected console statement.  no-console
12:50:04.410 19:11  Warning: Unexpected console statement.  no-console
12:50:04.410 
12:50:04.410 ./src/components/providers/TranslationProvider.tsx
12:50:04.410 20:44  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.410 24:32  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.411 60:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.412 73:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.412 86:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.412 97:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.413 108:9  Warning: Unexpected console statement.  no-console
12:50:04.413 
12:50:04.413 ./src/components/shared/ChatScreen.tsx
12:50:04.413 13:30  Warning: 'conversationId' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.413 13:30  Error: 'conversationId' is defined but never used.  no-unused-vars
12:50:04.413 35:5  Warning: Unexpected console statement.  no-console
12:50:04.413 
12:50:04.413 ./src/components/shared/LandingPage.tsx
12:50:04.417 45:23  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.417 
12:50:04.417 ./src/components/shared/MFAVerification.tsx
12:50:04.418 12:62  Warning: 'phoneNumber' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.418 12:62  Error: 'phoneNumber' is defined but never used.  no-unused-vars
12:50:04.418 
12:50:04.418 ./src/components/shared/NotFound.tsx
12:50:04.418 42:29  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.418 42:50  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.418 
12:50:04.418 ./src/components/shared/NotificationsCenter.tsx
12:50:04.418 1:10  Warning: 'Bell' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.419 1:10  Error: 'Bell' is defined but never used.  no-unused-vars
12:50:04.419 45:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.419 
12:50:04.419 ./src/components/shared/OfflineState.tsx
12:50:04.419 28:16  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.419 78:41  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.419 
12:50:04.419 ./src/components/shared/PasswordReset.tsx
12:50:04.420 24:5  Warning: Unexpected console statement.  no-console
12:50:04.420 40:5  Warning: Unexpected console statement.  no-console
12:50:04.420 49:5  Warning: Unexpected console statement.  no-console
12:50:04.420 
12:50:04.420 ./src/components/shared/PrivacyPolicy.tsx
12:50:04.420 46:33  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
12:50:04.420 46:36  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
12:50:04.421 46:39  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
12:50:04.421 46:42  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
12:50:04.421 46:48  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
12:50:04.421 46:52  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
12:50:04.421 191:74  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.421 
12:50:04.423 ./src/components/shared/TermsAndConditions.tsx
12:50:04.423 52:44  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
12:50:04.423 52:52  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
12:50:04.423 52:55  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
12:50:04.423 52:58  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
12:50:04.423 52:61  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
12:50:04.423 52:64  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
12:50:04.423 52:70  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
12:50:04.423 52:74  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
12:50:04.423 52:106  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
12:50:04.423 52:112  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
12:50:04.423 52:246  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
12:50:04.423 52:255  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
12:50:04.424 107:68  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.424 135:29  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.424 
12:50:04.424 ./src/components/shared/UserSettings.tsx
12:50:04.424 15:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.425 
12:50:04.432 ./src/components/shop/AddEditProduct.tsx
12:50:04.433 20:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.433 
12:50:04.433 ./src/components/shop/CustomerInquiries.tsx
12:50:04.433 51:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.433 
12:50:04.433 ./src/components/shop/InventoryManagement.tsx
12:50:04.433 57:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.433 
12:50:04.433 ./src/components/shop/OrderDetail.tsx
12:50:04.434 1:32  Warning: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.434 1:32  Error: 'Phone' is defined but never used.  no-unused-vars
12:50:04.434 1:61  Warning: 'XCircle' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.434 1:61  Error: 'XCircle' is defined but never used.  no-unused-vars
12:50:04.434 
12:50:04.434 ./src/components/shop/OrderProcessing.tsx
12:50:04.434 40:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.434 
12:50:04.434 ./src/components/shop/OrderQueue.tsx
12:50:04.434 50:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.435 
12:50:04.435 ./src/components/shop/OrderQueueManager.tsx
12:50:04.435 1:10  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.435 1:10  Error: 'Package' is defined but never used.  no-unused-vars
12:50:04.435 46:45  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.435 
12:50:04.435 ./src/components/shop/ProductManagement.tsx
12:50:04.435 50:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.435 75:25  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
12:50:04.435 
12:50:04.435 ./src/components/shop/ShopAnalytics.tsx
12:50:04.436 1:48  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.436 1:48  Error: 'Package' is defined but never used.  no-unused-vars
12:50:04.436 46:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.436 
12:50:04.436 ./src/components/shop/ShopBilling.tsx
12:50:04.436 1:32  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.436 1:32  Error: 'Calendar' is defined but never used.  no-unused-vars
12:50:04.436 
12:50:04.437 ./src/components/shop/ShopPaymentReminder.tsx
12:50:04.437 1:35  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.437 1:35  Error: 'Calendar' is defined but never used.  no-unused-vars
12:50:04.438 
12:50:04.438 ./src/components/shop/ShopPendingVerification.tsx
12:50:04.438 1:17  Warning: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.438 1:17  Error: 'FileText' is defined but never used.  no-unused-vars
12:50:04.438 96:26  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:50:04.438 
12:50:04.438 ./src/components/shop/ShopRegistration.tsx
12:50:04.438 9:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.438 
12:50:04.438 ./src/components/shop/ShopSettings.tsx
12:50:04.438 1:17  Warning: 'MapPin' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.438 1:17  Error: 'MapPin' is defined but never used.  no-unused-vars
12:50:04.438 24:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.438 
12:50:04.438 ./src/components/ui/bkash-payment.tsx
12:50:04.438 20:3  Warning: 'onSuccess' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.438 20:3  Error: 'onSuccess' is defined but never used.  no-unused-vars
12:50:04.439 50:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.439 51:7  Warning: Unexpected console statement.  no-console
12:50:04.439 
12:50:04.439 ./src/components/ui/dashboard-charts.tsx
12:50:04.439 2:10  Warning: 'Chart' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.439 2:10  Error: 'Chart' is defined but never used.  no-unused-vars
12:50:04.439 
12:50:04.439 ./src/components/ui/data-table.tsx
12:50:04.439 21:91  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.439 
12:50:04.439 ./src/components/ui/language-switcher.tsx
12:50:04.439 11:11  Warning: 't' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.439 11:11  Error: 't' is assigned a value but never used.  no-unused-vars
12:50:04.439 
12:50:04.440 ./src/components/ui/nagad-payment.tsx
12:50:04.440 20:3  Warning: 'onSuccess' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.440 20:3  Error: 'onSuccess' is defined but never used.  no-unused-vars
12:50:04.440 49:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.440 50:7  Warning: Unexpected console statement.  no-console
12:50:04.440 
12:50:04.440 ./src/hooks/use-ai-agent.ts
12:50:04.440 107:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.441 126:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.441 140:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.441 
12:50:04.441 ./src/hooks/use-camera.ts
12:50:04.441 78:7  Warning: Unexpected console statement.  no-console
12:50:04.441 156:7  Warning: Unexpected console statement.  no-console
12:50:04.441 
12:50:04.441 ./src/hooks/use-geolocation.ts
12:50:04.441 3:20  Warning: 'useEffect' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.441 3:20  Error: 'useEffect' is defined but never used.  no-unused-vars
12:50:04.441 
12:50:04.442 ./src/hooks/use-touch-audit.tsx
12:50:04.442 43:13  Warning: 'paddingTop' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.442 43:13  Error: 'paddingTop' is assigned a value but never used.  no-unused-vars
12:50:04.442 44:13  Warning: 'paddingBottom' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.442 44:13  Error: 'paddingBottom' is assigned a value but never used.  no-unused-vars
12:50:04.442 45:13  Warning: 'paddingLeft' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.442 45:13  Error: 'paddingLeft' is assigned a value but never used.  no-unused-vars
12:50:04.443 46:13  Warning: 'paddingRight' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.443 46:13  Error: 'paddingRight' is assigned a value but never used.  no-unused-vars
12:50:04.443 163:6  Warning: React Hook useEffect has a missing dependency: 'auditTouchTargets'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
12:50:04.443 
12:50:04.443 ./src/hooks/useApi.ts
12:50:04.443 2:10  Warning: 'ApiResponse' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.444 2:10  Error: 'ApiResponse' is defined but never used.  no-unused-vars
12:50:04.444 17:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.444 21:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.444 22:26  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.444 34:47  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.444 91:37  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.444 92:55  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.445 185:30  Warning: 'T' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.445 185:30  Error: 'T' is defined but never used.  no-unused-vars
12:50:04.445 190:33  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.445 243:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.445 247:35  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.445 248:26  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.445 257:47  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.445 
12:50:04.446 ./src/hooks/useAuth.ts
12:50:04.447 56:9  Warning: Unexpected console statement.  no-console
12:50:04.447 192:7  Warning: Unexpected console statement.  no-console
12:50:04.447 243:5  Error: Unnecessary try/catch wrapper.  no-useless-catch
12:50:04.448 318:5  Error: Unnecessary try/catch wrapper.  no-useless-catch
12:50:04.448 
12:50:04.448 ./src/hooks/useOfflineSync.ts
12:50:04.448 57:7  Warning: Unexpected console statement.  no-console
12:50:04.448 88:7  Warning: Unexpected console statement.  no-console
12:50:04.448 102:6  Warning: React Hook useCallback has a missing dependency: 'options'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
12:50:04.449 105:51  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.449 109:7  Warning: Unexpected console statement.  no-console
12:50:04.449 115:67  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.449 122:7  Warning: Unexpected console statement.  no-console
12:50:04.449 143:7  Warning: Unexpected console statement.  no-console
12:50:04.449 168:37  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.449 
12:50:04.450 ./src/hooks/useTranslation.ts
12:50:04.450 2:21  Warning: 'tSync' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.450 2:21  Error: 'tSync' is defined but never used.  no-unused-vars
12:50:04.450 19:44  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.450 48:32  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.450 80:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.451 
12:50:04.451 ./src/lib/admin.ts
12:50:04.451 5:45  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.451 24:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.451 29:46  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.451 39:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.451 39:54  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.451 40:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.451 41:24  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.451 44:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.452 51:100  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.452 53:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.452 
12:50:04.452 ./src/lib/auth.ts
12:50:04.452 1:15  Warning: 'SignOptions' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.452 1:15  Error: 'SignOptions' is defined but never used.  no-unused-vars
12:50:04.452 9:24  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.453 74:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.453 82:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.453 157:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.453 
12:50:04.453 ./src/lib/cdn-service.ts
12:50:04.453 88:7  Warning: Unexpected console statement.  no-console
12:50:04.453 115:7  Warning: Unexpected console statement.  no-console
12:50:04.454 135:7  Warning: Unexpected console statement.  no-console
12:50:04.454 167:7  Warning: Unexpected console statement.  no-console
12:50:04.454 
12:50:04.454 ./src/lib/chat-analytics.ts
12:50:04.454 9:10  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.454 10:29  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.454 111:74  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.454 128:78  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.455 145:76  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.455 163:80  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.455 181:74  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.455 200:24  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.455 229:66  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.455 234:66  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.455 235:71  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.455 236:74  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.456 237:73  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.456 403:3  Warning: Unexpected console statement.  no-console
12:50:04.456 
12:50:04.456 ./src/lib/db-utils.ts
12:50:04.456 89:11  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.456 122:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.457 220:14  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.457 233:5  Warning: Unexpected console statement.  no-console
12:50:04.457 
12:50:04.457 ./src/lib/escrow-service.ts
12:50:04.457 30:29  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.458 38:29  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.460 118:7  Warning: Unexpected console statement.  no-console
12:50:04.461 193:7  Warning: Unexpected console statement.  no-console
12:50:04.461 257:7  Warning: Unexpected console statement.  no-console
12:50:04.461 315:7  Warning: Unexpected console statement.  no-console
12:50:04.461 339:7  Warning: Unexpected console statement.  no-console
12:50:04.461 353:26  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.462 391:7  Warning: Unexpected console statement.  no-console
12:50:04.462 399:91  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.462 421:7  Warning: Unexpected console statement.  no-console
12:50:04.463 433:31  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.463 447:7  Warning: Unexpected console statement.  no-console
12:50:04.463 
12:50:04.463 ./src/lib/fcm-service.ts
12:50:04.463 41:13  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.463 61:9  Warning: Unexpected console statement.  no-console
12:50:04.463 72:7  Warning: Unexpected console statement.  no-console
12:50:04.463 74:7  Warning: Unexpected console statement.  no-console
12:50:04.463 105:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.463 113:31  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.463 123:46  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.464 128:7  Warning: Unexpected console statement.  no-console
12:50:04.464 150:31  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.464 158:7  Warning: Unexpected console statement.  no-console
12:50:04.465 186:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.465 192:7  Warning: Unexpected console statement.  no-console
12:50:04.465 217:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.465 223:7  Warning: Unexpected console statement.  no-console
12:50:04.465 257:7  Warning: Unexpected console statement.  no-console
12:50:04.465 275:7  Warning: Unexpected console statement.  no-console
12:50:04.465 280:46  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.465 319:7  Warning: Unexpected console statement.  no-console
12:50:04.465 329:64  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.465 350:62  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.465 372:55  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.465 
12:50:04.465 ./src/lib/file-storage.ts
12:50:04.465 30:33  Warning: 'isPublic' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.465 30:33  Error: 'isPublic' is assigned a value but never used.  no-unused-vars
12:50:04.465 80:33  Warning: 'isPublic' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.465 80:33  Error: 'isPublic' is assigned a value but never used.  no-unused-vars
12:50:04.465 97:7  Warning: Unexpected console statement.  no-console
12:50:04.466 144:5  Warning: 'options' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.466 144:5  Error: 'options' is defined but never used.  no-unused-vars
12:50:04.467 
12:50:04.467 ./src/lib/i18n.ts
12:50:04.467 16:40  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.467 50:5  Warning: Unexpected console statement.  no-console
12:50:04.467 60:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.467 106:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.467 119:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.467 129:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.467 
12:50:04.467 ./src/lib/image-loader.js
12:50:04.467 13:11  Warning: 'resourcePath' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.467 13:11  Error: 'resourcePath' is assigned a value but never used.  no-unused-vars
12:50:04.467 49:5  Warning: Unexpected console statement.  no-console
12:50:04.467 
12:50:04.467 ./src/lib/middleware/api-auth.ts
12:50:04.467 6:68  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.467 7:49  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.467 21:61  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.468 22:51  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.468 43:61  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.468 44:51  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.468 65:61  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.468 66:51  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.468 91:61  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.468 92:51  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.468 134:76  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.468 135:49  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.468 152:75  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.468 153:49  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.468 166:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.468 180:61  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.468 181:51  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.468 250:61  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.468 251:51  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.468 282:76  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.468 283:49  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.469 287:7  Warning: Unexpected console statement.  no-console
12:50:04.469 334:78  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.475 335:49  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.476 340:5  Warning: Unexpected console statement.  no-console
12:50:04.477 347:7  Warning: Unexpected console statement.  no-console
12:50:04.477 354:7  Warning: Unexpected console statement.  no-console
12:50:04.477 
12:50:04.477 ./src/lib/middleware/auth.ts
12:50:04.477 5:3  Warning: 'hasResourcePermission' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.477 5:3  Error: 'hasResourcePermission' is defined but never used.  no-unused-vars
12:50:04.477 48:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.477 59:5  Warning: Unexpected console statement.  no-console
12:50:04.477 75:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.477 96:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.477 114:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.477 126:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.477 140:39  Warning: 'resourceId' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.477 140:39  Error: 'resourceId' is defined but never used.  no-unused-vars
12:50:04.477 147:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.477 183:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.477 196:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.477 204:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.477 220:44  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.485 
12:50:04.485 ./src/lib/middleware/errorHandler.ts
12:50:04.485 17:39  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.485 18:3  Warning: Unexpected console statement.  no-console
12:50:04.485 110:48  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.485 
12:50:04.485 ./src/lib/middleware/performance.ts
12:50:04.485 57:9  Warning: 'performanceColor' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.485 57:9  Error: 'performanceColor' is assigned a value but never used.  no-unused-vars
12:50:04.485 77:9  Warning: Unexpected console statement.  no-console
12:50:04.485 79:9  Warning: Unexpected console statement.  no-console
12:50:04.486 99:7  Warning: Unexpected console statement.  no-console
12:50:04.486 118:71  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.486 121:7  Warning: Unexpected console statement.  no-console
12:50:04.486 124:61  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.486 125:71  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.486 177:9  Warning: Unexpected console statement.  no-console
12:50:04.496 179:9  Warning: Unexpected console statement.  no-console
12:50:04.496 188:7  Warning: Unexpected console statement.  no-console
12:50:04.496 208:7  Error: React Hook "React.useEffect" is called conditionally. React Hooks must be called in the exact same order in every component render.  react-hooks/rules-of-hooks
12:50:04.496 212:9  Warning: Unexpected console statement.  no-console
12:50:04.496 245:9  Warning: Unexpected console statement.  no-console
12:50:04.496 299:5  Warning: Unexpected console statement.  no-console
12:50:04.496 318:9  Warning: Unexpected console statement.  no-console
12:50:04.496 326:1  Warning: Assign object to a variable before exporting as module default  import/no-anonymous-default-export
12:50:04.496 
12:50:04.496 ./src/lib/middleware/rateLimit.ts
12:50:04.496 7:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.496 10:24  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.496 10:72  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.496 12:24  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.497 12:74  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.497 57:5  Warning: Unexpected console statement.  no-console
12:50:04.497 
12:50:04.497 ./src/lib/middleware/request-auth.ts
12:50:04.497 28:14  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.497 35:54  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.497 36:12  Warning: 'err' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.497 36:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.497 41:44  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.497 46:12  Warning: 'err' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.497 46:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.497 51:39  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.497 
12:50:04.497 ./src/lib/middleware/security.ts
12:50:04.497 3:10  Warning: 'authRateLimiter' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.497 3:10  Error: 'authRateLimiter' is defined but never used.  no-unused-vars
12:50:04.499 63:9  Warning: 'securityHeaders' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.499 63:9  Error: 'securityHeaders' is assigned a value but never used.  no-unused-vars
12:50:04.499 98:9  Warning: 'method' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.499 98:9  Error: 'method' is assigned a value but never used.  no-unused-vars
12:50:04.499 111:5  Warning: Unexpected console statement.  no-console
12:50:04.499 128:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.499 129:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.499 130:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.499 141:9  Warning: 'host' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.499 141:9  Error: 'host' is assigned a value but never used.  no-unused-vars
12:50:04.499 179:9  Warning: 'method' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.499 179:9  Error: 'method' is assigned a value but never used.  no-unused-vars
12:50:04.499 191:7  Warning: Unexpected console statement.  no-console
12:50:04.499 210:7  Warning: Unexpected console statement.  no-console
12:50:04.499 230:7  Warning: Unexpected console statement.  no-console
12:50:04.499 
12:50:04.499 ./src/lib/middleware/validation.ts
12:50:04.499 7:3  Warning: 'userRegistrationSchema' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.499 7:3  Error: 'userRegistrationSchema' is defined but never used.  no-unused-vars
12:50:04.499 8:3  Warning: 'userLoginSchema' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.499 8:3  Error: 'userLoginSchema' is defined but never used.  no-unused-vars
12:50:04.499 9:3  Warning: 'userUpdateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.499 9:3  Error: 'userUpdateSchema' is defined but never used.  no-unused-vars
12:50:04.499 10:3  Warning: 'passwordResetSchema' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.499 10:3  Error: 'passwordResetSchema' is defined but never used.  no-unused-vars
12:50:04.499 11:3  Warning: 'passwordResetConfirmSchema' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.499 11:3  Error: 'passwordResetConfirmSchema' is defined but never used.  no-unused-vars
12:50:04.499 12:3  Warning: 'otpVerificationSchema' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.499 12:3  Error: 'otpVerificationSchema' is defined but never used.  no-unused-vars
12:50:04.499 13:3  Warning: 'sendOTPSchema' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.499 13:3  Error: 'sendOTPSchema' is defined but never used.  no-unused-vars
12:50:04.499 14:3  Warning: 'companyCreateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.499 14:3  Error: 'companyCreateSchema' is defined but never used.  no-unused-vars
12:50:04.499 15:3  Warning: 'companyUpdateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.499 15:3  Error: 'companyUpdateSchema' is defined but never used.  no-unused-vars
12:50:04.499 16:3  Warning: 'caregiverCreateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.499 16:3  Error: 'caregiverCreateSchema' is defined but never used.  no-unused-vars
12:50:04.499 17:3  Warning: 'caregiverUpdateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.499 17:3  Error: 'caregiverUpdateSchema' is defined but never used.  no-unused-vars
12:50:04.499 18:3  Warning: 'patientCreateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.499 18:3  Error: 'patientCreateSchema' is defined but never used.  no-unused-vars
12:50:04.500 19:3  Warning: 'patientUpdateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.500 19:3  Error: 'patientUpdateSchema' is defined but never used.  no-unused-vars
12:50:04.500 20:3  Warning: 'packageCreateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.500 20:3  Error: 'packageCreateSchema' is defined but never used.  no-unused-vars
12:50:04.500 21:3  Warning: 'packageUpdateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.500 21:3  Error: 'packageUpdateSchema' is defined but never used.  no-unused-vars
12:50:04.500 22:3  Warning: 'jobCreateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.500 22:3  Error: 'jobCreateSchema' is defined but never used.  no-unused-vars
12:50:04.500 23:3  Warning: 'jobUpdateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.500 23:3  Error: 'jobUpdateSchema' is defined but never used.  no-unused-vars
12:50:04.500 24:3  Warning: 'paymentCreateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.500 24:3  Error: 'paymentCreateSchema' is defined but never used.  no-unused-vars
12:50:04.500 25:3  Warning: 'careLogCreateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.500 25:3  Error: 'careLogCreateSchema' is defined but never used.  no-unused-vars
12:50:04.500 26:3  Warning: 'feedbackCreateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.500 26:3  Error: 'feedbackCreateSchema' is defined but never used.  no-unused-vars
12:50:04.500 27:3  Warning: 'healthRecordCreateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.500 27:3  Error: 'healthRecordCreateSchema' is defined but never used.  no-unused-vars
12:50:04.500 28:3  Warning: 'healthRecordUpdateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.500 28:3  Error: 'healthRecordUpdateSchema' is defined but never used.  no-unused-vars
12:50:04.500 29:3  Warning: 'marketplaceJobCreateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.500 29:3  Error: 'marketplaceJobCreateSchema' is defined but never used.  no-unused-vars
12:50:04.500 30:3  Warning: 'marketplaceJobApplicationSchema' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.500 30:3  Error: 'marketplaceJobApplicationSchema' is defined but never used.  no-unused-vars
12:50:04.500 31:3  Warning: 'notificationCreateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.500 31:3  Error: 'notificationCreateSchema' is defined but never used.  no-unused-vars
12:50:04.500 32:3  Warning: 'notificationUpdateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.500 32:3  Error: 'notificationUpdateSchema' is defined but never used.  no-unused-vars
12:50:04.500 51:33  Warning: 'T' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.500 51:33  Error: 'T' is defined but never used.  no-unused-vars
12:50:04.500 51:44  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.500 51:55  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.500 63:38  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.500 74:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.500 76:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.500 86:39  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.500 89:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.500 
12:50:04.500 ./src/lib/notification-service.ts
12:50:04.500 13:5  Warning: Unexpected console statement.  no-console
12:50:04.500 41:7  Warning: Unexpected console statement.  no-console
12:50:04.500 44:7  Warning: Unexpected console statement.  no-console
12:50:04.500 
12:50:04.500 ./src/lib/offline-service.ts
12:50:04.500 6:9  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.500 18:9  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.500 42:9  Warning: Unexpected console statement.  no-console
12:50:04.500 59:9  Warning: Unexpected console statement.  no-console
12:50:04.500 65:55  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.500 99:112  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.500 114:46  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.500 155:9  Warning: Unexpected console statement.  no-console
12:50:04.500 246:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.500 
12:50:04.500 ./src/lib/payment-gateways/bkash.ts
12:50:04.500 112:7  Warning: Unexpected console statement.  no-console
12:50:04.500 143:7  Warning: Unexpected console statement.  no-console
12:50:04.500 174:7  Warning: Unexpected console statement.  no-console
12:50:04.500 207:7  Warning: Unexpected console statement.  no-console
12:50:04.500 233:38  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.500 255:7  Warning: Unexpected console statement.  no-console
12:50:04.501 269:14  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.501 296:7  Warning: Unexpected console statement.  no-console
12:50:04.501 327:7  Warning: Unexpected console statement.  no-console
12:50:04.501 
12:50:04.501 ./src/lib/payment-gateways/nagad.ts
12:50:04.501 118:7  Warning: Unexpected console statement.  no-console
12:50:04.501 152:7  Warning: Unexpected console statement.  no-console
12:50:04.501 186:7  Warning: Unexpected console statement.  no-console
12:50:04.501 222:7  Warning: Unexpected console statement.  no-console
12:50:04.501 230:38  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.501 255:7  Warning: Unexpected console statement.  no-console
12:50:04.501 
12:50:04.501 ./src/lib/payment-service.ts
12:50:04.501 1:52  Warning: 'BkashPaymentResponse' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.501 1:52  Error: 'BkashPaymentResponse' is defined but never used.  no-unused-vars
12:50:04.501 2:52  Warning: 'NagadPaymentResponse' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.501 2:52  Error: 'NagadPaymentResponse' is defined but never used.  no-unused-vars
12:50:04.501 49:11  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.501 61:11  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.501 78:11  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.501 80:11  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.501 90:11  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.501 113:7  Warning: Unexpected console statement.  no-console
12:50:04.501 125:11  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.501 142:11  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.501 165:7  Warning: Unexpected console statement.  no-console
12:50:04.501 175:5  Warning: 'callbackData' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.501 175:5  Error: 'callbackData' is defined but never used.  no-unused-vars
12:50:04.501 175:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.501 191:7  Warning: Unexpected console statement.  no-console
12:50:04.501 204:11  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.501 221:11  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.501 244:7  Warning: Unexpected console statement.  no-console
12:50:04.501 
12:50:04.501 ./src/lib/payments/bkash.ts
12:50:04.501 34:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.501 76:14  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.501 85:38  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.501 98:1  Warning: Assign object to a variable before exporting as module default  import/no-anonymous-default-export
12:50:04.501 
12:50:04.501 ./src/lib/payments/escrow.ts
12:50:04.501 9:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.501 20:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.501 41:33  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.501 53:57  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.501 54:9  Warning: 'updated' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.501 54:9  Error: 'updated' is assigned a value but never used.  no-unused-vars
12:50:04.501 63:31  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.501 79:1  Warning: Assign object to a variable before exporting as module default  import/no-anonymous-default-export
12:50:04.501 
12:50:04.501 ./src/lib/payments/nagad.ts
12:50:04.501 32:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.501 71:14  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.501 80:38  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.501 93:1  Warning: Assign object to a variable before exporting as module default  import/no-anonymous-default-export
12:50:04.501 
12:50:04.501 ./src/lib/payments/webhooks.ts
12:50:04.501 16:12  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.513 
12:50:04.514 ./src/lib/performance.ts
12:50:04.514 113:39  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.514 113:49  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.514 127:39  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.514 127:49  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.514 144:38  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.514 144:48  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.514 183:62  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.514 188:7  Warning: Unexpected console statement.  no-console
12:50:04.514 206:7  Warning: Unexpected console statement.  no-console
12:50:04.514 214:7  Warning: Unexpected console statement.  no-console
12:50:04.514 236:9  Warning: Unexpected console statement.  no-console
12:50:04.514 242:7  Warning: Unexpected console statement.  no-console
12:50:04.514 322:9  Warning: 'visibleItems' is never reassigned. Use 'const' instead.  prefer-const
12:50:04.515 348:1  Warning: Assign object to a variable before exporting as module default  import/no-anonymous-default-export
12:50:04.515 
12:50:04.515 ./src/lib/rbac-examples.ts
12:50:04.515 34:9  Warning: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.515 34:9  Error: 'user' is assigned a value but never used.  no-unused-vars
12:50:04.515 44:9  Warning: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.515 44:9  Error: 'user' is assigned a value but never used.  no-unused-vars
12:50:04.515 54:9  Warning: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.515 54:9  Error: 'user' is assigned a value but never used.  no-unused-vars
12:50:04.515 65:9  Warning: 'targetUserId' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.515 65:9  Error: 'targetUserId' is assigned a value but never used.  no-unused-vars
12:50:04.515 68:39  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.515 68:44  Warning: 'request' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.515 68:44  Error: 'request' is defined but never used.  no-unused-vars
12:50:04.515 128:3  Warning: Unexpected console statement.  no-console
12:50:04.516 136:3  Warning: Unexpected console statement.  no-console
12:50:04.516 137:3  Warning: Unexpected console statement.  no-console
12:50:04.516 138:3  Warning: Unexpected console statement.  no-console
12:50:04.516 139:3  Warning: Unexpected console statement.  no-console
12:50:04.516 143:3  Warning: Unexpected console statement.  no-console
12:50:04.516 232:3  Warning: Unexpected console statement.  no-console
12:50:04.516 
12:50:04.516 ./src/lib/refund-service.ts
12:50:04.516 24:29  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.516 41:29  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.516 125:7  Warning: Unexpected console statement.  no-console
12:50:04.516 208:7  Warning: Unexpected console statement.  no-console
12:50:04.516 258:7  Warning: Unexpected console statement.  no-console
12:50:04.516 285:7  Warning: Unexpected console statement.  no-console
12:50:04.516 299:26  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.516 346:7  Warning: Unexpected console statement.  no-console
12:50:04.517 427:7  Warning: Unexpected console statement.  no-console
12:50:04.517 467:7  Warning: Unexpected console statement.  no-console
12:50:04.517 482:31  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.517 496:7  Warning: Unexpected console statement.  no-console
12:50:04.517 518:26  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.517 576:7  Warning: Unexpected console statement.  no-console
12:50:04.517 
12:50:04.517 ./src/lib/security.ts
12:50:04.517 97:48  Error: Unnecessary escape character: \[.  no-useless-escape
12:50:04.517 97:65  Error: Unnecessary escape character: \/.  no-useless-escape
12:50:04.517 110:42  Error: Unnecessary escape character: \(.  no-useless-escape
12:50:04.517 110:44  Error: Unnecessary escape character: \).  no-useless-escape
12:50:04.517 182:69  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.517 192:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.517 
12:50:04.518 ./src/lib/session-manager.ts
12:50:04.518 45:5  Warning: Unexpected console statement.  no-console
12:50:04.518 130:5  Warning: Unexpected console statement.  no-console
12:50:04.518 150:14  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.518 220:5  Warning: Unexpected console statement.  no-console
12:50:04.518 232:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.518 321:14  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.518 322:16  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.518 323:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.518 345:7  Warning: 'timeRangeStart' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.518 345:7  Error: 'timeRangeStart' is assigned a value but never used.  no-unused-vars
12:50:04.518 386:3  Warning: Unexpected console statement.  no-console
12:50:04.518 391:5  Warning: Unexpected console statement.  no-console
12:50:04.518 393:5  Warning: Unexpected console statement.  no-console
12:50:04.518 396:3  Warning: Unexpected console statement.  no-console
12:50:04.518 
12:50:04.518 ./src/lib/session.ts
12:50:04.518 105:5  Warning: Unexpected console statement.  no-console
12:50:04.519 124:5  Warning: Unexpected console statement.  no-console
12:50:04.519 144:5  Warning: Unexpected console statement.  no-console
12:50:04.519 163:5  Warning: Unexpected console statement.  no-console
12:50:04.519 182:5  Warning: Unexpected console statement.  no-console
12:50:04.519 202:5  Warning: Unexpected console statement.  no-console
12:50:04.519 218:5  Warning: Unexpected console statement.  no-console
12:50:04.519 235:5  Warning: Unexpected console statement.  no-console
12:50:04.519 273:5  Warning: Unexpected console statement.  no-console
12:50:04.519 304:5  Warning: Unexpected console statement.  no-console
12:50:04.519 
12:50:04.519 ./src/lib/utils.ts
12:50:04.519 83:46  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.519 83:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.519 106:46  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.519 106:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.519 
12:50:04.519 ./src/middleware.ts
12:50:04.519 6:9  Warning: 'origin' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:50:04.519 6:9  Error: 'origin' is assigned a value but never used.  no-unused-vars
12:50:04.519 
12:50:04.520 ./src/notifications/providers/email.service.ts
12:50:04.520 6:7  Warning: Unexpected console statement.  no-console
12:50:04.520 12:95  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.520 31:7  Warning: Unexpected console statement.  no-console
12:50:04.520 
12:50:04.520 ./src/notifications/providers/push.service.ts
12:50:04.520 12:26  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.520 13:21  Warning: Unexpected console statement.  no-console
12:50:04.520 16:17  Warning: Unexpected console statement.  no-console
12:50:04.520 32:13  Warning: Unexpected console statement.  no-console
12:50:04.520 
12:50:04.520 ./src/notifications/providers/sms.service.ts
12:50:04.520 4:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.520 8:13  Warning: Unexpected console statement.  no-console
12:50:04.520 26:13  Warning: Unexpected console statement.  no-console
12:50:04.520 
12:50:04.524 ./src/services/ai-agent/ai-agent-service.ts
12:50:04.524 20:5  Warning: 'NavigationAction' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.524 20:5  Error: 'NavigationAction' is defined but never used.  no-unused-vars
12:50:04.524 21:5  Warning: 'FormAction' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.524 21:5  Error: 'FormAction' is defined but never used.  no-unused-vars
12:50:04.525 48:13  Warning: Unexpected console statement.  no-console
12:50:04.525 125:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.525 126:13  Warning: Unexpected console statement.  no-console
12:50:04.525 140:48  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.525 203:63  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.525 258:46  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.525 258:51  Warning: 'context' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.525 258:51  Error: 'context' is defined but never used.  no-unused-vars
12:50:04.525 302:18  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.525 332:18  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.525 402:27  Warning: 'input' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.525 402:27  Error: 'input' is defined but never used.  no-unused-vars
12:50:04.525 402:42  Warning: 'context' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.525 402:42  Error: 'context' is defined but never used.  no-unused-vars
12:50:04.525 
12:50:04.525 ./src/services/ai-agent/context-manager.ts
12:50:04.525 222:13  Warning: Unexpected console statement.  no-console
12:50:04.525 236:13  Warning: Unexpected console statement.  no-console
12:50:04.525 255:13  Warning: Unexpected console statement.  no-console
12:50:04.525 
12:50:04.525 ./src/services/ai-agent/form-controller.ts
12:50:04.525 93:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.525 110:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.525 111:9  Warning: Unexpected console statement.  no-console
12:50:04.525 163:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.525 178:50  Warning: 'language' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.525 178:50  Error: 'language' is defined but never used.  no-unused-vars
12:50:04.525 223:13  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.525 235:13  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.525 
12:50:04.525 ./src/services/ai-agent/gemini-client.ts
12:50:04.525 179:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.525 180:9  Warning: Unexpected console statement.  no-console
12:50:04.525 233:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.525 234:9  Warning: Unexpected console statement.  no-console
12:50:04.525 
12:50:04.525 ./src/services/ai-agent/intent-classifier.ts
12:50:04.525 38:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.525 54:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.525 55:9  Warning: Unexpected console statement.  no-console
12:50:04.525 114:56  Warning: 'context' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.525 114:56  Error: 'context' is defined but never used.  no-unused-vars
12:50:04.525 
12:50:04.525 ./src/services/ai-agent/prompts.ts
12:50:04.525 6:24  Warning: 'UserRole' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.525 6:24  Error: 'UserRole' is defined but never used.  no-unused-vars
12:50:04.525 129:16  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.525 
12:50:04.525 ./src/services/ai-agent/text-to-speech.ts
12:50:04.525 37:13  Warning: Unexpected console statement.  no-console
12:50:04.525 77:13  Warning: Unexpected console statement.  no-console
12:50:04.525 
12:50:04.525 ./src/services/ai-agent/voice-recognition.ts
12:50:04.525 16:34  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.525 18:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.525 18:60  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.525 25:26  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.525 67:45  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.525 84:44  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.525 85:13  Warning: Unexpected console statement.  no-console
12:50:04.525 137:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.525 138:13  Warning: Unexpected console statement.  no-console
12:50:04.525 153:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.525 154:13  Warning: Unexpected console statement.  no-console
12:50:04.525 168:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.525 169:13  Warning: Unexpected console statement.  no-console
12:50:04.525 236:13  Warning: Unexpected console statement.  no-console
12:50:04.525 253:18  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.525 
12:50:04.525 ./src/services/api.ts
12:50:04.525 9:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 66:58  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 80:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 87:41  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 94:43  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 129:20  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
12:50:04.526 
12:50:04.526 ./src/store/index.ts
12:50:04.526 6:14  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 10:12  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 21:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 23:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 76:7  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.526 88:7  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:50:04.526 154:29  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 164:35  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 
12:50:04.526 ./src/types/ai-agent.ts
12:50:04.526 38:11  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 60:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 
12:50:04.526 ./src/types/index.ts
12:50:04.526 33:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 60:11  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 61:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 63:14  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 64:26  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 89:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 111:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 112:16  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 148:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 162:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 202:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 218:9  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 220:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 232:14  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 249:10  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 266:10  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 283:13  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 296:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 311:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 318:34  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 323:13  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 326:40  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 376:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 
12:50:04.526 ./src/utils/index.ts
12:50:04.526 128:44  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 156:47  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 165:47  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 178:32  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 305:7  Warning: Unexpected console statement.  no-console
12:50:04.526 315:7  Warning: Unexpected console statement.  no-console
12:50:04.526 325:7  Warning: Unexpected console statement.  no-console
12:50:04.526 331:46  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 331:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 344:46  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 344:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:50:04.526 
12:50:04.526 info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/basic-features/eslint#disabling-rules
12:50:04.526 Error: Command "npm run build" exited with 1