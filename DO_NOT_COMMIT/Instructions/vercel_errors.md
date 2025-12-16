11:50:01.301 Running build in Washington, D.C., USA (East) – iad1
11:50:01.302 Build machine configuration: 2 cores, 8 GB
11:50:01.312 Cloning github.com/digitalpapyrusbd/CareNet (Branch: main, Commit: 6600731)
11:50:01.313 Skipping build cache, deployment was triggered without cache.
11:50:02.393 Cloning completed: 1.081s
11:50:03.021 Warning: Detected "engines": { "node": ">=18.17.0" } in your `package.json` that will automatically upgrade when a new major Node.js Version is released. Learn More: http://vercel.link/node-version
11:50:03.021 Running "vercel build"
11:50:03.442 Vercel CLI 50.0.1
11:50:03.961 Warning: Detected "engines": { "node": ">=18.17.0" } in your `package.json` that will automatically upgrade when a new major Node.js Version is released. Learn More: http://vercel.link/node-version
11:50:03.983 Installing dependencies...
11:50:10.346 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
11:50:11.163 npm warn deprecated npmlog@6.0.2: This package is no longer supported.
11:50:12.035 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
11:50:13.288 npm warn deprecated crypto@1.0.1: This package is no longer supported. It's now a built-in Node module. If you've depended on crypto, you should switch to the one that's built-in.
11:50:13.327 npm warn deprecated domexception@4.0.0: Use your platform's native DOMException instead
11:50:13.744 npm warn deprecated gauge@4.0.4: This package is no longer supported.
11:50:13.889 npm warn deprecated abab@2.0.6: Use your platform's native atob() and btoa() methods instead
11:50:13.937 npm warn deprecated are-we-there-yet@3.0.1: This package is no longer supported.
11:50:14.099 npm warn deprecated critters@0.0.25: Ownership of Critters has moved to the Nuxt team, who will be maintaining the project going forward. If you'd like to keep using Critters, please switch to the actively-maintained fork at https://github.com/danielroe/beasties
11:50:14.173 npm warn deprecated @types/bcryptjs@3.0.0: This is a stub types definition. bcryptjs provides its own type definitions, so you do not need this installed.
11:50:15.472 npm warn deprecated @npmcli/move-file@1.1.2: This functionality has been moved to @npmcli/fs
11:50:16.175 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
11:50:16.293 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
11:50:17.186 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
11:50:17.290 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
11:50:17.399 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
11:50:17.495 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
11:50:17.519 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
11:50:17.873 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
11:50:17.964 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
11:50:18.496 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
11:50:18.616 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
11:50:18.953 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
11:50:25.808 npm warn deprecated @opentelemetry/otlp-proto-exporter-base@0.41.2: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
11:50:29.143 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
11:51:00.969 
11:51:00.970 > caregiver-platform@0.1.0 prepare
11:51:00.970 > husky install
11:51:00.971 
11:51:01.012 husky - Git hooks installed
11:51:01.057 
11:51:01.058 added 1803 packages in 57s
11:51:01.058 
11:51:01.059 292 packages are looking for funding
11:51:01.059   run `npm fund` for details
11:51:01.119 Detected Next.js version: 14.0.4
11:51:01.136 Running "npm run build"
11:51:01.252 
11:51:01.252 > caregiver-platform@0.1.0 build
11:51:01.253 > next build
11:51:01.253 
11:51:01.780 Attention: Next.js now collects completely anonymous telemetry regarding usage.
11:51:01.781 This information is used to shape Next.js' roadmap and prioritize features.
11:51:01.781 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
11:51:01.782 https://nextjs.org/telemetry
11:51:01.782 
11:51:01.862    ▲ Next.js 14.0.4
11:51:01.863    - Experiments (use at your own risk):
11:51:01.864      · optimizeCss
11:51:01.864      · scrollRestoration
11:51:01.864 
11:51:01.864    Creating an optimized production build ...
11:51:36.492  ✓ Compiled successfully
11:51:36.493    Linting and checking validity of types ...
11:52:02.074 
11:52:02.075 Failed to compile.
11:52:02.076 
11:52:02.076 ./src/app/admin/analytics/page.tsx
11:52:02.076 6:10  Warning: 'TrendingUp' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.076 6:10  Error: 'TrendingUp' is defined but never used.  no-unused-vars
11:52:02.076 11:9  Warning: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.079 11:9  Error: 'router' is assigned a value but never used.  no-unused-vars
11:52:02.079 50:61  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.079 
11:52:02.080 ./src/app/admin/audit-logs/page.tsx
11:52:02.080 6:28  Warning: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.080 6:28  Error: 'Filter' is defined but never used.  no-unused-vars
11:52:02.080 12:9  Warning: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.080 12:9  Error: 'router' is assigned a value but never used.  no-unused-vars
11:52:02.080 65:71  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.081 
11:52:02.081 ./src/app/admin/billing/page.tsx
11:52:02.081 11:9  Warning: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.081 11:9  Error: 'router' is assigned a value but never used.  no-unused-vars
11:52:02.081 47:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.082 
11:52:02.084 ./src/app/admin/cv-pool/page.tsx
11:52:02.085 12:9  Warning: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.085 12:9  Error: 'router' is assigned a value but never used.  no-unused-vars
11:52:02.085 
11:52:02.086 ./src/app/admin/dashboard/page.tsx
11:52:02.086 6:25  Warning: 'Building2' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.086 6:25  Error: 'Building2' is defined but never used.  no-unused-vars
11:52:02.086 7:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.086 7:10  Error: 'Button' is defined but never used.  no-unused-vars
11:52:02.087 
11:52:02.087 ./src/app/admin/disputes/page.tsx
11:52:02.087 6:18  Warning: 'AlertTriangle' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.087 6:18  Error: 'AlertTriangle' is defined but never used.  no-unused-vars
11:52:02.087 6:33  Warning: 'Clock' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.088 6:33  Error: 'Clock' is defined but never used.  no-unused-vars
11:52:02.088 31:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.088 
11:52:02.088 ./src/app/admin/locked-accounts/[id]/unlock/page.tsx
11:52:02.088 28:5  Warning: Unexpected console statement.  no-console
11:52:02.089 
11:52:02.089 ./src/app/admin/locked-accounts/page.tsx
11:52:02.089 12:9  Warning: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.089 12:9  Error: 'router' is assigned a value but never used.  no-unused-vars
11:52:02.089 
11:52:02.089 ./src/app/admin/messages/page.tsx
11:52:02.090 11:9  Warning: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.090 11:9  Error: 'router' is assigned a value but never used.  no-unused-vars
11:52:02.090 
11:52:02.090 ./src/app/admin/moderators/[id]/page.tsx
11:52:02.095 6:30  Warning: 'Edit' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.096 6:30  Error: 'Edit' is defined but never used.  no-unused-vars
11:52:02.096 
11:52:02.096 ./src/app/admin/moderators/page.tsx
11:52:02.096 46:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.096 
11:52:02.097 ./src/app/admin/submissions/[id]/decision/page.tsx
11:52:02.097 29:5  Warning: Unexpected console statement.  no-console
11:52:02.097 78:53  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.097 136:51  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.097 
11:52:02.097 ./src/app/admin/submissions/page.tsx
11:52:02.097 31:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.098 
11:52:02.098 ./src/app/admin/system-settings/page.tsx
11:52:02.098 6:10  Warning: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.098 6:10  Error: 'Settings' is defined but never used.  no-unused-vars
11:52:02.098 
11:52:02.098 ./src/app/admin/tickets/page.tsx
11:52:02.099 12:9  Warning: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.099 12:9  Error: 'router' is assigned a value but never used.  no-unused-vars
11:52:02.099 48:61  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.099 
11:52:02.099 ./src/app/agency/caregivers/[id]/page.tsx
11:52:02.099 6:33  Warning: 'Briefcase' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.099 6:33  Error: 'Briefcase' is defined but never used.  no-unused-vars
11:52:02.100 
11:52:02.100 ./src/app/agency/dashboard/page.tsx
11:52:02.100 6:52  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.100 6:52  Error: 'Package' is defined but never used.  no-unused-vars
11:52:02.100 6:61  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.100 6:61  Error: 'Calendar' is defined but never used.  no-unused-vars
11:52:02.100 6:71  Warning: 'TrendingUp' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.101 6:71  Error: 'TrendingUp' is defined but never used.  no-unused-vars
11:52:02.101 7:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.101 7:10  Error: 'Button' is defined but never used.  no-unused-vars
11:52:02.101 
11:52:02.101 ./src/app/agency/inquiries/[id]/page.tsx
11:52:02.101 6:21  Warning: 'MessageSquare' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.101 6:21  Error: 'MessageSquare' is defined but never used.  no-unused-vars
11:52:02.102 
11:52:02.102 ./src/app/agency/jobs/[id]/page.tsx
11:52:02.102 6:32  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.102 6:32  Error: 'User' is defined but never used.  no-unused-vars
11:52:02.102 6:38  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.102 6:38  Error: 'Calendar' is defined but never used.  no-unused-vars
11:52:02.103 6:48  Warning: 'MessageSquare' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.103 6:48  Error: 'MessageSquare' is defined but never used.  no-unused-vars
11:52:02.103 
11:52:02.103 ./src/app/agency/messages/[id]/page.tsx
11:52:02.103 6:52  Warning: 'ImageIcon' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.103 6:52  Error: 'ImageIcon' is defined but never used.  no-unused-vars
11:52:02.103 14:9  Warning: 'id' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.104 14:9  Error: 'id' is assigned a value but never used.  no-unused-vars
11:52:02.104 
11:52:02.104 ./src/app/agency/messages/page.tsx
11:52:02.105 8:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.105 8:10  Error: 'Button' is defined but never used.  no-unused-vars
11:52:02.106 
11:52:02.106 ./src/app/agency/packages/[id]/edit/page.tsx
11:52:02.106 6:27  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.106 6:27  Error: 'Package' is defined but never used.  no-unused-vars
11:52:02.109 
11:52:02.109 ./src/app/agency/registration/step-5/page.tsx
11:52:02.109 40:94  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.109 
11:52:02.110 ./src/app/agency-manager/feedback/[id]/respond/page.tsx
11:52:02.110 6:27  Warning: 'MessageSquare' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.110 6:27  Error: 'MessageSquare' is defined but never used.  no-unused-vars
11:52:02.110 
11:52:02.110 ./src/app/agency-manager/login/page.tsx
11:52:02.111 14:30  Warning: 'credentials' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.111 14:30  Error: 'credentials' is defined but never used.  no-unused-vars
11:52:02.111 
11:52:02.111 ./src/app/api/admin/audit/route.ts
11:52:02.111 11:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.112 26:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.112 
11:52:02.112 ./src/app/api/admin/moderation/content/route.ts
11:52:02.112 17:70  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.112 23:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.113 
11:52:02.113 ./src/app/api/admin/users/role/route.ts
11:52:02.113 18:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.119 
11:52:02.119 ./src/app/api/ai-agent/chat/route.ts
11:52:02.119 34:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.119 35:9  Warning: Unexpected console statement.  no-console
11:52:02.119 
11:52:02.120 ./src/app/api/ai-agent/routes/route.ts
11:52:02.120 26:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.120 27:9  Warning: Unexpected console statement.  no-console
11:52:02.120 
11:52:02.120 ./src/app/api/analytics/chat/route.ts
11:52:02.120 8:6  Error: 'UserRole' is already defined.  no-redeclare
11:52:02.120 45:11  Warning: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.121 45:11  Error: 'user' is assigned a value but never used.  no-unused-vars
11:52:02.121 45:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.121 70:5  Warning: Unexpected console statement.  no-console
11:52:02.121 106:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.121 123:5  Warning: Unexpected console statement.  no-console
11:52:02.121 180:5  Warning: Unexpected console statement.  no-console
11:52:02.121 218:5  Warning: Unexpected console statement.  no-console
11:52:02.122 
11:52:02.122 ./src/app/api/analytics/route.ts
11:52:02.122 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.122 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
11:52:02.122 41:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.122 46:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.122 135:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.123 185:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.123 249:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.123 249:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.123 250:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.123 256:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.123 256:51  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.123 257:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.124 263:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.124 263:64  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.124 265:39  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.124 268:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.124 268:60  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.124 270:38  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.124 286:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.125 346:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.125 396:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.125 397:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.125 425:5  Warning: Unexpected console statement.  no-console
11:52:02.125 
11:52:02.126 ./src/app/api/analytics/vitals/route.ts
11:52:02.126 18:7  Warning: Unexpected console statement.  no-console
11:52:02.126 47:5  Warning: Unexpected console statement.  no-console
11:52:02.126 
11:52:02.126 ./src/app/api/auth/login/route.ts
11:52:02.126 7:57  Warning: 'verifySessionMFA' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.127 7:57  Error: 'verifySessionMFA' is defined but never used.  no-unused-vars
11:52:02.127 190:28  Warning: '_' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.127 190:28  Error: '_' is assigned a value but never used.  no-unused-vars
11:52:02.127 190:43  Warning: '__' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.127 190:43  Error: '__' is assigned a value but never used.  no-unused-vars
11:52:02.128 212:5  Warning: Unexpected console statement.  no-console
11:52:02.128 292:5  Warning: Unexpected console statement.  no-console
11:52:02.128 331:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.128 337:13  Error: 'deleteUserSessions' is not defined.  no-undef
11:52:02.128 341:18  Warning: 'session' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.129 341:18  Error: 'session' is assigned a value but never used.  no-unused-vars
11:52:02.129 401:5  Warning: Unexpected console statement.  no-console
11:52:02.129 491:5  Warning: Unexpected console statement.  no-console
11:52:02.129 
11:52:02.129 ./src/app/api/auth/me/route.ts
11:52:02.130 115:5  Warning: Unexpected console statement.  no-console
11:52:02.130 165:5  Warning: Unexpected console statement.  no-console
11:52:02.130 
11:52:02.130 ./src/app/api/auth/register/route.ts
11:52:02.130 265:7  Warning: Unexpected console statement.  no-console
11:52:02.142 298:5  Warning: Unexpected console statement.  no-console
11:52:02.143 
11:52:02.143 ./src/app/api/auth/reset-password/route.ts
11:52:02.143 3:24  Warning: 'verifyPassword' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.143 3:24  Error: 'verifyPassword' is defined but never used.  no-unused-vars
11:52:02.144 4:26  Warning: 'updateUserLastLogin' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.144 4:26  Error: 'updateUserLastLogin' is defined but never used.  no-unused-vars
11:52:02.144 184:7  Warning: Unexpected console statement.  no-console
11:52:02.144 187:7  Warning: Unexpected console statement.  no-console
11:52:02.144 199:63  Error: 'resetUrl' is not defined.  no-undef
11:52:02.145 204:5  Warning: Unexpected console statement.  no-console
11:52:02.145 297:5  Warning: Unexpected console statement.  no-console
11:52:02.145 408:5  Warning: Unexpected console statement.  no-console
11:52:02.145 487:11  Warning: 'timeSinceRequest' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.145 487:11  Error: 'timeSinceRequest' is assigned a value but never used.  no-unused-vars
11:52:02.146 504:5  Warning: Unexpected console statement.  no-console
11:52:02.146 549:5  Warning: Unexpected console statement.  no-console
11:52:02.152 
11:52:02.152 ./src/app/api/auth/send-otp/route.ts
11:52:02.152 52:7  Warning: Unexpected console statement.  no-console
11:52:02.152 61:5  Warning: Unexpected console statement.  no-console
11:52:02.152 
11:52:02.153 ./src/app/api/auth/setup-mfa/route.ts
11:52:02.153 81:55  Warning: '_' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.153 81:55  Error: '_' is defined but never used.  no-unused-vars
11:52:02.153 81:58  Warning: 'i' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.153 81:58  Error: 'i' is defined but never used.  no-unused-vars
11:52:02.153 117:5  Warning: Unexpected console statement.  no-console
11:52:02.154 158:5  Warning: Unexpected console statement.  no-console
11:52:02.154 
11:52:02.154 ./src/app/api/auth/verify-email/route.ts
11:52:02.154 5:8  Warning: 'crypto' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.154 5:8  Error: 'crypto' is defined but never used.  no-unused-vars
11:52:02.154 64:19  Error: 'generateEmailVerificationToken' is not defined.  no-undef
11:52:02.155 83:5  Warning: Unexpected console statement.  no-console
11:52:02.155 96:5  Warning: Unexpected console statement.  no-console
11:52:02.155 208:9  Warning: 'updateData' is never reassigned. Use 'const' instead.  prefer-const
11:52:02.155 208:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.155 236:5  Warning: Unexpected console statement.  no-console
11:52:02.155 257:11  Warning: 'token' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.156 257:11  Error: 'token' is assigned a value but never used.  no-unused-vars
11:52:02.156 298:5  Warning: Unexpected console statement.  no-console
11:52:02.156 329:5  Warning: Unexpected console statement.  no-console
11:52:02.156 
11:52:02.156 ./src/app/api/auth/verify-otp/route.ts
11:52:02.157 14:13  Warning: 'phone' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.157 14:13  Error: 'phone' is assigned a value but never used.  no-unused-vars
11:52:02.157 75:5  Warning: Unexpected console statement.  no-console
11:52:02.157 
11:52:02.157 ./src/app/api/care-logs/route.ts
11:52:02.157 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.158 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
11:52:02.158 18:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.158 33:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.158 38:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.158 42:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.158 42:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.158 64:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.159 161:5  Warning: Unexpected console statement.  no-console
11:52:02.159 179:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.159 290:5  Warning: Unexpected console statement.  no-console
11:52:02.159 
11:52:02.159 ./src/app/api/caregivers/route.ts
11:52:02.159 12:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.160 26:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.161 114:5  Warning: Unexpected console statement.  no-console
11:52:02.161 128:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.161 238:5  Warning: Unexpected console statement.  no-console
11:52:02.161 
11:52:02.161 ./src/app/api/cdn/upload/route.ts
11:52:02.161 16:11  Warning: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.162 16:11  Error: 'user' is assigned a value but never used.  no-unused-vars
11:52:02.162 16:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.162 74:5  Warning: Unexpected console statement.  no-console
11:52:02.162 119:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.162 126:5  Warning: Unexpected console statement.  no-console
11:52:02.163 168:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.163 175:5  Warning: Unexpected console statement.  no-console
11:52:02.163 
11:52:02.163 ./src/app/api/companies/route.ts
11:52:02.163 4:29  Warning: 'authorizeOwnResource' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.164 4:29  Error: 'authorizeOwnResource' is defined but never used.  no-unused-vars
11:52:02.164 32:7  Warning: 'packageSchema' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.164 32:7  Error: 'packageSchema' is assigned a value but never used.  no-unused-vars
11:52:02.164 46:7  Warning: 'serviceZoneSchema' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.164 46:7  Error: 'serviceZoneSchema' is assigned a value but never used.  no-unused-vars
11:52:02.165 65:70  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.165 75:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.165 113:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.165 199:5  Warning: Unexpected console statement.  no-console
11:52:02.165 283:5  Warning: Unexpected console statement.  no-console
11:52:02.166 390:5  Warning: Unexpected console statement.  no-console
11:52:02.166 430:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.166 451:5  Warning: Unexpected console statement.  no-console
11:52:02.166 
11:52:02.167 ./src/app/api/dashboard/stats/route.ts
11:52:02.167 2:24  Warning: 'authorize' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.174 2:24  Error: 'authorize' is defined but never used.  no-unused-vars
11:52:02.174 12:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.175 15:16  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.175 20:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.175 58:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.175 101:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.175 162:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.176 205:5  Warning: Unexpected console statement.  no-console
11:52:02.176 215:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.176 220:7  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.176 256:38  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.176 264:36  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.176 272:44  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.177 283:7  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.177 332:7  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.177 361:50  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.177 369:40  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.177 380:7  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.177 408:38  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.178 416:46  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.178 
11:52:02.178 ./src/app/api/disputes/[id]/route.ts
11:52:02.178 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.178 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
11:52:02.179 32:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.179 37:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.179 51:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.179 130:5  Warning: Unexpected console statement.  no-console
11:52:02.179 150:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.181 377:5  Warning: Unexpected console statement.  no-console
11:52:02.186 
11:52:02.186 ./src/app/api/disputes/route.ts
11:52:02.187 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.192 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
11:52:02.192 18:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.192 31:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.193 45:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.193 141:5  Warning: Unexpected console statement.  no-console
11:52:02.193 160:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.193 215:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.194 310:5  Warning: Unexpected console statement.  no-console
11:52:02.194 
11:52:02.194 ./src/app/api/docs/route.ts
11:52:02.194 1:23  Warning: 'NextResponse' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.194 1:23  Error: 'NextResponse' is defined but never used.  no-unused-vars
11:52:02.194 
11:52:02.195 ./src/app/api/escrow/route.ts
11:52:02.195 40:7  Warning: 'getEscrowSchema' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.195 40:7  Error: 'getEscrowSchema' is assigned a value but never used.  no-unused-vars
11:52:02.195 44:7  Warning: 'getUserEscrowSchema' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.195 44:7  Error: 'getUserEscrowSchema' is assigned a value but never used.  no-unused-vars
11:52:02.195 54:27  Error: 'getServerSession' is not defined.  no-undef
11:52:02.195 54:44  Error: 'authOptions' is not defined.  no-undef
11:52:02.196 106:5  Warning: Unexpected console statement.  no-console
11:52:02.196 120:27  Error: 'getServerSession' is not defined.  no-undef
11:52:02.196 120:44  Error: 'authOptions' is not defined.  no-undef
11:52:02.196 148:5  Warning: Unexpected console statement.  no-console
11:52:02.196 159:41  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.196 159:55  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.197 187:5  Warning: Unexpected console statement.  no-console
11:52:02.197 198:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.197 198:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.197 231:5  Warning: Unexpected console statement.  no-console
11:52:02.197 242:41  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.198 242:55  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.198 275:5  Warning: Unexpected console statement.  no-console
11:52:02.198 286:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.198 286:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.198 320:5  Warning: Unexpected console statement.  no-console
11:52:02.199 331:80  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.200 363:78  Warning: 'escrowData' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.200 363:78  Error: 'escrowData' is defined but never used.  no-unused-vars
11:52:02.200 363:90  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.200 401:78  Warning: 'escrowId' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.201 401:78  Error: 'escrowId' is defined but never used.  no-unused-vars
11:52:02.201 
11:52:02.201 ./src/app/api/fcm/register/route.ts
11:52:02.201 21:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.203 56:5  Warning: Unexpected console statement.  no-console
11:52:02.203 80:11  Warning: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.203 80:11  Error: 'user' is assigned a value but never used.  no-unused-vars
11:52:02.203 80:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.204 108:5  Warning: Unexpected console statement.  no-console
11:52:02.204 
11:52:02.204 ./src/app/api/fcm/send/route.ts
11:52:02.208 46:11  Warning: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.208 46:11  Error: 'user' is assigned a value but never used.  no-unused-vars
11:52:02.208 46:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.208 130:5  Warning: Unexpected console statement.  no-console
11:52:02.208 
11:52:02.208 ./src/app/api/fcm/subscribe/route.ts
11:52:02.209 2:24  Warning: 'authorize' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.209 2:24  Error: 'authorize' is defined but never used.  no-unused-vars
11:52:02.209 7:6  Warning: 'UserRole' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.209 7:6  Error: 'UserRole' is defined but never used.  no-unused-vars
11:52:02.209 29:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.210 53:5  Warning: Unexpected console statement.  no-console
11:52:02.210 78:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.210 109:5  Warning: Unexpected console statement.  no-console
11:52:02.210 
11:52:02.210 ./src/app/api/feedback/[id]/respond/route.ts
11:52:02.211 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.211 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
11:52:02.211 15:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.211 118:5  Warning: Unexpected console statement.  no-console
11:52:02.212 
11:52:02.212 ./src/app/api/feedback/[id]/route.ts
11:52:02.212 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.212 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
11:52:02.212 21:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.213 26:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.213 40:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.213 111:5  Warning: Unexpected console statement.  no-console
11:52:02.213 195:5  Warning: Unexpected console statement.  no-console
11:52:02.213 
11:52:02.213 ./src/app/api/feedback/route.ts
11:52:02.214 18:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.214 32:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.214 46:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.214 125:5  Warning: Unexpected console statement.  no-console
11:52:02.214 139:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.214 196:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.214 267:61  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.215 295:5  Warning: Unexpected console statement.  no-console
11:52:02.215 
11:52:02.217 ./src/app/api/health-records/route.ts
11:52:02.217 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.218 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
11:52:02.218 17:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.218 30:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.218 35:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.218 39:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.218 39:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.218 56:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.219 122:5  Warning: Unexpected console statement.  no-console
11:52:02.219 141:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.219 233:5  Warning: Unexpected console statement.  no-console
11:52:02.219 252:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.219 350:5  Warning: Unexpected console statement.  no-console
11:52:02.219 
11:52:02.220 ./src/app/api/jobs/route.ts
11:52:02.220 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.220 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
11:52:02.220 18:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.220 30:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.220 49:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.220 158:5  Warning: Unexpected console statement.  no-console
11:52:02.221 176:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.221 304:5  Warning: Unexpected console statement.  no-console
11:52:02.221 
11:52:02.221 ./src/app/api/marketplace-jobs/route.ts
11:52:02.222 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.231 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
11:52:02.231 17:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.231 31:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.231 147:5  Warning: Unexpected console statement.  no-console
11:52:02.231 165:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.232 251:5  Warning: Unexpected console statement.  no-console
11:52:02.232 269:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.232 389:5  Warning: Unexpected console statement.  no-console
11:52:02.232 
11:52:02.237 ./src/app/api/moderation/route.ts
11:52:02.237 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.237 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
11:52:02.237 35:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.237 75:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.237 120:70  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.238 173:70  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.238 199:5  Warning: Unexpected console statement.  no-console
11:52:02.238 216:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.238 251:5  Warning: Unexpected console statement.  no-console
11:52:02.238 268:33  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.238 307:35  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.238 339:33  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.239 371:35  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.239 
11:52:02.239 ./src/app/api/notifications/[id]/route.ts
11:52:02.239 44:5  Warning: Unexpected console statement.  no-console
11:52:02.239 104:5  Warning: Unexpected console statement.  no-console
11:52:02.239 157:5  Warning: Unexpected console statement.  no-console
11:52:02.239 
11:52:02.240 ./src/app/api/notifications/route.ts
11:52:02.240 26:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.240 82:5  Warning: Unexpected console statement.  no-console
11:52:02.240 143:5  Warning: Unexpected console statement.  no-console
11:52:02.240 
11:52:02.240 ./src/app/api/notifications/send/route.ts
11:52:02.241 4:8  Warning: 'notificationService' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.241 4:8  Error: 'notificationService' is defined but never used.  no-unused-vars
11:52:02.241 38:37  Error: 'NotificationService' is not defined.  no-undef
11:52:02.241 59:5  Warning: Unexpected console statement.  no-console
11:52:02.241 
11:52:02.241 ./src/app/api/notifications/settings/route.ts
11:52:02.242 15:9  Warning: 'currentUser' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.242 15:9  Error: 'currentUser' is assigned a value but never used.  no-unused-vars
11:52:02.242 39:5  Warning: Unexpected console statement.  no-console
11:52:02.242 57:9  Warning: 'currentUser' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.243 57:9  Error: 'currentUser' is assigned a value but never used.  no-unused-vars
11:52:02.243 75:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.243 78:16  Error: Do not access Object.prototype method 'hasOwnProperty' from target object.  no-prototype-builtins
11:52:02.243 93:5  Warning: Unexpected console statement.  no-console
11:52:02.244 
11:52:02.244 ./src/app/api/packages/route.ts
11:52:02.244 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.244 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
11:52:02.244 17:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.244 30:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.245 99:5  Warning: Unexpected console statement.  no-console
11:52:02.245 117:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.245 199:5  Warning: Unexpected console statement.  no-console
11:52:02.245 
11:52:02.245 ./src/app/api/patients/[id]/route.ts
11:52:02.245 11:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.246 22:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.246 32:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.246 
11:52:02.246 ./src/app/api/patients/route.ts
11:52:02.246 31:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.247 31:10  Error: 'authenticate' is defined but never used.  no-unused-vars
11:52:02.247 41:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.247 52:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.247 117:5  Warning: Unexpected console statement.  no-console
11:52:02.247 
11:52:02.248 ./src/app/api/payments/[id]/route.ts
11:52:02.248 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.248 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
11:52:02.248 23:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.248 28:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.248 38:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.249 103:5  Warning: Unexpected console statement.  no-console
11:52:02.249 219:5  Warning: Unexpected console statement.  no-console
11:52:02.249 
11:52:02.249 ./src/app/api/payments/bkash/callback/route.ts
11:52:02.249 16:43  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.250 29:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.250 
11:52:02.251 ./src/app/api/payments/bkash/checkout/route.ts
11:52:02.251 4:10  Warning: 'extractTokenFromHeader' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.251 4:10  Error: 'extractTokenFromHeader' is defined but never used.  no-unused-vars
11:52:02.252 4:34  Warning: 'verifyAccessToken' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.252 4:34  Error: 'verifyAccessToken' is defined but never used.  no-unused-vars
11:52:02.252 24:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.252 24:52  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.252 25:33  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.253 34:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.253 
11:52:02.253 ./src/app/api/payments/bkash/create/route.ts
11:52:02.253 105:5  Warning: Unexpected console statement.  no-console
11:52:02.253 129:11  Warning: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.253 129:11  Error: 'user' is assigned a value but never used.  no-unused-vars
11:52:02.256 189:5  Warning: Unexpected console statement.  no-console
11:52:02.256 
11:52:02.256 ./src/app/api/payments/bkash/route.ts
11:52:02.257 91:5  Warning: Unexpected console statement.  no-console
11:52:02.257 122:7  Warning: Unexpected console statement.  no-console
11:52:02.257 133:7  Warning: Unexpected console statement.  no-console
11:52:02.257 
11:52:02.257 ./src/app/api/payments/create/route.ts
11:52:02.258 77:47  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.258 98:47  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.258 112:5  Warning: Unexpected console statement.  no-console
11:52:02.258 
11:52:02.258 ./src/app/api/payments/nagad/callback/route.ts
11:52:02.258 34:7  Warning: Unexpected console statement.  no-console
11:52:02.259 63:7  Warning: Unexpected console statement.  no-console
11:52:02.259 71:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.259 73:41  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.259 100:5  Warning: Unexpected console statement.  no-console
11:52:02.259 
11:52:02.259 ./src/app/api/payments/nagad/create/route.ts
11:52:02.259 106:5  Warning: Unexpected console statement.  no-console
11:52:02.260 187:5  Warning: Unexpected console statement.  no-console
11:52:02.260 
11:52:02.260 ./src/app/api/payments/nagad/route.ts
11:52:02.260 72:5  Warning: Unexpected console statement.  no-console
11:52:02.260 83:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.260 111:5  Warning: Unexpected console statement.  no-console
11:52:02.261 122:43  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.261 140:5  Warning: Unexpected console statement.  no-console
11:52:02.261 151:40  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.261 169:5  Warning: Unexpected console statement.  no-console
11:52:02.262 180:35  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.262 202:5  Warning: Unexpected console statement.  no-console
11:52:02.262 222:5  Warning: Unexpected console statement.  no-console
11:52:02.262 
11:52:02.262 ./src/app/api/payments/refund/route.ts
11:52:02.263 4:10  Warning: 'extractTokenFromHeader' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.263 4:10  Error: 'extractTokenFromHeader' is defined but never used.  no-unused-vars
11:52:02.263 4:34  Warning: 'verifyAccessToken' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.263 4:34  Error: 'verifyAccessToken' is defined but never used.  no-unused-vars
11:52:02.263 4:53  Warning: 'hasPermission' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.263 4:53  Error: 'hasPermission' is defined but never used.  no-unused-vars
11:52:02.264 18:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.264 18:52  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.264 19:33  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.272 22:32  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.273 30:33  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.273 36:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.273 
11:52:02.274 ./src/app/api/payments/route.ts
11:52:02.274 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.274 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
11:52:02.274 20:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.274 33:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.274 43:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.275 131:5  Warning: Unexpected console statement.  no-console
11:52:02.275 151:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.275 266:5  Warning: Unexpected console statement.  no-console
11:52:02.275 
11:52:02.275 ./src/app/api/refunds/route.ts
11:52:02.275 31:7  Warning: 'getRefundSchema' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.276 31:7  Error: 'getRefundSchema' is assigned a value but never used.  no-unused-vars
11:52:02.276 35:7  Warning: 'getStatisticsSchema' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.276 35:7  Error: 'getStatisticsSchema' is assigned a value but never used.  no-unused-vars
11:52:02.276 46:27  Error: 'getServerSession' is not defined.  no-undef
11:52:02.276 46:44  Error: 'authOptions' is not defined.  no-undef
11:52:02.277 114:5  Warning: Unexpected console statement.  no-console
11:52:02.284 128:27  Error: 'getServerSession' is not defined.  no-undef
11:52:02.284 128:44  Error: 'authOptions' is not defined.  no-undef
11:52:02.284 156:5  Warning: Unexpected console statement.  no-console
11:52:02.285 167:41  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.285 167:55  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.285 203:5  Warning: Unexpected console statement.  no-console
11:52:02.285 214:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.285 214:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.285 245:5  Warning: Unexpected console statement.  no-console
11:52:02.285 256:41  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.286 256:55  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.286 288:5  Warning: Unexpected console statement.  no-console
11:52:02.286 299:45  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.287 299:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.287 327:5  Warning: Unexpected console statement.  no-console
11:52:02.288 338:80  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.288 
11:52:02.288 ./src/app/api/sessions/route.ts
11:52:02.288 48:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.288 56:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.289 59:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.289 76:5  Warning: Unexpected console statement.  no-console
11:52:02.289 137:5  Warning: Unexpected console statement.  no-console
11:52:02.289 194:5  Warning: Unexpected console statement.  no-console
11:52:02.290 
11:52:02.290 ./src/app/api/sync/route.ts
11:52:02.290 20:11  Warning: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.290 20:11  Error: 'user' is assigned a value but never used.  no-unused-vars
11:52:02.290 20:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.291 43:5  Warning: Unexpected console statement.  no-console
11:52:02.291 91:5  Warning: Unexpected console statement.  no-console
11:52:02.291 130:5  Warning: Unexpected console statement.  no-console
11:52:02.291 
11:52:02.291 ./src/app/api/upload/route.ts
11:52:02.292 88:5  Warning: Unexpected console statement.  no-console
11:52:02.292 116:5  Warning: Unexpected console statement.  no-console
11:52:02.292 131:9  Warning: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.292 131:9  Error: 'user' is assigned a value but never used.  no-unused-vars
11:52:02.293 152:5  Warning: Unexpected console statement.  no-console
11:52:02.293 
11:52:02.293 ./src/app/api/users/[id]/route.ts
11:52:02.293 16:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.293 91:5  Warning: Unexpected console statement.  no-console
11:52:02.293 109:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.293 127:7  Warning: 'isVerified' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.294 127:7  Error: 'isVerified' is assigned a value but never used.  no-unused-vars
11:52:02.294 131:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.294 168:5  Warning: Unexpected console statement.  no-console
11:52:02.294 211:5  Warning: Unexpected console statement.  no-console
11:52:02.294 
11:52:02.294 ./src/app/api/users/route.ts
11:52:02.295 4:10  Warning: 'authorizeResource' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.295 4:10  Error: 'authorizeResource' is defined but never used.  no-unused-vars
11:52:02.295 4:29  Warning: 'authorizeOwnResource' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.295 4:29  Error: 'authorizeOwnResource' is defined but never used.  no-unused-vars
11:52:02.295 5:10  Warning: 'hashPassword' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.295 5:10  Error: 'hashPassword' is defined but never used.  no-unused-vars
11:52:02.295 5:24  Warning: 'verifyPassword' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.296 5:24  Error: 'verifyPassword' is defined but never used.  no-unused-vars
11:52:02.296 9:10  Warning: 'kv' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.296 9:10  Error: 'kv' is defined but never used.  no-unused-vars
11:52:02.296 24:7  Warning: 'deactivateUserSchema' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.296 24:7  Error: 'deactivateUserSchema' is assigned a value but never used.  no-unused-vars
11:52:02.296 57:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.297 90:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.297 191:5  Warning: Unexpected console statement.  no-console
11:52:02.298 318:5  Warning: Unexpected console statement.  no-console
11:52:02.298 378:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.298 440:5  Warning: Unexpected console statement.  no-console
11:52:02.298 483:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.299 550:11  Warning: Unexpected console statement.  no-console
11:52:02.299 554:9  Warning: Unexpected console statement.  no-console
11:52:02.299 574:5  Warning: Unexpected console statement.  no-console
11:52:02.308 655:5  Warning: Unexpected console statement.  no-console
11:52:02.308 
11:52:02.308 ./src/app/api/verification/route.ts
11:52:02.309 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.309 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
11:52:02.309 39:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.309 117:5  Warning: Unexpected console statement.  no-console
11:52:02.309 134:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.310 208:31  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.310 209:31  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.310 229:5  Warning: Unexpected console statement.  no-console
11:52:02.310 
11:52:02.310 ./src/app/auth/login/page.tsx
11:52:02.311 166:16  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.312 
11:52:02.312 ./src/app/auth/reset-password/step-3/page.tsx
11:52:02.313 63:68  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.313 
11:52:02.313 ./src/app/auth/role-selection/page.tsx
11:52:02.313 102:27  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.313 
11:52:02.314 ./src/app/auth/setup-mfa/page.tsx
11:52:02.314 101:74  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.314 117:16  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.314 
11:52:02.314 ./src/app/auth/verify-mfa/page.tsx
11:52:02.315 61:5  Warning: Unexpected console statement.  no-console
11:52:02.315 
11:52:02.315 ./src/app/caregiver/availability/page.tsx
11:52:02.315 6:21  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.316 6:21  Error: 'Calendar' is defined but never used.  no-unused-vars
11:52:02.316 
11:52:02.316 ./src/app/caregiver/care-logs/activities/page.tsx
11:52:02.316 6:47  Warning: 'Plus' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.316 6:47  Error: 'Plus' is defined but never used.  no-unused-vars
11:52:02.317 
11:52:02.317 ./src/app/caregiver/care-logs/medications/page.tsx
11:52:02.317 6:27  Warning: 'Plus' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.317 6:27  Error: 'Plus' is defined but never used.  no-unused-vars
11:52:02.323 8:10  Warning: 'Textarea' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.323 8:10  Error: 'Textarea' is defined but never used.  no-unused-vars
11:52:02.324 
11:52:02.324 ./src/app/caregiver/check-in/page.tsx
11:52:02.324 17:10  Warning: 'locationMatch' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.324 17:10  Error: 'locationMatch' is assigned a value but never used.  no-unused-vars
11:52:02.324 19:10  Warning: 'photo' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.325 19:10  Error: 'photo' is assigned a value but never used.  no-unused-vars
11:52:02.325 145:42  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.325 263:18  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.325 
11:52:02.325 ./src/app/caregiver/check-out/page.tsx
11:52:02.325 16:10  Warning: 'photo' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.325 16:10  Error: 'photo' is assigned a value but never used.  no-unused-vars
11:52:02.326 
11:52:02.326 ./src/app/caregiver/checkin/confirmation/page.tsx
11:52:02.326 29:77  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.326 
11:52:02.326 ./src/app/caregiver/checkin/photo/page.tsx
11:52:02.326 22:102  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.326 
11:52:02.327 ./src/app/caregiver/dashboard/page.tsx
11:52:02.327 7:51  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.327 7:51  Error: 'Calendar' is defined but never used.  no-unused-vars
11:52:02.327 
11:52:02.327 ./src/app/caregiver/earnings/withdraw/page.tsx
11:52:02.327 6:21  Warning: 'DollarSign' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.328 6:21  Error: 'DollarSign' is defined but never used.  no-unused-vars
11:52:02.328 6:39  Warning: 'CreditCard' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.328 6:39  Error: 'CreditCard' is defined but never used.  no-unused-vars
11:52:02.328 
11:52:02.328 ./src/app/caregiver/emergency/page.tsx
11:52:02.328 6:32  Warning: 'MessageSquare' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.329 6:32  Error: 'MessageSquare' is defined but never used.  no-unused-vars
11:52:02.329 6:47  Warning: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.329 6:47  Error: 'FileText' is defined but never used.  no-unused-vars
11:52:02.329 
11:52:02.329 ./src/app/caregiver/jobs/[id]/page.tsx
11:52:02.329 6:32  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.330 6:32  Error: 'User' is defined but never used.  no-unused-vars
11:52:02.330 6:38  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.330 6:38  Error: 'Calendar' is defined but never used.  no-unused-vars
11:52:02.330 6:48  Warning: 'MapPin' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.330 6:48  Error: 'MapPin' is defined but never used.  no-unused-vars
11:52:02.330 
11:52:02.330 ./src/app/caregiver/messages/[id]/page.tsx
11:52:02.331 6:52  Warning: 'ImageIcon' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.331 6:52  Error: 'ImageIcon' is defined but never used.  no-unused-vars
11:52:02.331 14:9  Warning: 'id' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.331 14:9  Error: 'id' is assigned a value but never used.  no-unused-vars
11:52:02.331 
11:52:02.331 ./src/app/caregiver/messages/page.tsx
11:52:02.332 73:52  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.332 
11:52:02.332 ./src/app/caregiver/verification/physical/page.tsx
11:52:02.332 6:41  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.332 6:41  Error: 'Calendar' is defined but never used.  no-unused-vars
11:52:02.332 
11:52:02.332 ./src/app/caregiver/verification/psych/page.tsx
11:52:02.333 6:30  Warning: 'XCircle' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.333 6:30  Error: 'XCircle' is defined but never used.  no-unused-vars
11:52:02.333 63:52  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
11:52:02.333 63:58  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
11:52:02.333 
11:52:02.334 ./src/app/guardian/billing/page.tsx
11:52:02.334 6:48  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.334 6:48  Error: 'Calendar' is defined but never used.  no-unused-vars
11:52:02.334 111:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.335 
11:52:02.335 ./src/app/guardian/dashboard/page.tsx
11:52:02.335 7:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.335 7:10  Error: 'Button' is defined but never used.  no-unused-vars
11:52:02.335 
11:52:02.336 ./src/app/guardian/jobs/[id]/page.tsx
11:52:02.336 142:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.336 
11:52:02.337 ./src/app/guardian/jobs/page.tsx
11:52:02.337 7:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.338 7:10  Error: 'Button' is defined but never used.  no-unused-vars
11:52:02.338 89:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.338 
11:52:02.338 ./src/app/guardian/messages/[id]/page.tsx
11:52:02.338 37:5  Warning: Unexpected console statement.  no-console
11:52:02.338 
11:52:02.339 ./src/app/guardian/negotiation/waiting/page.tsx
11:52:02.339 84:68  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.339 
11:52:02.339 ./src/app/guardian/packages/[id]/page.tsx
11:52:02.339 116:65  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.339 
11:52:02.339 ./src/app/guardian/packages/filters/page.tsx
11:52:02.340 7:10  Warning: 'X' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.340 7:10  Error: 'X' is defined but never used.  no-unused-vars
11:52:02.340 31:5  Warning: Unexpected console statement.  no-console
11:52:02.340 
11:52:02.340 ./src/app/guardian/patients/[id]/edit/page.tsx
11:52:02.340 6:33  Warning: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.341 6:33  Error: 'Phone' is defined but never used.  no-unused-vars
11:52:02.341 6:40  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.341 6:40  Error: 'Calendar' is defined but never used.  no-unused-vars
11:52:02.341 6:50  Warning: 'MapPin' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.341 6:50  Error: 'MapPin' is defined but never used.  no-unused-vars
11:52:02.341 
11:52:02.342 ./src/app/guardian/patients/[id]/health-records/page.tsx
11:52:02.342 6:21  Warning: 'Upload' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.342 6:21  Error: 'Upload' is defined but never used.  no-unused-vars
11:52:02.342 78:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.342 
11:52:02.342 ./src/app/guardian/patients/[id]/page.tsx
11:52:02.343 6:52  Warning: 'Activity' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.343 6:52  Error: 'Activity' is defined but never used.  no-unused-vars
11:52:02.343 6:83  Warning: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.343 6:83  Error: 'Phone' is defined but never used.  no-unused-vars
11:52:02.343 115:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.343 
11:52:02.343 ./src/app/guardian/patients/new/page.tsx
11:52:02.344 61:5  Warning: Unexpected console statement.  no-console
11:52:02.344 
11:52:02.344 ./src/app/guardian/settings/page.tsx
11:52:02.344 56:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.344 
11:52:02.344 ./src/app/moderator/dashboard/page.tsx
11:52:02.345 6:62  Warning: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.345 6:62  Error: 'FileText' is defined but never used.  no-unused-vars
11:52:02.345 
11:52:02.345 ./src/app/moderator/disputes/[id]/page.tsx
11:52:02.345 6:21  Warning: 'Shield' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.345 6:21  Error: 'Shield' is defined but never used.  no-unused-vars
11:52:02.346 
11:52:02.346 ./src/app/moderator/packages/agency/page.tsx
11:52:02.346 6:21  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.346 6:21  Error: 'Package' is defined but never used.  no-unused-vars
11:52:02.346 6:30  Warning: 'Plus' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.346 6:30  Error: 'Plus' is defined but never used.  no-unused-vars
11:52:02.347 
11:52:02.347 ./src/app/moderator/packages/caregiver/page.tsx
11:52:02.347 6:21  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.347 6:21  Error: 'Package' is defined but never used.  no-unused-vars
11:52:02.347 6:30  Warning: 'Plus' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.347 6:30  Error: 'Plus' is defined but never used.  no-unused-vars
11:52:02.348 
11:52:02.348 ./src/app/moderator/subscription/agency/page.tsx
11:52:02.348 5:21  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.348 5:21  Error: 'Package' is defined but never used.  no-unused-vars
11:52:02.348 5:42  Warning: 'Check' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.349 5:42  Error: 'Check' is defined but never used.  no-unused-vars
11:52:02.349 9:10  Warning: 'Textarea' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.349 9:10  Error: 'Textarea' is defined but never used.  no-unused-vars
11:52:02.349 34:5  Warning: Unexpected console statement.  no-console
11:52:02.349 
11:52:02.349 ./src/app/moderator/subscription/caregiver/page.tsx
11:52:02.350 5:21  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.350 5:21  Error: 'Package' is defined but never used.  no-unused-vars
11:52:02.350 32:5  Warning: Unexpected console statement.  no-console
11:52:02.350 
11:52:02.350 ./src/app/moderator/tickets/[id]/page.tsx
11:52:02.350 6:21  Warning: 'MessageSquare' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.351 6:21  Error: 'MessageSquare' is defined but never used.  no-unused-vars
11:52:02.351 
11:52:02.351 ./src/app/moderator/verification/agencies/[id]/page.tsx
11:52:02.351 6:54  Warning: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.351 6:54  Error: 'FileText' is defined but never used.  no-unused-vars
11:52:02.351 
11:52:02.352 ./src/app/moderator/verification/caregivers/[id]/page.tsx
11:52:02.352 6:50  Warning: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.352 6:50  Error: 'FileText' is defined but never used.  no-unused-vars
11:52:02.352 
11:52:02.352 ./src/app/not-found/page.tsx
11:52:02.352 28:23  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.353 28:44  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.353 
11:52:02.353 ./src/app/not-found.tsx
11:52:02.353 42:29  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.353 42:50  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.353 
11:52:02.354 ./src/app/offline/page.tsx
11:52:02.354 19:85  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.354 21:28  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.354 47:53  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.354 
11:52:02.354 ./src/app/page.tsx
11:52:02.356 45:23  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.356 
11:52:02.356 ./src/app/patient/dashboard/page.tsx
11:52:02.356 9:20  Warning: 'Pill' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.356 9:20  Error: 'Pill' is defined but never used.  no-unused-vars
11:52:02.357 
11:52:02.357 ./src/app/patient/schedule/page.tsx
11:52:02.357 6:21  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.357 6:21  Error: 'Calendar' is defined but never used.  no-unused-vars
11:52:02.357 6:38  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.358 6:38  Error: 'User' is defined but never used.  no-unused-vars
11:52:02.358 38:66  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.358 
11:52:02.358 ./src/app/privacy/page.tsx
11:52:02.358 117:69  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.359 
11:52:02.359 ./src/app/shop/orders/[id]/page.tsx
11:52:02.359 6:35  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.359 6:35  Error: 'Package' is defined but never used.  no-unused-vars
11:52:02.359 6:44  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.360 6:44  Error: 'User' is defined but never used.  no-unused-vars
11:52:02.360 
11:52:02.360 ./src/app/shop/orders/[id]/update-status/page.tsx
11:52:02.360 6:21  Warning: 'RefreshCw' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.361 6:21  Error: 'RefreshCw' is defined but never used.  no-unused-vars
11:52:02.362 
11:52:02.362 ./src/app/shop/pending-verification/page.tsx
11:52:02.362 51:127  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.362 
11:52:02.362 ./src/app/shop/products/[id]/page.tsx
11:52:02.363 6:21  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.363 6:21  Error: 'Package' is defined but never used.  no-unused-vars
11:52:02.363 6:30  Warning: 'Edit' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.363 6:30  Error: 'Edit' is defined but never used.  no-unused-vars
11:52:02.364 
11:52:02.364 ./src/app/shop/products/new/page.tsx
11:52:02.369 11:16  Warning: 'X' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.369 11:16  Error: 'X' is defined but never used.  no-unused-vars
11:52:02.370 23:10  Warning: 'images' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.370 23:10  Error: 'images' is assigned a value but never used.  no-unused-vars
11:52:02.370 23:18  Warning: 'setImages' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.370 23:18  Error: 'setImages' is assigned a value but never used.  no-unused-vars
11:52:02.370 
11:52:02.371 ./src/app/shop-manager/inquiries/page.tsx
11:52:02.371 30:78  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
11:52:02.371 30:97  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
11:52:02.371 
11:52:02.371 ./src/app/shop-manager/inventory/update/page.tsx
11:52:02.371 14:24  Warning: 'setCurrentStock' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.372 14:24  Error: 'setCurrentStock' is assigned a value but never used.  no-unused-vars
11:52:02.372 
11:52:02.372 ./src/app/shop-manager/orders/[id]/page.tsx
11:52:02.372 6:35  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.372 6:35  Error: 'Package' is defined but never used.  no-unused-vars
11:52:02.373 6:44  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.373 6:44  Error: 'User' is defined but never used.  no-unused-vars
11:52:02.373 
11:52:02.373 ./src/components/admin/AddModerator.tsx
11:52:02.373 8:24  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.373 
11:52:02.374 ./src/components/admin/AdminBillingManagement.tsx
11:52:02.374 1:41  Warning: 'Building' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.374 1:41  Error: 'Building' is defined but never used.  no-unused-vars
11:52:02.374 
11:52:02.374 ./src/components/admin/AdminDashboard.tsx
11:52:02.374 1:25  Warning: 'Building2' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.375 1:25  Error: 'Building2' is defined but never used.  no-unused-vars
11:52:02.375 2:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.376 2:10  Error: 'Button' is defined but never used.  no-unused-vars
11:52:02.376 18:3  Warning: 'onAnalytics' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.376 18:3  Error: 'onAnalytics' is defined but never used.  no-unused-vars
11:52:02.376 
11:52:02.376 ./src/components/admin/AdminDecisionPanel.tsx
11:52:02.377 1:43  Warning: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.377 1:43  Error: 'FileText' is defined but never used.  no-unused-vars
11:52:02.377 84:70  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.377 
11:52:02.377 ./src/components/admin/AdminMessages.tsx
11:52:02.378 1:25  Warning: 'Send' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.378 1:25  Error: 'Send' is defined but never used.  no-unused-vars
11:52:02.378 1:31  Warning: 'Paperclip' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.378 1:31  Error: 'Paperclip' is defined but never used.  no-unused-vars
11:52:02.378 2:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.378 2:10  Error: 'Button' is defined but never used.  no-unused-vars
11:52:02.379 
11:52:02.379 ./src/components/admin/AgencyPackageTemplateEditor.tsx
11:52:02.379 18:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.379 
11:52:02.379 ./src/components/admin/AgencySubscriptionPackageCreatorAdmin.tsx
11:52:02.379 1:10  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.380 1:10  Error: 'Package' is defined but never used.  no-unused-vars
11:52:02.380 9:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.380 10:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.380 
11:52:02.380 ./src/components/admin/AuditLogs.tsx
11:52:02.381 1:28  Warning: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.381 1:28  Error: 'Filter' is defined but never used.  no-unused-vars
11:52:02.381 67:71  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.381 
11:52:02.382 ./src/components/admin/CVPoolManagementAdmin.tsx
11:52:02.382 1:25  Warning: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.382 1:25  Error: 'Filter' is defined but never used.  no-unused-vars
11:52:02.382 
11:52:02.382 ./src/components/admin/CaregiverDirectVerificationQueue.tsx
11:52:02.382 1:24  Warning: 'CheckCircle' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.383 1:24  Error: 'CheckCircle' is defined but never used.  no-unused-vars
11:52:02.383 
11:52:02.383 ./src/components/admin/CaregiverPackageTemplateEditor.tsx
11:52:02.383 18:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.383 
11:52:02.383 ./src/components/admin/CaregiverPsychAnalysisReview.tsx
11:52:02.384 1:10  Warning: 'Brain' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.384 1:10  Error: 'Brain' is defined but never used.  no-unused-vars
11:52:02.384 
11:52:02.384 ./src/components/admin/CaregiverSubscriptionPackageCreatorAdmin.tsx
11:52:02.384 1:10  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.385 1:10  Error: 'Package' is defined but never used.  no-unused-vars
11:52:02.386 9:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.393 10:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.394 
11:52:02.394 ./src/components/admin/DisputeCenterEscalated.tsx
11:52:02.394 1:25  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.394 1:25  Error: 'User' is defined but never used.  no-unused-vars
11:52:02.394 1:59  Warning: 'XCircle' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.395 1:59  Error: 'XCircle' is defined but never used.  no-unused-vars
11:52:02.395 
11:52:02.395 ./src/components/admin/EditModerator.tsx
11:52:02.395 1:10  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.395 1:10  Error: 'User' is defined but never used.  no-unused-vars
11:52:02.395 1:16  Warning: 'Mail' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.396 1:16  Error: 'Mail' is defined but never used.  no-unused-vars
11:52:02.396 20:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.396 
11:52:02.396 ./src/components/admin/FinancialOversight.tsx
11:52:02.396 44:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.396 
11:52:02.397 ./src/components/admin/ManualUnlock.tsx
11:52:02.397 1:31  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.397 1:31  Error: 'User' is defined but never used.  no-unused-vars
11:52:02.397 
11:52:02.397 ./src/components/admin/ModeratorManagement.tsx
11:52:02.397 51:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.398 
11:52:02.398 ./src/components/admin/ModeratorSubmissionsQueue.tsx
11:52:02.398 1:25  Warning: 'CheckCircle' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.399 1:25  Error: 'CheckCircle' is defined but never used.  no-unused-vars
11:52:02.399 1:38  Warning: 'XCircle' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.399 1:38  Error: 'XCircle' is defined but never used.  no-unused-vars
11:52:02.399 1:47  Warning: 'ArrowLeft' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.399 1:47  Error: 'ArrowLeft' is defined but never used.  no-unused-vars
11:52:02.400 36:24  Warning: 'type' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.400 36:24  Error: 'type' is defined but never used.  no-unused-vars
11:52:02.400 50:50  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.400 
11:52:02.400 ./src/components/admin/PlatformAnalytics.tsx
11:52:02.400 1:10  Warning: 'TrendingUp' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.400 1:10  Error: 'TrendingUp' is defined but never used.  no-unused-vars
11:52:02.401 45:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.401 
11:52:02.401 ./src/components/admin/SubmissionReviewPanel.tsx
11:52:02.401 57:62  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.401 
11:52:02.401 ./src/components/admin/SupportTicketsEscalated.tsx
11:52:02.401 1:22  Warning: 'Clock' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.401 1:22  Error: 'Clock' is defined but never used.  no-unused-vars
11:52:02.401 
11:52:02.401 ./src/components/admin/SystemMonitoring.tsx
11:52:02.401 1:10  Warning: 'Activity' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.401 1:10  Error: 'Activity' is defined but never used.  no-unused-vars
11:52:02.401 1:56  Warning: 'TrendingUp' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.401 1:56  Error: 'TrendingUp' is defined but never used.  no-unused-vars
11:52:02.401 
11:52:02.401 ./src/components/admin/SystemSettings.tsx
11:52:02.401 1:10  Warning: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.401 1:10  Error: 'Settings' is defined but never used.  no-unused-vars
11:52:02.401 15:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.401 
11:52:02.401 ./src/components/admin/UserManagement.tsx
11:52:02.401 65:71  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.401 77:77  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.401 
11:52:02.401 ./src/components/agency/AddCaregiverOptions.tsx
11:52:02.401 16:25  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.401 29:56  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.401 29:84  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.401 
11:52:02.401 ./src/components/agency/AgencyAdminDashboard.tsx
11:52:02.401 1:52  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.401 1:52  Error: 'Package' is defined but never used.  no-unused-vars
11:52:02.402 1:61  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.402 1:61  Error: 'Calendar' is defined but never used.  no-unused-vars
11:52:02.402 1:71  Warning: 'TrendingUp' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.405 1:71  Error: 'TrendingUp' is defined but never used.  no-unused-vars
11:52:02.405 2:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.406 2:10  Error: 'Button' is defined but never used.  no-unused-vars
11:52:02.406 18:3  Warning: 'onViewCaregivers' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.406 18:3  Error: 'onViewCaregivers' is defined but never used.  no-unused-vars
11:52:02.406 19:3  Warning: 'onViewFinance' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.406 19:3  Error: 'onViewFinance' is defined but never used.  no-unused-vars
11:52:02.407 
11:52:02.407 ./src/components/agency/AgencyAnalytics.tsx
11:52:02.407 41:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.407 
11:52:02.407 ./src/components/agency/AgencyManagerDashboard.tsx
11:52:02.407 2:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.408 2:10  Error: 'Button' is defined but never used.  no-unused-vars
11:52:02.408 
11:52:02.408 ./src/components/agency/AgencyOnboarding.tsx
11:52:02.408 14:14  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.408 
11:52:02.408 ./src/components/agency/AgencyPendingVerification.tsx
11:52:02.409 1:17  Warning: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.409 1:17  Error: 'FileText' is defined but never used.  no-unused-vars
11:52:02.409 107:26  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.409 
11:52:02.409 ./src/components/agency/AgencyProfile.tsx
11:52:02.409 40:15  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
11:52:02.410 
11:52:02.410 ./src/components/agency/AgencyRegistration.tsx
11:52:02.412 1:46  Warning: 'Mail' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.413 1:46  Error: 'Mail' is defined but never used.  no-unused-vars
11:52:02.413 9:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.413 13:50  Warning: 'onBack' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.413 13:50  Error: 'onBack' is defined but never used.  no-unused-vars
11:52:02.413 
11:52:02.413 ./src/components/agency/AgencyRegistrationStep3.tsx
11:52:02.414 9:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.414 
11:52:02.414 ./src/components/agency/AgencyRegistrationStep4.tsx
11:52:02.414 1:47  Warning: 'X' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.414 1:47  Error: 'X' is defined but never used.  no-unused-vars
11:52:02.414 7:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.415 108:19  Warning: Image elements must have an alt prop, either with meaningful text, or an empty string for decorative images.  jsx-a11y/alt-text
11:52:02.415 
11:52:02.415 ./src/components/agency/AgencyRegistrationStep5.tsx
11:52:02.415 8:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.415 45:67  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.415 
11:52:02.415 ./src/components/agency/AgencySettings.tsx
11:52:02.416 20:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.416 
11:52:02.416 ./src/components/agency/AssignCaregiverFlow.tsx
11:52:02.416 1:22  Warning: 'Briefcase' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.416 1:22  Error: 'Briefcase' is defined but never used.  no-unused-vars
11:52:02.416 27:3  Warning: 'jobId' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.424 27:3  Error: 'jobId' is defined but never used.  no-unused-vars
11:52:02.425 
11:52:02.425 ./src/components/agency/BillingHistory.tsx
11:52:02.425 41:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.426 
11:52:02.426 ./src/components/agency/CaregiverPoolSearch.tsx
11:52:02.426 94:25  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
11:52:02.426 
11:52:02.426 ./src/components/agency/CaregiverProfileView.tsx
11:52:02.426 1:37  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.427 1:37  Error: 'Calendar' is defined but never used.  no-unused-vars
11:52:02.427 
11:52:02.427 ./src/components/agency/CaregiverRoster.tsx
11:52:02.427 1:49  Warning: 'Clock' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.427 1:49  Error: 'Clock' is defined but never used.  no-unused-vars
11:52:02.427 131:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.427 
11:52:02.428 ./src/components/agency/FeedbackQueue.tsx
11:52:02.428 1:25  Warning: 'Clock' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.428 1:25  Error: 'Clock' is defined but never used.  no-unused-vars
11:52:02.428 37:45  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.428 
11:52:02.428 ./src/components/agency/JobInbox.tsx
11:52:02.428 77:50  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.428 
11:52:02.428 ./src/components/agency/ManagerReports.tsx
11:52:02.430 1:30  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.431 1:30  Error: 'Calendar' is defined but never used.  no-unused-vars
11:52:02.431 
11:52:02.431 ./src/components/agency/PackageInquiries.tsx
11:52:02.431 44:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.431 
11:52:02.431 ./src/components/agency/PackageManagement.tsx
11:52:02.432 117:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.432 
11:52:02.432 ./src/components/agency/QADashboard.tsx
11:52:02.432 1:10  Warning: 'TrendingUp' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.432 1:10  Error: 'TrendingUp' is defined but never used.  no-unused-vars
11:52:02.432 
11:52:02.433 ./src/components/agency/ReviewCounterOffer.tsx
11:52:02.433 96:72  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.433 
11:52:02.433 ./src/components/ai-assistant/AIAssistant.tsx
11:52:02.433 16:5  Warning: 'X' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.433 16:5  Error: 'X' is defined but never used.  no-unused-vars
11:52:02.433 18:5  Warning: 'Maximize2' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.433 18:5  Error: 'Maximize2' is defined but never used.  no-unused-vars
11:52:02.433 21:5  Warning: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.433 21:5  Error: 'Settings' is defined but never used.  no-unused-vars
11:52:02.434 22:5  Warning: 'HelpCircle' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.434 22:5  Error: 'HelpCircle' is defined but never used.  no-unused-vars
11:52:02.434 24:30  Warning: 'IntentType' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.440 24:30  Error: 'IntentType' is defined but never used.  no-unused-vars
11:52:02.441 60:45  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.441 
11:52:02.448 ./src/components/auth/Login.tsx
11:52:02.448 158:16  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.448 
11:52:02.449 ./src/components/auth/RoleSelection.tsx
11:52:02.449 3:10  Warning: 'Card' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.449 3:10  Error: 'Card' is defined but never used.  no-unused-vars
11:52:02.449 61:27  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.449 
11:52:02.449 ./src/components/caregiver/CareLogInterface.tsx
11:52:02.450 1:51  Warning: 'Plus' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.450 1:51  Error: 'Plus' is defined but never used.  no-unused-vars
11:52:02.450 9:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.450 15:59  Warning: 'onBack' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.450 15:59  Error: 'onBack' is defined but never used.  no-unused-vars
11:52:02.450 81:68  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.451 
11:52:02.451 ./src/components/caregiver/CaregiverDashboard.tsx
11:52:02.451 1:18  Warning: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.460 1:18  Error: 'Phone' is defined but never used.  no-unused-vars
11:52:02.461 1:60  Warning: 'MessageSquare' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.461 1:60  Error: 'MessageSquare' is defined but never used.  no-unused-vars
11:52:02.461 1:75  Warning: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.462 1:75  Error: 'Settings' is defined but never used.  no-unused-vars
11:52:02.462 57:68  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.462 
11:52:02.462 ./src/components/caregiver/CaregiverRegistration.tsx
11:52:02.462 2:50  Warning: 'CalendarIcon' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.462 2:50  Error: 'CalendarIcon' is defined but never used.  no-unused-vars
11:52:02.463 16:53  Warning: 'onBack' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.463 16:53  Error: 'onBack' is defined but never used.  no-unused-vars
11:52:02.463 39:10  Warning: 'certifications' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.463 39:10  Error: 'certifications' is assigned a value but never used.  no-unused-vars
11:52:02.463 39:26  Warning: 'setCertifications' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.463 39:26  Error: 'setCertifications' is assigned a value but never used.  no-unused-vars
11:52:02.464 42:10  Warning: 'hourlyRate' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.464 42:10  Error: 'hourlyRate' is assigned a value but never used.  no-unused-vars
11:52:02.464 42:22  Warning: 'setHourlyRate' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.464 42:22  Error: 'setHourlyRate' is assigned a value but never used.  no-unused-vars
11:52:02.464 
11:52:02.464 ./src/components/caregiver/CaregiverVerification.tsx
11:52:02.464 10:72  Warning: 'onComplete' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.464 10:72  Error: 'onComplete' is defined but never used.  no-unused-vars
11:52:02.464 65:48  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.464 224:19  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.464 263:19  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.464 274:20  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.464 
11:52:02.464 ./src/components/caregiver/CheckIn.tsx
11:52:02.464 1:46  Warning: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.464 1:46  Error: 'FileText' is defined but never used.  no-unused-vars
11:52:02.464 3:10  Warning: 'Badge' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.464 3:10  Error: 'Badge' is defined but never used.  no-unused-vars
11:52:02.464 39:16  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.464 39:53  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.464 117:19  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.464 117:33  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.464 
11:52:02.464 ./src/components/caregiver/CheckInFlow.tsx
11:52:02.464 16:31  Warning: 'jobId' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.464 16:31  Error: 'jobId' is defined but never used.  no-unused-vars
11:52:02.464 19:10  Warning: 'locationMatch' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.464 19:10  Error: 'locationMatch' is assigned a value but never used.  no-unused-vars
11:52:02.464 21:10  Warning: 'photo' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.464 21:10  Error: 'photo' is assigned a value but never used.  no-unused-vars
11:52:02.464 150:42  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.464 270:18  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.464 
11:52:02.464 ./src/components/caregiver/CheckOutFlow.tsx
11:52:02.464 1:28  Warning: 'Star' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.464 1:28  Error: 'Star' is defined but never used.  no-unused-vars
11:52:02.464 10:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.464 16:32  Warning: 'jobId' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.464 16:32  Error: 'jobId' is defined but never used.  no-unused-vars
11:52:02.464 
11:52:02.464 ./src/components/caregiver/Earnings.tsx
11:52:02.464 1:10  Warning: 'DollarSign' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.464 1:10  Error: 'DollarSign' is defined but never used.  no-unused-vars
11:52:02.464 18:28  Warning: 'onNavigate' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.464 18:28  Error: 'onNavigate' is defined but never used.  no-unused-vars
11:52:02.467 
11:52:02.468 ./src/components/caregiver/EarningsSummary.tsx
11:52:02.468 1:44  Warning: 'Download' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.468 1:44  Error: 'Download' is defined but never used.  no-unused-vars
11:52:02.468 1:54  Warning: 'Eye' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.473 1:54  Error: 'Eye' is defined but never used.  no-unused-vars
11:52:02.473 
11:52:02.473 ./src/components/caregiver/EmergencyProtocol.tsx
11:52:02.473 12:26  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.473 17:3  Warning: 'guardianPhone' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.477 17:3  Error: 'guardianPhone' is defined but never used.  no-unused-vars
11:52:02.478 
11:52:02.478 ./src/components/caregiver/GenerateInvoice.tsx
11:52:02.478 1:20  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.478 1:20  Error: 'Calendar' is defined but never used.  no-unused-vars
11:52:02.478 1:30  Warning: 'DollarSign' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.478 1:30  Error: 'DollarSign' is defined but never used.  no-unused-vars
11:52:02.479 1:42  Warning: 'Download' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.479 1:42  Error: 'Download' is defined but never used.  no-unused-vars
11:52:02.479 1:52  Warning: 'Send' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.479 1:52  Error: 'Send' is defined but never used.  no-unused-vars
11:52:02.479 8:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.479 
11:52:02.480 ./src/components/caregiver/JobDetail.tsx
11:52:02.480 1:51  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.480 1:51  Error: 'User' is defined but never used.  no-unused-vars
11:52:02.480 73:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.480 
11:52:02.480 ./src/components/caregiver/MyJobs.tsx
11:52:02.480 1:10  Warning: 'Briefcase' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.480 1:10  Error: 'Briefcase' is defined but never used.  no-unused-vars
11:52:02.480 1:21  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.480 1:21  Error: 'Calendar' is defined but never used.  no-unused-vars
11:52:02.480 1:46  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.480 1:46  Error: 'User' is defined but never used.  no-unused-vars
11:52:02.480 1:65  Warning: 'AlertCircle' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.480 1:65  Error: 'AlertCircle' is defined but never used.  no-unused-vars
11:52:02.480 23:26  Warning: 'onNavigate' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.480 23:26  Error: 'onNavigate' is defined but never used.  no-unused-vars
11:52:02.481 
11:52:02.481 ./src/components/caregiver/MyJobsList.tsx
11:52:02.483 2:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.483 2:10  Error: 'Button' is defined but never used.  no-unused-vars
11:52:02.484 81:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.484 
11:52:02.484 ./src/components/caregiver/RateGuardian.tsx
11:52:02.484 9:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.484 13:46  Warning: 'jobId' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.484 13:46  Error: 'jobId' is defined but never used.  no-unused-vars
11:52:02.484 
11:52:02.485 ./src/components/caregiver/SubscriptionPlans.tsx
11:52:02.485 10:64  Warning: 'onBack' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.485 10:64  Error: 'onBack' is defined but never used.  no-unused-vars
11:52:02.485 
11:52:02.486 ./src/components/caregiver/TrainingResources.tsx
11:52:02.486 49:71  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.486 
11:52:02.486 ./src/components/caregiver/VerificationComplete.tsx
11:52:02.487 27:77  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.487 
11:52:02.487 ./src/components/caregiver/VerificationPsychTest.tsx
11:52:02.487 86:52  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
11:52:02.487 86:58  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
11:52:02.488 
11:52:02.488 ./src/components/caregiver/ViewJobHistory.tsx
11:52:02.490 34:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.491 
11:52:02.491 ./src/components/caregiver/WithdrawEarnings.tsx
11:52:02.491 9:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.491 
11:52:02.491 ./src/components/common/Notifications.tsx
11:52:02.491 1:10  Warning: 'Bell' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.491 1:10  Error: 'Bell' is defined but never used.  no-unused-vars
11:52:02.492 3:10  Warning: 'Badge' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.492 3:10  Error: 'Badge' is defined but never used.  no-unused-vars
11:52:02.492 18:33  Warning: 'onNavigate' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.492 18:33  Error: 'onNavigate' is defined but never used.  no-unused-vars
11:52:02.492 
11:52:02.492 ./src/components/common/Settings.tsx
11:52:02.493 1:73  Warning: 'Sun' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.493 1:73  Error: 'Sun' is defined but never used.  no-unused-vars
11:52:02.493 1:78  Warning: 'Volume2' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.493 1:78  Error: 'Volume2' is defined but never used.  no-unused-vars
11:52:02.493 
11:52:02.493 ./src/components/global/AISearch.tsx
11:52:02.493 3:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.494 3:10  Error: 'Button' is defined but never used.  no-unused-vars
11:52:02.494 
11:52:02.494 ./src/components/global/BottomNav.tsx
11:52:02.494 15:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.494 
11:52:02.494 ./src/components/global/ProfileMenu.tsx
11:52:02.494 1:10  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.494 1:10  Error: 'User' is defined but never used.  no-unused-vars
11:52:02.494 9:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.494 
11:52:02.494 ./src/components/global/ThemeSelector.tsx
11:52:02.494 2:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.494 2:10  Error: 'Button' is defined but never used.  no-unused-vars
11:52:02.494 
11:52:02.494 ./src/components/global/TopBar.tsx
11:52:02.494 2:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.494 2:10  Error: 'Button' is defined but never used.  no-unused-vars
11:52:02.494 17:49  Warning: 'onLogout' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.494 17:49  Error: 'onLogout' is defined but never used.  no-unused-vars
11:52:02.494 
11:52:02.494 ./src/components/guardian/ActiveJobs.tsx
11:52:02.494 1:10  Warning: 'Briefcase' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.494 1:10  Error: 'Briefcase' is defined but never used.  no-unused-vars
11:52:02.494 1:52  Warning: 'DollarSign' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.494 1:52  Error: 'DollarSign' is defined but never used.  no-unused-vars
11:52:02.494 23:30  Warning: 'onNavigate' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.494 23:30  Error: 'onNavigate' is defined but never used.  no-unused-vars
11:52:02.495 
11:52:02.495 ./src/components/guardian/ActiveJobsList.tsx
11:52:02.495 1:18  Warning: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.495 1:18  Error: 'Filter' is defined but never used.  no-unused-vars
11:52:02.495 1:42  Warning: 'MapPin' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.495 1:42  Error: 'MapPin' is defined but never used.  no-unused-vars
11:52:02.495 1:50  Warning: 'AlertCircle' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.495 1:50  Error: 'AlertCircle' is defined but never used.  no-unused-vars
11:52:02.495 2:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.495 2:10  Error: 'Button' is defined but never used.  no-unused-vars
11:52:02.495 94:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.495 
11:52:02.495 ./src/components/guardian/AddPatient.tsx
11:52:02.495 10:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.495 60:5  Warning: Unexpected console statement.  no-console
11:52:02.495 
11:52:02.495 ./src/components/guardian/BillingInvoices.tsx
11:52:02.495 1:48  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.495 1:48  Error: 'Calendar' is defined but never used.  no-unused-vars
11:52:02.495 116:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.495 
11:52:02.495 ./src/components/guardian/EditPatient.tsx
11:52:02.495 1:33  Warning: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.495 1:33  Error: 'Phone' is defined but never used.  no-unused-vars
11:52:02.495 1:40  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.495 1:40  Error: 'Calendar' is defined but never used.  no-unused-vars
11:52:02.495 1:50  Warning: 'MapPin' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.495 1:50  Error: 'MapPin' is defined but never used.  no-unused-vars
11:52:02.495 22:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.508 26:31  Warning: 'patientId' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.508 26:31  Error: 'patientId' is defined but never used.  no-unused-vars
11:52:02.508 
11:52:02.509 ./src/components/guardian/GuardianDashboard.tsx
11:52:02.509 2:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.509 2:10  Error: 'Button' is defined but never used.  no-unused-vars
11:52:02.509 
11:52:02.509 ./src/components/guardian/GuardianRegistration.tsx
11:52:02.509 15:52  Warning: 'onBack' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.509 15:52  Error: 'onBack' is defined but never used.  no-unused-vars
11:52:02.509 41:5  Warning: Unexpected console statement.  no-console
11:52:02.510 57:5  Warning: Unexpected console statement.  no-console
11:52:02.510 66:5  Warning: Unexpected console statement.  no-console
11:52:02.510 
11:52:02.510 ./src/components/guardian/JobDetail.tsx
11:52:02.510 13:29  Warning: 'jobId' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.510 13:29  Error: 'jobId' is defined but never used.  no-unused-vars
11:52:02.511 141:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.511 
11:52:02.511 ./src/components/guardian/MyPatients.tsx
11:52:02.511 1:10  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.511 1:10  Error: 'User' is defined but never used.  no-unused-vars
11:52:02.511 1:22  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.511 1:22  Error: 'Calendar' is defined but never used.  no-unused-vars
11:52:02.511 1:47  Warning: 'Mail' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.511 1:47  Error: 'Mail' is defined but never used.  no-unused-vars
11:52:02.511 1:67  Warning: 'ArrowUpRight' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.511 1:67  Error: 'ArrowUpRight' is defined but never used.  no-unused-vars
11:52:02.511 
11:52:02.511 ./src/components/guardian/NegotiationFlow.tsx
11:52:02.511 15:24  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.511 23:3  Warning: 'packageId' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.511 23:3  Error: 'packageId' is defined but never used.  no-unused-vars
11:52:02.511 174:70  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.511 
11:52:02.511 ./src/components/guardian/PackageDetail.tsx
11:52:02.511 12:33  Warning: 'packageId' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.511 12:33  Error: 'packageId' is defined but never used.  no-unused-vars
11:52:02.511 115:65  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.511 
11:52:02.511 ./src/components/guardian/PackageFilters.tsx
11:52:02.511 10:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.512 
11:52:02.512 ./src/components/guardian/PatientDetail.tsx
11:52:02.512 1:52  Warning: 'Activity' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.512 1:52  Error: 'Activity' is defined but never used.  no-unused-vars
11:52:02.512 1:83  Warning: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.512 1:83  Error: 'Phone' is defined but never used.  no-unused-vars
11:52:02.512 13:33  Warning: 'patientId' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.512 13:33  Error: 'patientId' is defined but never used.  no-unused-vars
11:52:02.512 115:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.512 
11:52:02.512 ./src/components/guardian/PatientHealthRecords.tsx
11:52:02.512 1:21  Warning: 'Upload' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.512 1:21  Error: 'Upload' is defined but never used.  no-unused-vars
11:52:02.521 12:40  Warning: 'patientId' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.521 12:40  Error: 'patientId' is defined but never used.  no-unused-vars
11:52:02.521 75:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.521 
11:52:02.522 ./src/components/guardian/PaymentSuccess.tsx
11:52:02.522 94:65  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.522 
11:52:02.522 ./src/components/guardian/PrescriptionUpload.tsx
11:52:02.522 9:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.522 12:38  Warning: 'patientId' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.522 12:38  Error: 'patientId' is defined but never used.  no-unused-vars
11:52:02.523 
11:52:02.523 ./src/components/guardian/RateReviewCaregiver.tsx
11:52:02.523 1:19  Warning: 'ThumbsUp' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.523 1:19  Error: 'ThumbsUp' is defined but never used.  no-unused-vars
11:52:02.523 1:29  Warning: 'ThumbsDown' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.523 1:29  Error: 'ThumbsDown' is defined but never used.  no-unused-vars
11:52:02.523 10:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.524 
11:52:02.524 ./src/components/guardian/ReportIssue.tsx
11:52:02.524 10:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.524 
11:52:02.524 ./src/components/guardian/ViewPrescriptionDetail.tsx
11:52:02.524 115:71  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.524 124:15  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
11:52:02.524 
11:52:02.524 ./src/components/layout/Layout.tsx
11:52:02.524 7:10  Warning: 'LanguageSwitcher' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.524 7:10  Error: 'LanguageSwitcher' is defined but never used.  no-unused-vars
11:52:02.524 7:28  Warning: 'ThemeSwitcher' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.524 7:28  Error: 'ThemeSwitcher' is defined but never used.  no-unused-vars
11:52:02.524 32:7  Warning: Unexpected console statement.  no-console
11:52:02.524 
11:52:02.524 ./src/components/layout/Navigation.tsx
11:52:02.524 7:10  Warning: 'UserRole' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.525 7:10  Error: 'UserRole' is defined but never used.  no-unused-vars
11:52:02.525 
11:52:02.525 ./src/components/layout/UniversalNav.tsx
11:52:02.525 5:54  Warning: 'Menu' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.525 5:54  Error: 'Menu' is defined but never used.  no-unused-vars
11:52:02.525 
11:52:02.525 ./src/components/lazy/index.tsx
11:52:02.525 90:61  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.525 
11:52:02.525 ./src/components/moderator/AgencyPackageTemplateCreator.tsx
11:52:02.525 1:10  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.525 1:10  Error: 'Package' is defined but never used.  no-unused-vars
11:52:02.525 9:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.525 
11:52:02.525 ./src/components/moderator/AgencyReviewQueue.tsx
11:52:02.525 35:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.525 
11:52:02.525 ./src/components/moderator/AgencySubscriptionPackageCreator.tsx
11:52:02.525 1:10  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.525 1:10  Error: 'Package' is defined but never used.  no-unused-vars
11:52:02.525 9:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.525 10:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.525 
11:52:02.525 ./src/components/moderator/CaregiverPackageTemplateCreator.tsx
11:52:02.525 1:10  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.525 1:10  Error: 'Package' is defined but never used.  no-unused-vars
11:52:02.525 9:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.525 
11:52:02.525 ./src/components/moderator/CaregiverPsychAnalysisQueue.tsx
11:52:02.525 1:44  Warning: 'AlertCircle' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.525 1:44  Error: 'AlertCircle' is defined but never used.  no-unused-vars
11:52:02.525 
11:52:02.525 ./src/components/moderator/CaregiverSubscriptionPackageCreator.tsx
11:52:02.525 1:10  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.525 1:10  Error: 'Package' is defined but never used.  no-unused-vars
11:52:02.525 9:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.525 10:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.525 
11:52:02.525 ./src/components/moderator/CaregiverVerificationQueue.tsx
11:52:02.525 60:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.525 
11:52:02.525 ./src/components/moderator/DisputeDetail.tsx
11:52:02.525 1:10  Warning: 'AlertTriangle' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.525 1:10  Error: 'AlertTriangle' is defined but never used.  no-unused-vars
11:52:02.525 
11:52:02.525 ./src/components/moderator/DisputeResolution.tsx
11:52:02.525 53:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.525 65:67  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.525 
11:52:02.525 ./src/components/moderator/InterviewScheduler.tsx
11:52:02.525 27:78  Warning: 'onAssignCaregiver' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.525 27:78  Error: 'onAssignCaregiver' is defined but never used.  no-unused-vars
11:52:02.525 30:10  Warning: 'selectedSlot' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.525 30:10  Error: 'selectedSlot' is assigned a value but never used.  no-unused-vars
11:52:02.526 
11:52:02.526 ./src/components/moderator/ModeratorDashboard.tsx
11:52:02.526 1:62  Warning: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.526 1:62  Error: 'FileText' is defined but never used.  no-unused-vars
11:52:02.526 17:3  Warning: 'onAnalytics' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.526 17:3  Error: 'onAnalytics' is defined but never used.  no-unused-vars
11:52:02.526 
11:52:02.526 ./src/components/moderator/ModeratorSettings.tsx
11:52:02.526 1:28  Warning: 'Mail' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.526 1:28  Error: 'Mail' is defined but never used.  no-unused-vars
11:52:02.526 17:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.526 
11:52:02.526 ./src/components/moderator/SupportTickets.tsx
11:52:02.526 54:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.526 66:67  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.526 
11:52:02.526 ./src/components/moderator/TicketResponse.tsx
11:52:02.526 1:10  Warning: 'HelpCircle' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.526 1:10  Error: 'HelpCircle' is defined but never used.  no-unused-vars
11:52:02.526 
11:52:02.526 ./src/components/moderator/VerificationQueue.tsx
11:52:02.526 130:18  Error: 'X' is not defined.  react/jsx-no-undef
11:52:02.526 130:18  Error: 'X' is not defined.  no-undef
11:52:02.526 
11:52:02.526 ./src/components/patient/AppointmentsSchedule.tsx
11:52:02.526 1:35  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.526 1:35  Error: 'User' is defined but never used.  no-unused-vars
11:52:02.526 68:50  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.526 
11:52:02.526 ./src/components/patient/CareLogsView.tsx
11:52:02.526 8:32  Warning: 'patientName' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.526 8:32  Error: 'patientName' is defined but never used.  no-unused-vars
11:52:02.526 93:55  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.526 
11:52:02.526 ./src/components/patient/EmergencyContacts.tsx
11:52:02.526 3:10  Warning: 'useState' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.526 3:10  Error: 'useState' is defined but never used.  no-unused-vars
11:52:02.526 
11:52:02.526 ./src/components/patient/EmergencySOS.tsx
11:52:02.526 1:30  Warning: 'MapPin' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.526 1:30  Error: 'MapPin' is defined but never used.  no-unused-vars
11:52:02.526 1:38  Warning: 'Heart' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.526 1:38  Error: 'Heart' is defined but never used.  no-unused-vars
11:52:02.526 21:32  Warning: 'patientName' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.526 21:32  Error: 'patientName' is defined but never used.  no-unused-vars
11:52:02.526 
11:52:02.526 ./src/components/patient/MedicationSchedule.tsx
11:52:02.526 10:38  Warning: 'patientName' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.543 10:38  Error: 'patientName' is defined but never used.  no-unused-vars
11:52:02.543 114:51  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.543 
11:52:02.543 ./src/components/patient/MyCaregiverProfile.tsx
11:52:02.543 1:54  Warning: 'Heart' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.544 1:54  Error: 'Heart' is defined but never used.  no-unused-vars
11:52:02.544 38:15  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
11:52:02.544 
11:52:02.544 ./src/components/patient/PatientDashboard.tsx
11:52:02.544 68:66  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.544 115:51  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.545 
11:52:02.545 ./src/components/patient/PatientSettings.tsx
11:52:02.545 1:10  Warning: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.545 1:10  Error: 'Settings' is defined but never used.  no-unused-vars
11:52:02.545 11:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.545 
11:52:02.545 ./src/components/patient/RateCaregiverPatient.tsx
11:52:02.545 8:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.545 
11:52:02.545 ./src/components/patient/ViewHealthRecords.tsx
11:52:02.545 25:66  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.545 
11:52:02.545 ./src/components/patients/PatientForm.tsx
11:52:02.545 5:81  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.545 5:102  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.545 33:7  Warning: Unexpected console statement.  no-console
11:52:02.545 
11:52:02.545 ./src/components/providers/ClientProviders.tsx
11:52:02.547 15:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.548 
11:52:02.549 ./src/components/providers/ServiceWorkerRegistration.tsx
11:52:02.549 11:11  Warning: Unexpected console statement.  no-console
11:52:02.549 19:11  Warning: Unexpected console statement.  no-console
11:52:02.549 
11:52:02.549 ./src/components/providers/TranslationProvider.tsx
11:52:02.550 20:44  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.550 24:32  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.550 60:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.551 73:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.552 86:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.552 97:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.552 108:9  Warning: Unexpected console statement.  no-console
11:52:02.552 
11:52:02.552 ./src/components/shared/ChatScreen.tsx
11:52:02.552 13:30  Warning: 'conversationId' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.553 13:30  Error: 'conversationId' is defined but never used.  no-unused-vars
11:52:02.553 35:5  Warning: Unexpected console statement.  no-console
11:52:02.553 
11:52:02.553 ./src/components/shared/LandingPage.tsx
11:52:02.556 45:23  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.557 
11:52:02.557 ./src/components/shared/MFAVerification.tsx
11:52:02.557 12:62  Warning: 'phoneNumber' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.557 12:62  Error: 'phoneNumber' is defined but never used.  no-unused-vars
11:52:02.557 
11:52:02.557 ./src/components/shared/NotFound.tsx
11:52:02.558 42:29  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.558 42:50  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.563 
11:52:02.563 ./src/components/shared/NotificationsCenter.tsx
11:52:02.563 1:10  Warning: 'Bell' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.565 1:10  Error: 'Bell' is defined but never used.  no-unused-vars
11:52:02.565 45:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.565 
11:52:02.565 ./src/components/shared/OfflineState.tsx
11:52:02.565 28:16  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.565 78:41  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.566 
11:52:02.566 ./src/components/shared/PasswordReset.tsx
11:52:02.566 24:5  Warning: Unexpected console statement.  no-console
11:52:02.566 40:5  Warning: Unexpected console statement.  no-console
11:52:02.566 49:5  Warning: Unexpected console statement.  no-console
11:52:02.566 
11:52:02.566 ./src/components/shared/PrivacyPolicy.tsx
11:52:02.566 46:33  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
11:52:02.567 46:36  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
11:52:02.567 46:39  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
11:52:02.567 46:42  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
11:52:02.567 46:48  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
11:52:02.567 46:52  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
11:52:02.567 191:74  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.567 
11:52:02.567 ./src/components/shared/TermsAndConditions.tsx
11:52:02.567 52:44  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
11:52:02.567 52:52  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
11:52:02.567 52:55  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
11:52:02.567 52:58  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
11:52:02.567 52:61  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
11:52:02.567 52:64  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
11:52:02.567 52:70  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
11:52:02.567 52:74  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
11:52:02.567 52:106  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
11:52:02.567 52:112  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
11:52:02.567 52:246  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
11:52:02.567 52:255  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
11:52:02.567 107:68  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.567 135:29  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.567 
11:52:02.567 ./src/components/shared/UserSettings.tsx
11:52:02.567 15:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.567 
11:52:02.567 ./src/components/shop/AddEditProduct.tsx
11:52:02.567 20:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.567 
11:52:02.567 ./src/components/shop/CustomerInquiries.tsx
11:52:02.567 51:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.567 
11:52:02.567 ./src/components/shop/InventoryManagement.tsx
11:52:02.567 57:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.567 
11:52:02.567 ./src/components/shop/OrderDetail.tsx
11:52:02.567 1:32  Warning: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.567 1:32  Error: 'Phone' is defined but never used.  no-unused-vars
11:52:02.567 1:61  Warning: 'XCircle' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.567 1:61  Error: 'XCircle' is defined but never used.  no-unused-vars
11:52:02.567 
11:52:02.567 ./src/components/shop/OrderProcessing.tsx
11:52:02.568 40:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.568 
11:52:02.568 ./src/components/shop/OrderQueue.tsx
11:52:02.568 50:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.568 
11:52:02.568 ./src/components/shop/OrderQueueManager.tsx
11:52:02.568 1:10  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.568 1:10  Error: 'Package' is defined but never used.  no-unused-vars
11:52:02.568 46:45  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.577 
11:52:02.577 ./src/components/shop/ProductManagement.tsx
11:52:02.577 50:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.577 75:25  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
11:52:02.578 
11:52:02.578 ./src/components/shop/ShopAnalytics.tsx
11:52:02.578 1:48  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.581 1:48  Error: 'Package' is defined but never used.  no-unused-vars
11:52:02.581 46:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.581 
11:52:02.581 ./src/components/shop/ShopBilling.tsx
11:52:02.582 1:32  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.582 1:32  Error: 'Calendar' is defined but never used.  no-unused-vars
11:52:02.582 
11:52:02.582 ./src/components/shop/ShopPaymentReminder.tsx
11:52:02.582 1:35  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.582 1:35  Error: 'Calendar' is defined but never used.  no-unused-vars
11:52:02.583 
11:52:02.584 ./src/components/shop/ShopPendingVerification.tsx
11:52:02.585 1:17  Warning: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.585 1:17  Error: 'FileText' is defined but never used.  no-unused-vars
11:52:02.585 96:26  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
11:52:02.585 
11:52:02.585 ./src/components/shop/ShopRegistration.tsx
11:52:02.585 9:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.585 
11:52:02.586 ./src/components/shop/ShopSettings.tsx
11:52:02.586 1:17  Warning: 'MapPin' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.586 1:17  Error: 'MapPin' is defined but never used.  no-unused-vars
11:52:02.586 24:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.586 
11:52:02.586 ./src/components/ui/bkash-payment.tsx
11:52:02.586 20:3  Warning: 'onSuccess' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.587 20:3  Error: 'onSuccess' is defined but never used.  no-unused-vars
11:52:02.587 50:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.587 51:7  Warning: Unexpected console statement.  no-console
11:52:02.587 
11:52:02.587 ./src/components/ui/dashboard-charts.tsx
11:52:02.587 2:10  Warning: 'Chart' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.590 2:10  Error: 'Chart' is defined but never used.  no-unused-vars
11:52:02.590 
11:52:02.590 ./src/components/ui/data-table.tsx
11:52:02.590 21:91  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.590 
11:52:02.590 ./src/components/ui/language-switcher.tsx
11:52:02.590 11:11  Warning: 't' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.591 11:11  Error: 't' is assigned a value but never used.  no-unused-vars
11:52:02.596 
11:52:02.597 ./src/components/ui/nagad-payment.tsx
11:52:02.597 20:3  Warning: 'onSuccess' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.597 20:3  Error: 'onSuccess' is defined but never used.  no-unused-vars
11:52:02.597 49:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.598 50:7  Warning: Unexpected console statement.  no-console
11:52:02.598 
11:52:02.598 ./src/hooks/use-ai-agent.ts
11:52:02.598 107:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.598 126:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.598 140:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.598 
11:52:02.599 ./src/hooks/use-camera.ts
11:52:02.599 78:7  Warning: Unexpected console statement.  no-console
11:52:02.599 156:7  Warning: Unexpected console statement.  no-console
11:52:02.599 
11:52:02.599 ./src/hooks/use-geolocation.ts
11:52:02.599 3:20  Warning: 'useEffect' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.599 3:20  Error: 'useEffect' is defined but never used.  no-unused-vars
11:52:02.599 
11:52:02.599 ./src/hooks/use-touch-audit.tsx
11:52:02.599 43:13  Warning: 'paddingTop' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.599 43:13  Error: 'paddingTop' is assigned a value but never used.  no-unused-vars
11:52:02.599 44:13  Warning: 'paddingBottom' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.599 44:13  Error: 'paddingBottom' is assigned a value but never used.  no-unused-vars
11:52:02.599 45:13  Warning: 'paddingLeft' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.599 45:13  Error: 'paddingLeft' is assigned a value but never used.  no-unused-vars
11:52:02.599 46:13  Warning: 'paddingRight' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.599 46:13  Error: 'paddingRight' is assigned a value but never used.  no-unused-vars
11:52:02.599 163:6  Warning: React Hook useEffect has a missing dependency: 'auditTouchTargets'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
11:52:02.599 
11:52:02.599 ./src/hooks/useApi.ts
11:52:02.599 2:10  Warning: 'ApiResponse' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.599 2:10  Error: 'ApiResponse' is defined but never used.  no-unused-vars
11:52:02.599 17:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.599 21:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.599 22:26  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.599 34:47  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.599 91:37  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.599 92:55  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.599 185:30  Warning: 'T' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.599 185:30  Error: 'T' is defined but never used.  no-unused-vars
11:52:02.599 190:33  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.599 243:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.599 247:35  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.599 248:26  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.599 257:47  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.599 
11:52:02.599 ./src/hooks/useAuth.ts
11:52:02.599 56:9  Warning: Unexpected console statement.  no-console
11:52:02.599 192:7  Warning: Unexpected console statement.  no-console
11:52:02.599 243:5  Error: Unnecessary try/catch wrapper.  no-useless-catch
11:52:02.599 318:5  Error: Unnecessary try/catch wrapper.  no-useless-catch
11:52:02.599 
11:52:02.599 ./src/hooks/useOfflineSync.ts
11:52:02.599 57:7  Warning: Unexpected console statement.  no-console
11:52:02.599 88:7  Warning: Unexpected console statement.  no-console
11:52:02.599 102:6  Warning: React Hook useCallback has a missing dependency: 'options'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
11:52:02.599 105:51  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.599 109:7  Warning: Unexpected console statement.  no-console
11:52:02.599 115:67  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.599 122:7  Warning: Unexpected console statement.  no-console
11:52:02.599 143:7  Warning: Unexpected console statement.  no-console
11:52:02.600 168:37  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 
11:52:02.600 ./src/hooks/useTranslation.ts
11:52:02.600 2:21  Warning: 'tSync' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.600 2:21  Error: 'tSync' is defined but never used.  no-unused-vars
11:52:02.600 19:44  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 48:32  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 80:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.600 
11:52:02.600 ./src/lib/admin.ts
11:52:02.600 5:45  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 24:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 29:46  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 39:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 39:54  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 40:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 41:24  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 44:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 51:100  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 53:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 
11:52:02.600 ./src/lib/auth.ts
11:52:02.600 1:15  Warning: 'SignOptions' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.600 1:15  Error: 'SignOptions' is defined but never used.  no-unused-vars
11:52:02.600 9:24  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 74:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.600 82:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.600 157:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 
11:52:02.600 ./src/lib/cdn-service.ts
11:52:02.600 88:7  Warning: Unexpected console statement.  no-console
11:52:02.600 115:7  Warning: Unexpected console statement.  no-console
11:52:02.600 135:7  Warning: Unexpected console statement.  no-console
11:52:02.600 167:7  Warning: Unexpected console statement.  no-console
11:52:02.600 
11:52:02.600 ./src/lib/chat-analytics.ts
11:52:02.600 9:10  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 10:29  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 111:74  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 128:78  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 145:76  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 163:80  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 181:74  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 200:24  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 229:66  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 234:66  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 235:71  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 236:74  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 237:73  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 403:3  Warning: Unexpected console statement.  no-console
11:52:02.600 
11:52:02.600 ./src/lib/db-utils.ts
11:52:02.600 89:11  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 122:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 220:14  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 233:5  Warning: Unexpected console statement.  no-console
11:52:02.600 
11:52:02.600 ./src/lib/escrow-service.ts
11:52:02.600 30:29  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 38:29  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.600 118:7  Warning: Unexpected console statement.  no-console
11:52:02.600 193:7  Warning: Unexpected console statement.  no-console
11:52:02.601 257:7  Warning: Unexpected console statement.  no-console
11:52:02.601 315:7  Warning: Unexpected console statement.  no-console
11:52:02.601 339:7  Warning: Unexpected console statement.  no-console
11:52:02.601 353:26  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.601 391:7  Warning: Unexpected console statement.  no-console
11:52:02.601 399:91  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.601 421:7  Warning: Unexpected console statement.  no-console
11:52:02.601 433:31  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.601 447:7  Warning: Unexpected console statement.  no-console
11:52:02.601 
11:52:02.601 ./src/lib/fcm-service.ts
11:52:02.601 41:13  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.601 61:9  Warning: Unexpected console statement.  no-console
11:52:02.601 72:7  Warning: Unexpected console statement.  no-console
11:52:02.601 74:7  Warning: Unexpected console statement.  no-console
11:52:02.601 105:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.601 113:31  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.601 123:46  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.601 128:7  Warning: Unexpected console statement.  no-console
11:52:02.601 150:31  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.601 158:7  Warning: Unexpected console statement.  no-console
11:52:02.601 186:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.601 192:7  Warning: Unexpected console statement.  no-console
11:52:02.601 217:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.601 223:7  Warning: Unexpected console statement.  no-console
11:52:02.601 257:7  Warning: Unexpected console statement.  no-console
11:52:02.601 275:7  Warning: Unexpected console statement.  no-console
11:52:02.601 280:46  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.601 319:7  Warning: Unexpected console statement.  no-console
11:52:02.601 329:64  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.601 350:62  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.601 372:55  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.601 
11:52:02.601 ./src/lib/file-storage.ts
11:52:02.601 30:33  Warning: 'isPublic' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.601 30:33  Error: 'isPublic' is assigned a value but never used.  no-unused-vars
11:52:02.601 80:33  Warning: 'isPublic' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.601 80:33  Error: 'isPublic' is assigned a value but never used.  no-unused-vars
11:52:02.601 97:7  Warning: Unexpected console statement.  no-console
11:52:02.601 144:5  Warning: 'options' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.601 144:5  Error: 'options' is defined but never used.  no-unused-vars
11:52:02.601 
11:52:02.601 ./src/lib/i18n.ts
11:52:02.601 16:40  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.601 50:5  Warning: Unexpected console statement.  no-console
11:52:02.601 60:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.601 106:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.601 119:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.601 129:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.601 
11:52:02.601 ./src/lib/image-loader.js
11:52:02.601 13:11  Warning: 'resourcePath' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.601 13:11  Error: 'resourcePath' is assigned a value but never used.  no-unused-vars
11:52:02.601 49:5  Warning: Unexpected console statement.  no-console
11:52:02.601 
11:52:02.601 ./src/lib/middleware/api-auth.ts
11:52:02.601 6:68  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.601 7:49  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.601 21:61  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.601 22:51  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.601 43:61  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 44:51  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 65:61  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 66:51  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 91:61  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 92:51  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 134:76  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 135:49  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 152:75  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 153:49  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 166:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 180:61  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 181:51  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 250:61  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 251:51  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 282:76  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 283:49  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 287:7  Warning: Unexpected console statement.  no-console
11:52:02.602 334:78  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 335:49  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 340:5  Warning: Unexpected console statement.  no-console
11:52:02.602 347:7  Warning: Unexpected console statement.  no-console
11:52:02.602 354:7  Warning: Unexpected console statement.  no-console
11:52:02.602 
11:52:02.602 ./src/lib/middleware/auth.ts
11:52:02.602 5:3  Warning: 'hasResourcePermission' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.602 5:3  Error: 'hasResourcePermission' is defined but never used.  no-unused-vars
11:52:02.602 48:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 59:5  Warning: Unexpected console statement.  no-console
11:52:02.602 75:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 96:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 114:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 126:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 140:39  Warning: 'resourceId' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.602 140:39  Error: 'resourceId' is defined but never used.  no-unused-vars
11:52:02.602 147:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 183:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 196:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 204:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 220:44  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 
11:52:02.602 ./src/lib/middleware/errorHandler.ts
11:52:02.602 17:39  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 18:3  Warning: Unexpected console statement.  no-console
11:52:02.602 110:48  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 
11:52:02.602 ./src/lib/middleware/performance.ts
11:52:02.602 57:9  Warning: 'performanceColor' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.602 57:9  Error: 'performanceColor' is assigned a value but never used.  no-unused-vars
11:52:02.602 77:9  Warning: Unexpected console statement.  no-console
11:52:02.602 79:9  Warning: Unexpected console statement.  no-console
11:52:02.602 99:7  Warning: Unexpected console statement.  no-console
11:52:02.602 118:71  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 121:7  Warning: Unexpected console statement.  no-console
11:52:02.602 124:61  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.602 125:71  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.620 177:9  Warning: Unexpected console statement.  no-console
11:52:02.620 179:9  Warning: Unexpected console statement.  no-console
11:52:02.620 188:7  Warning: Unexpected console statement.  no-console
11:52:02.620 208:7  Error: React Hook "React.useEffect" is called conditionally. React Hooks must be called in the exact same order in every component render.  react-hooks/rules-of-hooks
11:52:02.620 212:9  Warning: Unexpected console statement.  no-console
11:52:02.620 245:9  Warning: Unexpected console statement.  no-console
11:52:02.621 299:5  Warning: Unexpected console statement.  no-console
11:52:02.621 318:9  Warning: Unexpected console statement.  no-console
11:52:02.621 326:1  Warning: Assign object to a variable before exporting as module default  import/no-anonymous-default-export
11:52:02.621 
11:52:02.621 ./src/lib/middleware/rateLimit.ts
11:52:02.621 7:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.621 10:24  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.621 10:72  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.621 12:24  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.621 12:74  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.621 57:5  Warning: Unexpected console statement.  no-console
11:52:02.622 
11:52:02.622 ./src/lib/middleware/request-auth.ts
11:52:02.622 28:14  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.622 35:54  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.622 36:12  Warning: 'err' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.622 36:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.622 41:44  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.622 46:12  Warning: 'err' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.622 46:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.626 51:39  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.626 
11:52:02.627 ./src/lib/middleware/security.ts
11:52:02.627 3:10  Warning: 'authRateLimiter' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.627 3:10  Error: 'authRateLimiter' is defined but never used.  no-unused-vars
11:52:02.628 63:9  Warning: 'securityHeaders' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.628 63:9  Error: 'securityHeaders' is assigned a value but never used.  no-unused-vars
11:52:02.629 98:9  Warning: 'method' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.629 98:9  Error: 'method' is assigned a value but never used.  no-unused-vars
11:52:02.629 111:5  Warning: Unexpected console statement.  no-console
11:52:02.629 128:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.629 129:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.629 130:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.630 141:9  Warning: 'host' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.630 141:9  Error: 'host' is assigned a value but never used.  no-unused-vars
11:52:02.630 179:9  Warning: 'method' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.630 179:9  Error: 'method' is assigned a value but never used.  no-unused-vars
11:52:02.630 191:7  Warning: Unexpected console statement.  no-console
11:52:02.630 210:7  Warning: Unexpected console statement.  no-console
11:52:02.630 230:7  Warning: Unexpected console statement.  no-console
11:52:02.631 
11:52:02.631 ./src/lib/middleware/validation.ts
11:52:02.631 7:3  Warning: 'userRegistrationSchema' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.631 7:3  Error: 'userRegistrationSchema' is defined but never used.  no-unused-vars
11:52:02.631 8:3  Warning: 'userLoginSchema' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.631 8:3  Error: 'userLoginSchema' is defined but never used.  no-unused-vars
11:52:02.631 9:3  Warning: 'userUpdateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.631 9:3  Error: 'userUpdateSchema' is defined but never used.  no-unused-vars
11:52:02.631 10:3  Warning: 'passwordResetSchema' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.631 10:3  Error: 'passwordResetSchema' is defined but never used.  no-unused-vars
11:52:02.631 11:3  Warning: 'passwordResetConfirmSchema' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.631 11:3  Error: 'passwordResetConfirmSchema' is defined but never used.  no-unused-vars
11:52:02.631 12:3  Warning: 'otpVerificationSchema' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.631 12:3  Error: 'otpVerificationSchema' is defined but never used.  no-unused-vars
11:52:02.631 13:3  Warning: 'sendOTPSchema' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.631 13:3  Error: 'sendOTPSchema' is defined but never used.  no-unused-vars
11:52:02.631 14:3  Warning: 'companyCreateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.631 14:3  Error: 'companyCreateSchema' is defined but never used.  no-unused-vars
11:52:02.631 15:3  Warning: 'companyUpdateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.631 15:3  Error: 'companyUpdateSchema' is defined but never used.  no-unused-vars
11:52:02.631 16:3  Warning: 'caregiverCreateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.631 16:3  Error: 'caregiverCreateSchema' is defined but never used.  no-unused-vars
11:52:02.631 17:3  Warning: 'caregiverUpdateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.631 17:3  Error: 'caregiverUpdateSchema' is defined but never used.  no-unused-vars
11:52:02.631 18:3  Warning: 'patientCreateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.631 18:3  Error: 'patientCreateSchema' is defined but never used.  no-unused-vars
11:52:02.631 19:3  Warning: 'patientUpdateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.631 19:3  Error: 'patientUpdateSchema' is defined but never used.  no-unused-vars
11:52:02.631 20:3  Warning: 'packageCreateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.631 20:3  Error: 'packageCreateSchema' is defined but never used.  no-unused-vars
11:52:02.631 21:3  Warning: 'packageUpdateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.631 21:3  Error: 'packageUpdateSchema' is defined but never used.  no-unused-vars
11:52:02.631 22:3  Warning: 'jobCreateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.631 22:3  Error: 'jobCreateSchema' is defined but never used.  no-unused-vars
11:52:02.631 23:3  Warning: 'jobUpdateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.631 23:3  Error: 'jobUpdateSchema' is defined but never used.  no-unused-vars
11:52:02.631 24:3  Warning: 'paymentCreateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.631 24:3  Error: 'paymentCreateSchema' is defined but never used.  no-unused-vars
11:52:02.631 25:3  Warning: 'careLogCreateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.631 25:3  Error: 'careLogCreateSchema' is defined but never used.  no-unused-vars
11:52:02.631 26:3  Warning: 'feedbackCreateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.631 26:3  Error: 'feedbackCreateSchema' is defined but never used.  no-unused-vars
11:52:02.631 27:3  Warning: 'healthRecordCreateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.631 27:3  Error: 'healthRecordCreateSchema' is defined but never used.  no-unused-vars
11:52:02.631 28:3  Warning: 'healthRecordUpdateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.631 28:3  Error: 'healthRecordUpdateSchema' is defined but never used.  no-unused-vars
11:52:02.631 29:3  Warning: 'marketplaceJobCreateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.631 29:3  Error: 'marketplaceJobCreateSchema' is defined but never used.  no-unused-vars
11:52:02.631 30:3  Warning: 'marketplaceJobApplicationSchema' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.631 30:3  Error: 'marketplaceJobApplicationSchema' is defined but never used.  no-unused-vars
11:52:02.631 31:3  Warning: 'notificationCreateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.631 31:3  Error: 'notificationCreateSchema' is defined but never used.  no-unused-vars
11:52:02.631 32:3  Warning: 'notificationUpdateSchema' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.631 32:3  Error: 'notificationUpdateSchema' is defined but never used.  no-unused-vars
11:52:02.631 51:33  Warning: 'T' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.631 51:33  Error: 'T' is defined but never used.  no-unused-vars
11:52:02.631 51:44  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.631 51:55  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.631 63:38  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.631 74:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.631 76:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.631 86:39  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.631 89:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.631 
11:52:02.631 ./src/lib/notification-service.ts
11:52:02.631 13:5  Warning: Unexpected console statement.  no-console
11:52:02.631 41:7  Warning: Unexpected console statement.  no-console
11:52:02.631 44:7  Warning: Unexpected console statement.  no-console
11:52:02.631 
11:52:02.631 ./src/lib/offline-service.ts
11:52:02.631 6:9  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.631 18:9  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.631 42:9  Warning: Unexpected console statement.  no-console
11:52:02.631 59:9  Warning: Unexpected console statement.  no-console
11:52:02.631 65:55  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.631 99:112  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.631 114:46  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.631 155:9  Warning: Unexpected console statement.  no-console
11:52:02.632 246:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.632 
11:52:02.632 ./src/lib/payment-gateways/bkash.ts
11:52:02.632 112:7  Warning: Unexpected console statement.  no-console
11:52:02.632 143:7  Warning: Unexpected console statement.  no-console
11:52:02.632 174:7  Warning: Unexpected console statement.  no-console
11:52:02.632 207:7  Warning: Unexpected console statement.  no-console
11:52:02.632 233:38  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.632 255:7  Warning: Unexpected console statement.  no-console
11:52:02.632 269:14  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.632 296:7  Warning: Unexpected console statement.  no-console
11:52:02.632 327:7  Warning: Unexpected console statement.  no-console
11:52:02.632 
11:52:02.632 ./src/lib/payment-gateways/nagad.ts
11:52:02.632 118:7  Warning: Unexpected console statement.  no-console
11:52:02.632 152:7  Warning: Unexpected console statement.  no-console
11:52:02.632 186:7  Warning: Unexpected console statement.  no-console
11:52:02.632 222:7  Warning: Unexpected console statement.  no-console
11:52:02.632 230:38  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.632 255:7  Warning: Unexpected console statement.  no-console
11:52:02.632 
11:52:02.632 ./src/lib/payment-service.ts
11:52:02.632 1:52  Warning: 'BkashPaymentResponse' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.632 1:52  Error: 'BkashPaymentResponse' is defined but never used.  no-unused-vars
11:52:02.641 2:52  Warning: 'NagadPaymentResponse' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.641 2:52  Error: 'NagadPaymentResponse' is defined but never used.  no-unused-vars
11:52:02.641 49:11  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.643 61:11  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.643 78:11  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.643 80:11  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.644 90:11  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.644 113:7  Warning: Unexpected console statement.  no-console
11:52:02.644 125:11  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.644 142:11  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.644 165:7  Warning: Unexpected console statement.  no-console
11:52:02.644 175:5  Warning: 'callbackData' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.644 175:5  Error: 'callbackData' is defined but never used.  no-unused-vars
11:52:02.650 175:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.651 191:7  Warning: Unexpected console statement.  no-console
11:52:02.651 204:11  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.651 221:11  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.651 244:7  Warning: Unexpected console statement.  no-console
11:52:02.651 
11:52:02.651 ./src/lib/payments/bkash.ts
11:52:02.652 34:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.652 76:14  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.652 85:38  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.652 98:1  Warning: Assign object to a variable before exporting as module default  import/no-anonymous-default-export
11:52:02.652 
11:52:02.652 ./src/lib/payments/escrow.ts
11:52:02.652 9:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.652 20:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.652 41:33  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.652 53:57  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.656 54:9  Warning: 'updated' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.656 54:9  Error: 'updated' is assigned a value but never used.  no-unused-vars
11:52:02.657 63:31  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.657 79:1  Warning: Assign object to a variable before exporting as module default  import/no-anonymous-default-export
11:52:02.659 
11:52:02.659 ./src/lib/payments/nagad.ts
11:52:02.659 32:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.659 71:14  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.659 80:38  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.659 93:1  Warning: Assign object to a variable before exporting as module default  import/no-anonymous-default-export
11:52:02.659 
11:52:02.659 ./src/lib/payments/webhooks.ts
11:52:02.659 16:12  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.659 
11:52:02.659 ./src/lib/performance.ts
11:52:02.659 113:39  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.659 113:49  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.659 127:39  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.660 127:49  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.660 144:38  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.660 144:48  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.660 183:62  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.660 188:7  Warning: Unexpected console statement.  no-console
11:52:02.660 206:7  Warning: Unexpected console statement.  no-console
11:52:02.660 214:7  Warning: Unexpected console statement.  no-console
11:52:02.660 236:9  Warning: Unexpected console statement.  no-console
11:52:02.660 242:7  Warning: Unexpected console statement.  no-console
11:52:02.660 322:9  Warning: 'visibleItems' is never reassigned. Use 'const' instead.  prefer-const
11:52:02.660 348:1  Warning: Assign object to a variable before exporting as module default  import/no-anonymous-default-export
11:52:02.660 
11:52:02.660 ./src/lib/rbac-examples.ts
11:52:02.660 34:9  Warning: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.661 34:9  Error: 'user' is assigned a value but never used.  no-unused-vars
11:52:02.661 44:9  Warning: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.661 44:9  Error: 'user' is assigned a value but never used.  no-unused-vars
11:52:02.661 54:9  Warning: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.661 54:9  Error: 'user' is assigned a value but never used.  no-unused-vars
11:52:02.661 65:9  Warning: 'targetUserId' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.661 65:9  Error: 'targetUserId' is assigned a value but never used.  no-unused-vars
11:52:02.661 68:39  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.661 68:44  Warning: 'request' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.661 68:44  Error: 'request' is defined but never used.  no-unused-vars
11:52:02.661 128:3  Warning: Unexpected console statement.  no-console
11:52:02.661 136:3  Warning: Unexpected console statement.  no-console
11:52:02.662 137:3  Warning: Unexpected console statement.  no-console
11:52:02.662 138:3  Warning: Unexpected console statement.  no-console
11:52:02.662 139:3  Warning: Unexpected console statement.  no-console
11:52:02.662 143:3  Warning: Unexpected console statement.  no-console
11:52:02.662 232:3  Warning: Unexpected console statement.  no-console
11:52:02.662 
11:52:02.662 ./src/lib/refund-service.ts
11:52:02.662 24:29  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.662 41:29  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.662 125:7  Warning: Unexpected console statement.  no-console
11:52:02.662 208:7  Warning: Unexpected console statement.  no-console
11:52:02.662 258:7  Warning: Unexpected console statement.  no-console
11:52:02.662 285:7  Warning: Unexpected console statement.  no-console
11:52:02.662 299:26  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.662 346:7  Warning: Unexpected console statement.  no-console
11:52:02.663 427:7  Warning: Unexpected console statement.  no-console
11:52:02.663 467:7  Warning: Unexpected console statement.  no-console
11:52:02.663 482:31  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.663 496:7  Warning: Unexpected console statement.  no-console
11:52:02.663 518:26  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.663 576:7  Warning: Unexpected console statement.  no-console
11:52:02.663 
11:52:02.663 ./src/lib/security.ts
11:52:02.663 97:48  Error: Unnecessary escape character: \[.  no-useless-escape
11:52:02.663 97:65  Error: Unnecessary escape character: \/.  no-useless-escape
11:52:02.663 110:42  Error: Unnecessary escape character: \(.  no-useless-escape
11:52:02.664 110:44  Error: Unnecessary escape character: \).  no-useless-escape
11:52:02.664 182:69  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.664 192:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.664 
11:52:02.664 ./src/lib/session-manager.ts
11:52:02.664 45:5  Warning: Unexpected console statement.  no-console
11:52:02.664 130:5  Warning: Unexpected console statement.  no-console
11:52:02.664 150:14  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.664 220:5  Warning: Unexpected console statement.  no-console
11:52:02.664 232:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.664 321:14  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.664 322:16  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.665 323:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.665 345:7  Warning: 'timeRangeStart' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.665 345:7  Error: 'timeRangeStart' is assigned a value but never used.  no-unused-vars
11:52:02.665 386:3  Warning: Unexpected console statement.  no-console
11:52:02.665 391:5  Warning: Unexpected console statement.  no-console
11:52:02.665 393:5  Warning: Unexpected console statement.  no-console
11:52:02.665 396:3  Warning: Unexpected console statement.  no-console
11:52:02.665 
11:52:02.665 ./src/lib/session.ts
11:52:02.665 105:5  Warning: Unexpected console statement.  no-console
11:52:02.665 124:5  Warning: Unexpected console statement.  no-console
11:52:02.665 144:5  Warning: Unexpected console statement.  no-console
11:52:02.665 163:5  Warning: Unexpected console statement.  no-console
11:52:02.669 182:5  Warning: Unexpected console statement.  no-console
11:52:02.672 202:5  Warning: Unexpected console statement.  no-console
11:52:02.672 218:5  Warning: Unexpected console statement.  no-console
11:52:02.672 235:5  Warning: Unexpected console statement.  no-console
11:52:02.672 273:5  Warning: Unexpected console statement.  no-console
11:52:02.672 304:5  Warning: Unexpected console statement.  no-console
11:52:02.672 
11:52:02.672 ./src/lib/utils.ts
11:52:02.672 83:46  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.672 83:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.673 106:46  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.673 106:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.673 
11:52:02.673 ./src/middleware.ts
11:52:02.673 6:9  Warning: 'origin' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:52:02.673 6:9  Error: 'origin' is assigned a value but never used.  no-unused-vars
11:52:02.673 
11:52:02.673 ./src/notifications/providers/email.service.ts
11:52:02.673 6:7  Warning: Unexpected console statement.  no-console
11:52:02.673 12:95  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.673 31:7  Warning: Unexpected console statement.  no-console
11:52:02.673 
11:52:02.673 ./src/notifications/providers/push.service.ts
11:52:02.673 12:26  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.673 13:21  Warning: Unexpected console statement.  no-console
11:52:02.673 16:17  Warning: Unexpected console statement.  no-console
11:52:02.673 32:13  Warning: Unexpected console statement.  no-console
11:52:02.673 
11:52:02.673 ./src/notifications/providers/sms.service.ts
11:52:02.673 4:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.673 8:13  Warning: Unexpected console statement.  no-console
11:52:02.673 26:13  Warning: Unexpected console statement.  no-console
11:52:02.673 
11:52:02.673 ./src/services/ai-agent/ai-agent-service.ts
11:52:02.673 20:5  Warning: 'NavigationAction' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.673 20:5  Error: 'NavigationAction' is defined but never used.  no-unused-vars
11:52:02.673 21:5  Warning: 'FormAction' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.673 21:5  Error: 'FormAction' is defined but never used.  no-unused-vars
11:52:02.673 48:13  Warning: Unexpected console statement.  no-console
11:52:02.673 125:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.674 126:13  Warning: Unexpected console statement.  no-console
11:52:02.674 140:48  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.674 203:63  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.674 258:46  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.674 258:51  Warning: 'context' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.674 258:51  Error: 'context' is defined but never used.  no-unused-vars
11:52:02.674 302:18  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.674 332:18  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.674 402:27  Warning: 'input' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.674 402:27  Error: 'input' is defined but never used.  no-unused-vars
11:52:02.674 402:42  Warning: 'context' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.674 402:42  Error: 'context' is defined but never used.  no-unused-vars
11:52:02.674 
11:52:02.674 ./src/services/ai-agent/context-manager.ts
11:52:02.674 222:13  Warning: Unexpected console statement.  no-console
11:52:02.674 236:13  Warning: Unexpected console statement.  no-console
11:52:02.674 255:13  Warning: Unexpected console statement.  no-console
11:52:02.674 
11:52:02.674 ./src/services/ai-agent/form-controller.ts
11:52:02.674 93:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.674 110:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.674 111:9  Warning: Unexpected console statement.  no-console
11:52:02.674 163:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.674 178:50  Warning: 'language' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.674 178:50  Error: 'language' is defined but never used.  no-unused-vars
11:52:02.674 223:13  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.674 235:13  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.674 
11:52:02.675 ./src/services/ai-agent/gemini-client.ts
11:52:02.675 179:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.675 180:9  Warning: Unexpected console statement.  no-console
11:52:02.675 233:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.675 234:9  Warning: Unexpected console statement.  no-console
11:52:02.675 
11:52:02.675 ./src/services/ai-agent/intent-classifier.ts
11:52:02.675 38:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.675 54:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.675 55:9  Warning: Unexpected console statement.  no-console
11:52:02.675 114:56  Warning: 'context' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.675 114:56  Error: 'context' is defined but never used.  no-unused-vars
11:52:02.675 
11:52:02.675 ./src/services/ai-agent/prompts.ts
11:52:02.675 6:24  Warning: 'UserRole' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.675 6:24  Error: 'UserRole' is defined but never used.  no-unused-vars
11:52:02.675 129:16  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.675 
11:52:02.675 ./src/services/ai-agent/text-to-speech.ts
11:52:02.675 37:13  Warning: Unexpected console statement.  no-console
11:52:02.675 77:13  Warning: Unexpected console statement.  no-console
11:52:02.675 
11:52:02.675 ./src/services/ai-agent/voice-recognition.ts
11:52:02.675 16:34  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.675 18:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.675 18:60  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.675 25:26  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.675 67:45  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.676 84:44  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.676 85:13  Warning: Unexpected console statement.  no-console
11:52:02.676 137:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.676 138:13  Warning: Unexpected console statement.  no-console
11:52:02.676 153:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.676 154:13  Warning: Unexpected console statement.  no-console
11:52:02.676 168:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.676 169:13  Warning: Unexpected console statement.  no-console
11:52:02.676 236:13  Warning: Unexpected console statement.  no-console
11:52:02.676 253:18  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.676 
11:52:02.676 ./src/services/api.ts
11:52:02.676 9:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.676 66:58  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.676 80:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.676 87:41  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.676 94:43  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.676 129:20  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
11:52:02.676 
11:52:02.676 ./src/store/index.ts
11:52:02.676 6:14  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.676 10:12  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.676 21:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.676 23:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.676 76:7  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.676 88:7  Error: Unexpected lexical declaration in case block.  no-case-declarations
11:52:02.684 154:29  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.685 164:35  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.685 
11:52:02.685 ./src/types/ai-agent.ts
11:52:02.685 38:11  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.685 60:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.685 
11:52:02.685 ./src/types/index.ts
11:52:02.685 33:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.685 60:11  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.685 61:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.685 63:14  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.685 64:26  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.685 89:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.686 111:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.691 112:16  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.691 148:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.691 162:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.691 202:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.691 218:9  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.691 220:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.691 232:14  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.691 249:10  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.691 266:10  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.691 283:13  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.691 296:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.691 311:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.691 318:34  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.691 323:13  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.691 326:40  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.691 376:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.691 
11:52:02.691 ./src/utils/index.ts
11:52:02.691 128:44  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.691 156:47  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.691 165:47  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.692 178:32  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.692 305:7  Warning: Unexpected console statement.  no-console
11:52:02.692 315:7  Warning: Unexpected console statement.  no-console
11:52:02.692 325:7  Warning: Unexpected console statement.  no-console
11:52:02.692 331:46  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.692 331:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.692 344:46  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.692 344:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:52:02.692 
11:52:02.692 info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/basic-features/eslint#disabling-rules
11:52:02.692 Error: Command "npm run build" exited with 1