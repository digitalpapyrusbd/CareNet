12:27:47.201 Running build in Washington, D.C., USA (East) – iad1
12:27:47.202 Build machine configuration: 2 cores, 8 GB
12:27:47.212 Cloning github.com/digitalpapyrusbd/CareNet (Branch: main, Commit: 6600731)
12:27:47.213 Skipping build cache, deployment was triggered without cache.
12:27:48.259 Cloning completed: 1.047s
12:27:48.960 Warning: Detected "engines": { "node": ">=18.17.0" } in your `package.json` that will automatically upgrade when a new major Node.js Version is released. Learn More: http://vercel.link/node-version
12:27:48.961 Running "vercel build"
12:27:49.381 Vercel CLI 50.0.1
12:27:49.905 Warning: Detected "engines": { "node": ">=18.17.0" } in your `package.json` that will automatically upgrade when a new major Node.js Version is released. Learn More: http://vercel.link/node-version
12:27:49.926 Installing dependencies...
12:27:55.893 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
12:27:56.630 npm warn deprecated npmlog@6.0.2: This package is no longer supported.
12:27:57.309 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
12:27:58.509 npm warn deprecated crypto@1.0.1: This package is no longer supported. It's now a built-in Node module. If you've depended on crypto, you should switch to the one that's built-in.
12:27:58.535 npm warn deprecated domexception@4.0.0: Use your platform's native DOMException instead
12:27:58.880 npm warn deprecated gauge@4.0.4: This package is no longer supported.
12:27:59.146 npm warn deprecated abab@2.0.6: Use your platform's native atob() and btoa() methods instead
12:27:59.167 npm warn deprecated are-we-there-yet@3.0.1: This package is no longer supported.
12:27:59.279 npm warn deprecated critters@0.0.25: Ownership of Critters has moved to the Nuxt team, who will be maintaining the project going forward. If you'd like to keep using Critters, please switch to the actively-maintained fork at https://github.com/danielroe/beasties
12:27:59.396 npm warn deprecated @types/bcryptjs@3.0.0: This is a stub types definition. bcryptjs provides its own type definitions, so you do not need this installed.
12:28:00.943 npm warn deprecated @npmcli/move-file@1.1.2: This functionality has been moved to @npmcli/fs
12:28:01.410 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
12:28:01.714 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
12:28:02.391 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
12:28:02.519 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
12:28:02.652 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
12:28:02.854 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
12:28:02.883 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
12:28:03.226 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
12:28:03.304 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
12:28:03.911 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
12:28:04.035 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
12:28:04.344 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
12:28:10.864 npm warn deprecated @opentelemetry/otlp-proto-exporter-base@0.41.2: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
12:28:14.060 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
12:28:51.375 
12:28:51.375 > caregiver-platform@0.1.0 prepare
12:28:51.375 > husky install
12:28:51.375 
12:28:51.417 husky - Git hooks installed
12:28:51.462 
12:28:51.462 added 1803 packages in 1m
12:28:51.462 
12:28:51.462 292 packages are looking for funding
12:28:51.462   run `npm fund` for details
12:28:51.515 Detected Next.js version: 14.0.4
12:28:51.529 Running "npm run build"
12:28:51.629 
12:28:51.629 > caregiver-platform@0.1.0 build
12:28:51.629 > next build
12:28:51.629 
12:28:52.118 Attention: Next.js now collects completely anonymous telemetry regarding usage.
12:28:52.119 This information is used to shape Next.js' roadmap and prioritize features.
12:28:52.122 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
12:28:52.122 https://nextjs.org/telemetry
12:28:52.122 
12:28:52.198    ▲ Next.js 14.0.4
12:28:52.198    - Experiments (use at your own risk):
12:28:52.198      · optimizeCss
12:28:52.199      · scrollRestoration
12:28:52.199 
12:28:52.199    Creating an optimized production build ...
12:29:25.066  ✓ Compiled successfully
12:29:25.067    Linting and checking validity of types ...
12:29:50.043 
12:29:50.044 Failed to compile.
12:29:50.047 
12:29:50.048 ./src/app/admin/analytics/page.tsx
12:29:50.048 6:10  Warning: 'TrendingUp' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.049 6:10  Error: 'TrendingUp' is defined but never used.  no-unused-vars
12:29:50.051 11:9  Warning: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.051 11:9  Error: 'router' is assigned a value but never used.  no-unused-vars
12:29:50.051 50:61  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.051 
12:29:50.051 ./src/app/admin/audit-logs/page.tsx
12:29:50.052 6:28  Warning: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.052 6:28  Error: 'Filter' is defined but never used.  no-unused-vars
12:29:50.052 12:9  Warning: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.052 12:9  Error: 'router' is assigned a value but never used.  no-unused-vars
12:29:50.052 65:71  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.053 
12:29:50.054 ./src/app/admin/billing/page.tsx
12:29:50.054 11:9  Warning: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.054 11:9  Error: 'router' is assigned a value but never used.  no-unused-vars
12:29:50.055 47:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.055 
12:29:50.057 ./src/app/admin/cv-pool/page.tsx
12:29:50.057 12:9  Warning: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.057 12:9  Error: 'router' is assigned a value but never used.  no-unused-vars
12:29:50.057 
12:29:50.057 ./src/app/admin/dashboard/page.tsx
12:29:50.058 6:25  Warning: 'Building2' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.058 6:25  Error: 'Building2' is defined but never used.  no-unused-vars
12:29:50.058 7:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.058 7:10  Error: 'Button' is defined but never used.  no-unused-vars
12:29:50.058 
12:29:50.059 ./src/app/admin/disputes/page.tsx
12:29:50.059 6:18  Warning: 'AlertTriangle' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.059 6:18  Error: 'AlertTriangle' is defined but never used.  no-unused-vars
12:29:50.059 6:33  Warning: 'Clock' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.059 6:33  Error: 'Clock' is defined but never used.  no-unused-vars
12:29:50.060 31:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.060 
12:29:50.063 ./src/app/admin/locked-accounts/[id]/unlock/page.tsx
12:29:50.063 28:5  Warning: Unexpected console statement.  no-console
12:29:50.063 
12:29:50.063 ./src/app/admin/locked-accounts/page.tsx
12:29:50.064 12:9  Warning: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.064 12:9  Error: 'router' is assigned a value but never used.  no-unused-vars
12:29:50.064 
12:29:50.064 ./src/app/admin/messages/page.tsx
12:29:50.065 11:9  Warning: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.065 11:9  Error: 'router' is assigned a value but never used.  no-unused-vars
12:29:50.065 
12:29:50.065 ./src/app/admin/moderators/[id]/page.tsx
12:29:50.070 6:30  Warning: 'Edit' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.071 6:30  Error: 'Edit' is defined but never used.  no-unused-vars
12:29:50.071 
12:29:50.071 ./src/app/admin/moderators/page.tsx
12:29:50.071 46:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.071 
12:29:50.072 ./src/app/admin/submissions/[id]/decision/page.tsx
12:29:50.072 29:5  Warning: Unexpected console statement.  no-console
12:29:50.072 78:53  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:29:50.072 136:51  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:29:50.072 
12:29:50.072 ./src/app/admin/submissions/page.tsx
12:29:50.073 31:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.073 
12:29:50.074 ./src/app/admin/system-settings/page.tsx
12:29:50.074 6:10  Warning: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.074 6:10  Error: 'Settings' is defined but never used.  no-unused-vars
12:29:50.074 
12:29:50.077 ./src/app/admin/tickets/page.tsx
12:29:50.077 12:9  Warning: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.077 12:9  Error: 'router' is assigned a value but never used.  no-unused-vars
12:29:50.078 48:61  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.078 
12:29:50.080 ./src/app/agency/caregivers/[id]/page.tsx
12:29:50.080 6:33  Warning: 'Briefcase' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.080 6:33  Error: 'Briefcase' is defined but never used.  no-unused-vars
12:29:50.081 
12:29:50.081 ./src/app/agency/dashboard/page.tsx
12:29:50.083 6:52  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.083 6:52  Error: 'Package' is defined but never used.  no-unused-vars
12:29:50.084 6:61  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.084 6:61  Error: 'Calendar' is defined but never used.  no-unused-vars
12:29:50.084 6:71  Warning: 'TrendingUp' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.084 6:71  Error: 'TrendingUp' is defined but never used.  no-unused-vars
12:29:50.084 7:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.084 7:10  Error: 'Button' is defined but never used.  no-unused-vars
12:29:50.085 
12:29:50.085 ./src/app/agency/inquiries/[id]/page.tsx
12:29:50.086 6:21  Warning: 'MessageSquare' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.086 6:21  Error: 'MessageSquare' is defined but never used.  no-unused-vars
12:29:50.086 
12:29:50.086 ./src/app/agency/jobs/[id]/page.tsx
12:29:50.087 6:32  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.087 6:32  Error: 'User' is defined but never used.  no-unused-vars
12:29:50.087 6:38  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.096 6:38  Error: 'Calendar' is defined but never used.  no-unused-vars
12:29:50.097 6:48  Warning: 'MessageSquare' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.097 6:48  Error: 'MessageSquare' is defined but never used.  no-unused-vars
12:29:50.097 
12:29:50.097 ./src/app/agency/messages/[id]/page.tsx
12:29:50.098 6:52  Warning: 'ImageIcon' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.098 6:52  Error: 'ImageIcon' is defined but never used.  no-unused-vars
12:29:50.098 14:9  Warning: 'id' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.098 14:9  Error: 'id' is assigned a value but never used.  no-unused-vars
12:29:50.098 
12:29:50.098 ./src/app/agency/messages/page.tsx
12:29:50.099 8:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.099 8:10  Error: 'Button' is defined but never used.  no-unused-vars
12:29:50.099 
12:29:50.099 ./src/app/agency/packages/[id]/edit/page.tsx
12:29:50.099 6:27  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.100 6:27  Error: 'Package' is defined but never used.  no-unused-vars
12:29:50.100 
12:29:50.100 ./src/app/agency/registration/step-5/page.tsx
12:29:50.100 40:94  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.100 
12:29:50.101 ./src/app/agency-manager/feedback/[id]/respond/page.tsx
12:29:50.101 6:27  Warning: 'MessageSquare' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.101 6:27  Error: 'MessageSquare' is defined but never used.  no-unused-vars
12:29:50.101 
12:29:50.101 ./src/app/agency-manager/login/page.tsx
12:29:50.101 14:30  Warning: 'credentials' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.102 14:30  Error: 'credentials' is defined but never used.  no-unused-vars
12:29:50.102 
12:29:50.102 ./src/app/api/admin/audit/route.ts
12:29:50.102 11:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.102 26:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.102 
12:29:50.103 ./src/app/api/admin/moderation/content/route.ts
12:29:50.103 17:70  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.103 23:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.103 
12:29:50.103 ./src/app/api/admin/users/role/route.ts
12:29:50.104 18:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.109 
12:29:50.109 ./src/app/api/ai-agent/chat/route.ts
12:29:50.109 34:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.109 35:9  Warning: Unexpected console statement.  no-console
12:29:50.110 
12:29:50.110 ./src/app/api/ai-agent/routes/route.ts
12:29:50.110 26:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.110 27:9  Warning: Unexpected console statement.  no-console
12:29:50.110 
12:29:50.110 ./src/app/api/analytics/chat/route.ts
12:29:50.111 8:6  Error: 'UserRole' is already defined.  no-redeclare
12:29:50.111 45:11  Warning: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.111 45:11  Error: 'user' is assigned a value but never used.  no-unused-vars
12:29:50.111 45:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.111 70:5  Warning: Unexpected console statement.  no-console
12:29:50.111 106:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.112 123:5  Warning: Unexpected console statement.  no-console
12:29:50.112 180:5  Warning: Unexpected console statement.  no-console
12:29:50.112 218:5  Warning: Unexpected console statement.  no-console
12:29:50.112 
12:29:50.112 ./src/app/api/analytics/route.ts
12:29:50.112 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.113 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
12:29:50.113 41:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.113 46:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.113 135:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.113 185:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.114 249:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.114 249:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.114 250:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.114 256:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.114 256:51  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.115 257:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.115 263:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.115 263:64  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.115 265:39  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.115 268:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.115 268:60  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.116 270:38  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.116 286:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.116 346:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.116 396:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.116 397:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.117 425:5  Warning: Unexpected console statement.  no-console
12:29:50.117 
12:29:50.117 ./src/app/api/analytics/vitals/route.ts
12:29:50.117 18:7  Warning: Unexpected console statement.  no-console
12:29:50.117 47:5  Warning: Unexpected console statement.  no-console
12:29:50.117 
12:29:50.118 ./src/app/api/auth/login/route.ts
12:29:50.127 7:57  Warning: 'verifySessionMFA' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.127 7:57  Error: 'verifySessionMFA' is defined but never used.  no-unused-vars
12:29:50.127 190:28  Warning: '_' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.128 190:28  Error: '_' is assigned a value but never used.  no-unused-vars
12:29:50.128 190:43  Warning: '__' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.128 190:43  Error: '__' is assigned a value but never used.  no-unused-vars
12:29:50.128 212:5  Warning: Unexpected console statement.  no-console
12:29:50.128 292:5  Warning: Unexpected console statement.  no-console
12:29:50.129 331:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.129 337:13  Error: 'deleteUserSessions' is not defined.  no-undef
12:29:50.129 341:18  Warning: 'session' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.129 341:18  Error: 'session' is assigned a value but never used.  no-unused-vars
12:29:50.129 401:5  Warning: Unexpected console statement.  no-console
12:29:50.129 491:5  Warning: Unexpected console statement.  no-console
12:29:50.130 
12:29:50.130 ./src/app/api/auth/me/route.ts
12:29:50.130 115:5  Warning: Unexpected console statement.  no-console
12:29:50.130 165:5  Warning: Unexpected console statement.  no-console
12:29:50.130 
12:29:50.131 ./src/app/api/auth/register/route.ts
12:29:50.131 265:7  Warning: Unexpected console statement.  no-console
12:29:50.131 298:5  Warning: Unexpected console statement.  no-console
12:29:50.131 
12:29:50.131 ./src/app/api/auth/reset-password/route.ts
12:29:50.131 3:24  Warning: 'verifyPassword' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.132 3:24  Error: 'verifyPassword' is defined but never used.  no-unused-vars
12:29:50.132 4:26  Warning: 'updateUserLastLogin' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.132 4:26  Error: 'updateUserLastLogin' is defined but never used.  no-unused-vars
12:29:50.132 184:7  Warning: Unexpected console statement.  no-console
12:29:50.132 187:7  Warning: Unexpected console statement.  no-console
12:29:50.133 199:63  Error: 'resetUrl' is not defined.  no-undef
12:29:50.133 204:5  Warning: Unexpected console statement.  no-console
12:29:50.133 297:5  Warning: Unexpected console statement.  no-console
12:29:50.133 408:5  Warning: Unexpected console statement.  no-console
12:29:50.133 487:11  Warning: 'timeSinceRequest' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.133 487:11  Error: 'timeSinceRequest' is assigned a value but never used.  no-unused-vars
12:29:50.134 504:5  Warning: Unexpected console statement.  no-console
12:29:50.134 549:5  Warning: Unexpected console statement.  no-console
12:29:50.134 
12:29:50.134 ./src/app/api/auth/send-otp/route.ts
12:29:50.134 52:7  Warning: Unexpected console statement.  no-console
12:29:50.134 61:5  Warning: Unexpected console statement.  no-console
12:29:50.135 
12:29:50.135 ./src/app/api/auth/setup-mfa/route.ts
12:29:50.135 81:55  Warning: '_' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.135 81:55  Error: '_' is defined but never used.  no-unused-vars
12:29:50.135 81:58  Warning: 'i' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.136 81:58  Error: 'i' is defined but never used.  no-unused-vars
12:29:50.136 117:5  Warning: Unexpected console statement.  no-console
12:29:50.136 158:5  Warning: Unexpected console statement.  no-console
12:29:50.137 
12:29:50.137 ./src/app/api/auth/verify-email/route.ts
12:29:50.138 5:8  Warning: 'crypto' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.138 5:8  Error: 'crypto' is defined but never used.  no-unused-vars
12:29:50.138 64:19  Error: 'generateEmailVerificationToken' is not defined.  no-undef
12:29:50.138 83:5  Warning: Unexpected console statement.  no-console
12:29:50.138 96:5  Warning: Unexpected console statement.  no-console
12:29:50.139 208:9  Warning: 'updateData' is never reassigned. Use 'const' instead.  prefer-const
12:29:50.139 208:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.139 236:5  Warning: Unexpected console statement.  no-console
12:29:50.139 257:11  Warning: 'token' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.139 257:11  Error: 'token' is assigned a value but never used.  no-unused-vars
12:29:50.139 298:5  Warning: Unexpected console statement.  no-console
12:29:50.140 329:5  Warning: Unexpected console statement.  no-console
12:29:50.140 
12:29:50.140 ./src/app/api/auth/verify-otp/route.ts
12:29:50.140 14:13  Warning: 'phone' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.140 14:13  Error: 'phone' is assigned a value but never used.  no-unused-vars
12:29:50.141 75:5  Warning: Unexpected console statement.  no-console
12:29:50.141 
12:29:50.141 ./src/app/api/care-logs/route.ts
12:29:50.141 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.141 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
12:29:50.141 18:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.142 33:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.142 38:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.142 42:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.142 42:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.142 64:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.143 161:5  Warning: Unexpected console statement.  no-console
12:29:50.143 179:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.143 290:5  Warning: Unexpected console statement.  no-console
12:29:50.143 
12:29:50.143 ./src/app/api/caregivers/route.ts
12:29:50.144 12:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.144 26:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.144 114:5  Warning: Unexpected console statement.  no-console
12:29:50.144 128:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.144 238:5  Warning: Unexpected console statement.  no-console
12:29:50.144 
12:29:50.145 ./src/app/api/cdn/upload/route.ts
12:29:50.145 16:11  Warning: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.145 16:11  Error: 'user' is assigned a value but never used.  no-unused-vars
12:29:50.145 16:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.146 74:5  Warning: Unexpected console statement.  no-console
12:29:50.146 119:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.146 126:5  Warning: Unexpected console statement.  no-console
12:29:50.146 168:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.146 175:5  Warning: Unexpected console statement.  no-console
12:29:50.146 
12:29:50.147 ./src/app/api/companies/route.ts
12:29:50.153 4:29  Warning: 'authorizeOwnResource' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.154 4:29  Error: 'authorizeOwnResource' is defined but never used.  no-unused-vars
12:29:50.154 32:7  Warning: 'packageSchema' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.154 32:7  Error: 'packageSchema' is assigned a value but never used.  no-unused-vars
12:29:50.154 46:7  Warning: 'serviceZoneSchema' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.155 46:7  Error: 'serviceZoneSchema' is assigned a value but never used.  no-unused-vars
12:29:50.155 65:70  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.155 75:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.155 113:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.155 199:5  Warning: Unexpected console statement.  no-console
12:29:50.155 283:5  Warning: Unexpected console statement.  no-console
12:29:50.156 390:5  Warning: Unexpected console statement.  no-console
12:29:50.156 430:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.156 451:5  Warning: Unexpected console statement.  no-console
12:29:50.156 
12:29:50.156 ./src/app/api/dashboard/stats/route.ts
12:29:50.156 2:24  Warning: 'authorize' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.157 2:24  Error: 'authorize' is defined but never used.  no-unused-vars
12:29:50.157 12:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.157 15:16  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.157 20:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.157 58:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.157 101:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.157 162:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.158 205:5  Warning: Unexpected console statement.  no-console
12:29:50.158 215:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.158 220:7  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.158 256:38  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.158 264:36  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.158 272:44  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.159 283:7  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.159 332:7  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.159 361:50  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.159 369:40  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.159 380:7  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.159 408:38  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.160 416:46  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.160 
12:29:50.160 ./src/app/api/disputes/[id]/route.ts
12:29:50.160 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.160 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
12:29:50.160 32:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.160 37:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.161 51:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.161 130:5  Warning: Unexpected console statement.  no-console
12:29:50.161 150:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.161 377:5  Warning: Unexpected console statement.  no-console
12:29:50.161 
12:29:50.161 ./src/app/api/disputes/route.ts
12:29:50.161 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.162 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
12:29:50.162 18:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.162 31:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.162 45:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.162 141:5  Warning: Unexpected console statement.  no-console
12:29:50.162 160:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.162 215:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.163 310:5  Warning: Unexpected console statement.  no-console
12:29:50.163 
12:29:50.163 ./src/app/api/docs/route.ts
12:29:50.163 1:23  Warning: 'NextResponse' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.163 1:23  Error: 'NextResponse' is defined but never used.  no-unused-vars
12:29:50.163 
12:29:50.163 ./src/app/api/escrow/route.ts
12:29:50.164 40:7  Warning: 'getEscrowSchema' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.164 40:7  Error: 'getEscrowSchema' is assigned a value but never used.  no-unused-vars
12:29:50.164 44:7  Warning: 'getUserEscrowSchema' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.164 44:7  Error: 'getUserEscrowSchema' is assigned a value but never used.  no-unused-vars
12:29:50.164 54:27  Error: 'getServerSession' is not defined.  no-undef
12:29:50.164 54:44  Error: 'authOptions' is not defined.  no-undef
12:29:50.164 106:5  Warning: Unexpected console statement.  no-console
12:29:50.165 120:27  Error: 'getServerSession' is not defined.  no-undef
12:29:50.165 120:44  Error: 'authOptions' is not defined.  no-undef
12:29:50.165 148:5  Warning: Unexpected console statement.  no-console
12:29:50.165 159:41  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.165 159:55  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.165 187:5  Warning: Unexpected console statement.  no-console
12:29:50.166 198:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.166 198:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.166 231:5  Warning: Unexpected console statement.  no-console
12:29:50.166 242:41  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.166 242:55  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.166 275:5  Warning: Unexpected console statement.  no-console
12:29:50.166 286:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.167 286:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.167 320:5  Warning: Unexpected console statement.  no-console
12:29:50.167 331:80  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.167 363:78  Warning: 'escrowData' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.167 363:78  Error: 'escrowData' is defined but never used.  no-unused-vars
12:29:50.168 363:90  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.168 401:78  Warning: 'escrowId' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.168 401:78  Error: 'escrowId' is defined but never used.  no-unused-vars
12:29:50.168 
12:29:50.168 ./src/app/api/fcm/register/route.ts
12:29:50.168 21:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.169 56:5  Warning: Unexpected console statement.  no-console
12:29:50.169 80:11  Warning: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.169 80:11  Error: 'user' is assigned a value but never used.  no-unused-vars
12:29:50.169 80:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.169 108:5  Warning: Unexpected console statement.  no-console
12:29:50.169 
12:29:50.170 ./src/app/api/fcm/send/route.ts
12:29:50.170 46:11  Warning: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.170 46:11  Error: 'user' is assigned a value but never used.  no-unused-vars
12:29:50.170 46:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.170 130:5  Warning: Unexpected console statement.  no-console
12:29:50.171 
12:29:50.171 ./src/app/api/fcm/subscribe/route.ts
12:29:50.172 2:24  Warning: 'authorize' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.172 2:24  Error: 'authorize' is defined but never used.  no-unused-vars
12:29:50.172 7:6  Warning: 'UserRole' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.172 7:6  Error: 'UserRole' is defined but never used.  no-unused-vars
12:29:50.173 29:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.173 53:5  Warning: Unexpected console statement.  no-console
12:29:50.173 78:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.174 109:5  Warning: Unexpected console statement.  no-console
12:29:50.174 
12:29:50.174 ./src/app/api/feedback/[id]/respond/route.ts
12:29:50.174 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.175 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
12:29:50.175 15:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.175 118:5  Warning: Unexpected console statement.  no-console
12:29:50.175 
12:29:50.175 ./src/app/api/feedback/[id]/route.ts
12:29:50.176 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.176 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
12:29:50.176 21:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.179 26:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.179 40:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.179 111:5  Warning: Unexpected console statement.  no-console
12:29:50.179 195:5  Warning: Unexpected console statement.  no-console
12:29:50.179 
12:29:50.180 ./src/app/api/feedback/route.ts
12:29:50.181 18:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.181 32:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.183 46:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.183 125:5  Warning: Unexpected console statement.  no-console
12:29:50.183 139:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.183 196:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.184 267:61  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.184 295:5  Warning: Unexpected console statement.  no-console
12:29:50.184 
12:29:50.184 ./src/app/api/health-records/route.ts
12:29:50.184 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.184 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
12:29:50.185 17:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.185 30:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.185 35:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.185 39:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.185 39:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.186 56:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.186 122:5  Warning: Unexpected console statement.  no-console
12:29:50.191 141:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.192 233:5  Warning: Unexpected console statement.  no-console
12:29:50.192 252:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.192 350:5  Warning: Unexpected console statement.  no-console
12:29:50.192 
12:29:50.192 ./src/app/api/jobs/route.ts
12:29:50.193 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.193 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
12:29:50.193 18:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.193 30:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.193 49:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.193 158:5  Warning: Unexpected console statement.  no-console
12:29:50.194 176:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.194 304:5  Warning: Unexpected console statement.  no-console
12:29:50.194 
12:29:50.194 ./src/app/api/marketplace-jobs/route.ts
12:29:50.194 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.195 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
12:29:50.195 17:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.195 31:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.195 147:5  Warning: Unexpected console statement.  no-console
12:29:50.195 165:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.195 251:5  Warning: Unexpected console statement.  no-console
12:29:50.195 269:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.196 389:5  Warning: Unexpected console statement.  no-console
12:29:50.196 
12:29:50.196 ./src/app/api/moderation/route.ts
12:29:50.196 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.196 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
12:29:50.196 35:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.196 75:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.196 120:70  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.197 173:70  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.197 199:5  Warning: Unexpected console statement.  no-console
12:29:50.197 216:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.197 251:5  Warning: Unexpected console statement.  no-console
12:29:50.197 268:33  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.198 307:35  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.198 339:33  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.198 371:35  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.198 
12:29:50.198 ./src/app/api/notifications/[id]/route.ts
12:29:50.199 44:5  Warning: Unexpected console statement.  no-console
12:29:50.199 104:5  Warning: Unexpected console statement.  no-console
12:29:50.199 157:5  Warning: Unexpected console statement.  no-console
12:29:50.199 
12:29:50.199 ./src/app/api/notifications/route.ts
12:29:50.200 26:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.200 82:5  Warning: Unexpected console statement.  no-console
12:29:50.200 143:5  Warning: Unexpected console statement.  no-console
12:29:50.200 
12:29:50.201 ./src/app/api/notifications/send/route.ts
12:29:50.201 4:8  Warning: 'notificationService' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.201 4:8  Error: 'notificationService' is defined but never used.  no-unused-vars
12:29:50.201 38:37  Error: 'NotificationService' is not defined.  no-undef
12:29:50.201 59:5  Warning: Unexpected console statement.  no-console
12:29:50.202 
12:29:50.202 ./src/app/api/notifications/settings/route.ts
12:29:50.202 15:9  Warning: 'currentUser' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.202 15:9  Error: 'currentUser' is assigned a value but never used.  no-unused-vars
12:29:50.202 39:5  Warning: Unexpected console statement.  no-console
12:29:50.202 57:9  Warning: 'currentUser' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.203 57:9  Error: 'currentUser' is assigned a value but never used.  no-unused-vars
12:29:50.203 75:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.203 78:16  Error: Do not access Object.prototype method 'hasOwnProperty' from target object.  no-prototype-builtins
12:29:50.203 93:5  Warning: Unexpected console statement.  no-console
12:29:50.204 
12:29:50.204 ./src/app/api/packages/route.ts
12:29:50.204 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.204 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
12:29:50.204 17:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.204 30:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.205 99:5  Warning: Unexpected console statement.  no-console
12:29:50.205 117:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.205 199:5  Warning: Unexpected console statement.  no-console
12:29:50.205 
12:29:50.205 ./src/app/api/patients/[id]/route.ts
12:29:50.205 11:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.206 22:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.206 32:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.206 
12:29:50.206 ./src/app/api/patients/route.ts
12:29:50.206 31:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.207 31:10  Error: 'authenticate' is defined but never used.  no-unused-vars
12:29:50.207 41:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.207 52:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.207 117:5  Warning: Unexpected console statement.  no-console
12:29:50.207 
12:29:50.208 ./src/app/api/payments/[id]/route.ts
12:29:50.208 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.208 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
12:29:50.208 23:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.208 28:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.209 38:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.209 103:5  Warning: Unexpected console statement.  no-console
12:29:50.209 219:5  Warning: Unexpected console statement.  no-console
12:29:50.209 
12:29:50.209 ./src/app/api/payments/bkash/callback/route.ts
12:29:50.210 16:43  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.210 29:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.210 
12:29:50.210 ./src/app/api/payments/bkash/checkout/route.ts
12:29:50.210 4:10  Warning: 'extractTokenFromHeader' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.211 4:10  Error: 'extractTokenFromHeader' is defined but never used.  no-unused-vars
12:29:50.211 4:34  Warning: 'verifyAccessToken' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.211 4:34  Error: 'verifyAccessToken' is defined but never used.  no-unused-vars
12:29:50.211 24:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.211 24:52  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.212 25:33  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.212 34:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.212 
12:29:50.212 ./src/app/api/payments/bkash/create/route.ts
12:29:50.213 105:5  Warning: Unexpected console statement.  no-console
12:29:50.213 129:11  Warning: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.213 129:11  Error: 'user' is assigned a value but never used.  no-unused-vars
12:29:50.213 189:5  Warning: Unexpected console statement.  no-console
12:29:50.213 
12:29:50.213 ./src/app/api/payments/bkash/route.ts
12:29:50.214 91:5  Warning: Unexpected console statement.  no-console
12:29:50.214 122:7  Warning: Unexpected console statement.  no-console
12:29:50.214 133:7  Warning: Unexpected console statement.  no-console
12:29:50.214 
12:29:50.214 ./src/app/api/payments/create/route.ts
12:29:50.215 77:47  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.215 98:47  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.215 112:5  Warning: Unexpected console statement.  no-console
12:29:50.215 
12:29:50.215 ./src/app/api/payments/nagad/callback/route.ts
12:29:50.215 34:7  Warning: Unexpected console statement.  no-console
12:29:50.216 63:7  Warning: Unexpected console statement.  no-console
12:29:50.216 71:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.216 73:41  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.216 100:5  Warning: Unexpected console statement.  no-console
12:29:50.216 
12:29:50.216 ./src/app/api/payments/nagad/create/route.ts
12:29:50.217 106:5  Warning: Unexpected console statement.  no-console
12:29:50.217 187:5  Warning: Unexpected console statement.  no-console
12:29:50.217 
12:29:50.217 ./src/app/api/payments/nagad/route.ts
12:29:50.217 72:5  Warning: Unexpected console statement.  no-console
12:29:50.218 83:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.218 111:5  Warning: Unexpected console statement.  no-console
12:29:50.218 122:43  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.218 140:5  Warning: Unexpected console statement.  no-console
12:29:50.218 151:40  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.218 169:5  Warning: Unexpected console statement.  no-console
12:29:50.219 180:35  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.219 202:5  Warning: Unexpected console statement.  no-console
12:29:50.219 222:5  Warning: Unexpected console statement.  no-console
12:29:50.219 
12:29:50.220 ./src/app/api/payments/refund/route.ts
12:29:50.220 4:10  Warning: 'extractTokenFromHeader' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.220 4:10  Error: 'extractTokenFromHeader' is defined but never used.  no-unused-vars
12:29:50.220 4:34  Warning: 'verifyAccessToken' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.220 4:34  Error: 'verifyAccessToken' is defined but never used.  no-unused-vars
12:29:50.221 4:53  Warning: 'hasPermission' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.221 4:53  Error: 'hasPermission' is defined but never used.  no-unused-vars
12:29:50.221 18:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.221 18:52  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.221 19:33  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.222 22:32  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.223 30:33  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.223 36:17  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.223 
12:29:50.223 ./src/app/api/payments/route.ts
12:29:50.223 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.223 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
12:29:50.224 20:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.224 33:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.224 43:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.224 131:5  Warning: Unexpected console statement.  no-console
12:29:50.224 151:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.224 266:5  Warning: Unexpected console statement.  no-console
12:29:50.225 
12:29:50.225 ./src/app/api/refunds/route.ts
12:29:50.225 31:7  Warning: 'getRefundSchema' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.225 31:7  Error: 'getRefundSchema' is assigned a value but never used.  no-unused-vars
12:29:50.225 35:7  Warning: 'getStatisticsSchema' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.225 35:7  Error: 'getStatisticsSchema' is assigned a value but never used.  no-unused-vars
12:29:50.225 46:27  Error: 'getServerSession' is not defined.  no-undef
12:29:50.226 46:44  Error: 'authOptions' is not defined.  no-undef
12:29:50.226 114:5  Warning: Unexpected console statement.  no-console
12:29:50.226 128:27  Error: 'getServerSession' is not defined.  no-undef
12:29:50.226 128:44  Error: 'authOptions' is not defined.  no-undef
12:29:50.226 156:5  Warning: Unexpected console statement.  no-console
12:29:50.226 167:41  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.227 167:55  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.227 203:5  Warning: Unexpected console statement.  no-console
12:29:50.227 214:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.227 214:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.227 245:5  Warning: Unexpected console statement.  no-console
12:29:50.227 256:41  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.228 256:55  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.228 288:5  Warning: Unexpected console statement.  no-console
12:29:50.228 299:45  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.228 299:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.228 327:5  Warning: Unexpected console statement.  no-console
12:29:50.228 338:80  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.229 
12:29:50.229 ./src/app/api/sessions/route.ts
12:29:50.229 48:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.229 56:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.229 59:9  Error: Unexpected lexical declaration in case block.  no-case-declarations
12:29:50.230 76:5  Warning: Unexpected console statement.  no-console
12:29:50.230 137:5  Warning: Unexpected console statement.  no-console
12:29:50.230 194:5  Warning: Unexpected console statement.  no-console
12:29:50.230 
12:29:50.230 ./src/app/api/sync/route.ts
12:29:50.231 20:11  Warning: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.231 20:11  Error: 'user' is assigned a value but never used.  no-unused-vars
12:29:50.231 20:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.231 43:5  Warning: Unexpected console statement.  no-console
12:29:50.232 91:5  Warning: Unexpected console statement.  no-console
12:29:50.232 130:5  Warning: Unexpected console statement.  no-console
12:29:50.232 
12:29:50.233 ./src/app/api/upload/route.ts
12:29:50.234 88:5  Warning: Unexpected console statement.  no-console
12:29:50.235 116:5  Warning: Unexpected console statement.  no-console
12:29:50.235 131:9  Warning: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.235 131:9  Error: 'user' is assigned a value but never used.  no-unused-vars
12:29:50.236 152:5  Warning: Unexpected console statement.  no-console
12:29:50.236 
12:29:50.236 ./src/app/api/users/[id]/route.ts
12:29:50.236 16:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.236 91:5  Warning: Unexpected console statement.  no-console
12:29:50.236 109:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.236 127:7  Warning: 'isVerified' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.237 127:7  Error: 'isVerified' is assigned a value but never used.  no-unused-vars
12:29:50.237 131:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.237 168:5  Warning: Unexpected console statement.  no-console
12:29:50.237 211:5  Warning: Unexpected console statement.  no-console
12:29:50.237 
12:29:50.237 ./src/app/api/users/route.ts
12:29:50.238 4:10  Warning: 'authorizeResource' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.238 4:10  Error: 'authorizeResource' is defined but never used.  no-unused-vars
12:29:50.238 4:29  Warning: 'authorizeOwnResource' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.238 4:29  Error: 'authorizeOwnResource' is defined but never used.  no-unused-vars
12:29:50.238 5:10  Warning: 'hashPassword' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.238 5:10  Error: 'hashPassword' is defined but never used.  no-unused-vars
12:29:50.239 5:24  Warning: 'verifyPassword' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.239 5:24  Error: 'verifyPassword' is defined but never used.  no-unused-vars
12:29:50.239 9:10  Warning: 'kv' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.239 9:10  Error: 'kv' is defined but never used.  no-unused-vars
12:29:50.239 24:7  Warning: 'deactivateUserSchema' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.240 24:7  Error: 'deactivateUserSchema' is assigned a value but never used.  no-unused-vars
12:29:50.240 57:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.240 90:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.240 191:5  Warning: Unexpected console statement.  no-console
12:29:50.240 318:5  Warning: Unexpected console statement.  no-console
12:29:50.241 378:23  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.241 440:5  Warning: Unexpected console statement.  no-console
12:29:50.241 483:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.241 550:11  Warning: Unexpected console statement.  no-console
12:29:50.241 554:9  Warning: Unexpected console statement.  no-console
12:29:50.247 574:5  Warning: Unexpected console statement.  no-console
12:29:50.247 655:5  Warning: Unexpected console statement.  no-console
12:29:50.247 
12:29:50.247 ./src/app/api/verification/route.ts
12:29:50.247 2:10  Warning: 'authenticate' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.248 2:10  Error: 'authenticate' is defined but never used.  no-unused-vars
12:29:50.248 39:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.248 117:5  Warning: Unexpected console statement.  no-console
12:29:50.248 134:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.249 208:31  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.249 209:31  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.250 229:5  Warning: Unexpected console statement.  no-console
12:29:50.250 
12:29:50.250 ./src/app/auth/login/page.tsx
12:29:50.250 166:16  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:29:50.250 
12:29:50.250 ./src/app/auth/reset-password/step-3/page.tsx
12:29:50.251 63:68  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:29:50.251 
12:29:50.251 ./src/app/auth/role-selection/page.tsx
12:29:50.251 102:27  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:29:50.251 
12:29:50.252 ./src/app/auth/setup-mfa/page.tsx
12:29:50.252 101:74  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:29:50.252 117:16  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:29:50.252 
12:29:50.259 ./src/app/auth/verify-mfa/page.tsx
12:29:50.259 61:5  Warning: Unexpected console statement.  no-console
12:29:50.259 
12:29:50.259 ./src/app/caregiver/availability/page.tsx
12:29:50.260 6:21  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.260 6:21  Error: 'Calendar' is defined but never used.  no-unused-vars
12:29:50.260 
12:29:50.260 ./src/app/caregiver/care-logs/activities/page.tsx
12:29:50.260 6:47  Warning: 'Plus' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.261 6:47  Error: 'Plus' is defined but never used.  no-unused-vars
12:29:50.261 
12:29:50.261 ./src/app/caregiver/care-logs/medications/page.tsx
12:29:50.261 6:27  Warning: 'Plus' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.261 6:27  Error: 'Plus' is defined but never used.  no-unused-vars
12:29:50.262 8:10  Warning: 'Textarea' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.262 8:10  Error: 'Textarea' is defined but never used.  no-unused-vars
12:29:50.262 
12:29:50.262 ./src/app/caregiver/check-in/page.tsx
12:29:50.263 17:10  Warning: 'locationMatch' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.263 17:10  Error: 'locationMatch' is assigned a value but never used.  no-unused-vars
12:29:50.263 19:10  Warning: 'photo' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.263 19:10  Error: 'photo' is assigned a value but never used.  no-unused-vars
12:29:50.263 145:42  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:29:50.264 263:18  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:29:50.264 
12:29:50.264 ./src/app/caregiver/check-out/page.tsx
12:29:50.264 16:10  Warning: 'photo' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.265 16:10  Error: 'photo' is assigned a value but never used.  no-unused-vars
12:29:50.265 
12:29:50.265 ./src/app/caregiver/checkin/confirmation/page.tsx
12:29:50.265 29:77  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:29:50.265 
12:29:50.266 ./src/app/caregiver/checkin/photo/page.tsx
12:29:50.266 22:102  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:29:50.266 
12:29:50.266 ./src/app/caregiver/dashboard/page.tsx
12:29:50.267 7:51  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.267 7:51  Error: 'Calendar' is defined but never used.  no-unused-vars
12:29:50.267 
12:29:50.267 ./src/app/caregiver/earnings/withdraw/page.tsx
12:29:50.267 6:21  Warning: 'DollarSign' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.267 6:21  Error: 'DollarSign' is defined but never used.  no-unused-vars
12:29:50.268 6:39  Warning: 'CreditCard' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.268 6:39  Error: 'CreditCard' is defined but never used.  no-unused-vars
12:29:50.268 
12:29:50.268 ./src/app/caregiver/emergency/page.tsx
12:29:50.268 6:32  Warning: 'MessageSquare' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.269 6:32  Error: 'MessageSquare' is defined but never used.  no-unused-vars
12:29:50.269 6:47  Warning: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.269 6:47  Error: 'FileText' is defined but never used.  no-unused-vars
12:29:50.269 
12:29:50.269 ./src/app/caregiver/jobs/[id]/page.tsx
12:29:50.270 6:32  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.270 6:32  Error: 'User' is defined but never used.  no-unused-vars
12:29:50.270 6:38  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.270 6:38  Error: 'Calendar' is defined but never used.  no-unused-vars
12:29:50.270 6:48  Warning: 'MapPin' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.271 6:48  Error: 'MapPin' is defined but never used.  no-unused-vars
12:29:50.271 
12:29:50.271 ./src/app/caregiver/messages/[id]/page.tsx
12:29:50.272 6:52  Warning: 'ImageIcon' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.272 6:52  Error: 'ImageIcon' is defined but never used.  no-unused-vars
12:29:50.272 14:9  Warning: 'id' is assigned a value but never used.  @typescript-eslint/no-unused-vars
12:29:50.273 14:9  Error: 'id' is assigned a value but never used.  no-unused-vars
12:29:50.273 
12:29:50.273 ./src/app/caregiver/messages/page.tsx
12:29:50.273 73:52  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.273 
12:29:50.273 ./src/app/caregiver/verification/physical/page.tsx
12:29:50.273 6:41  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.274 6:41  Error: 'Calendar' is defined but never used.  no-unused-vars
12:29:50.274 
12:29:50.274 ./src/app/caregiver/verification/psych/page.tsx
12:29:50.274 6:30  Warning: 'XCircle' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.274 6:30  Error: 'XCircle' is defined but never used.  no-unused-vars
12:29:50.274 63:52  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
12:29:50.275 63:58  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
12:29:50.275 
12:29:50.275 ./src/app/guardian/billing/page.tsx
12:29:50.275 6:48  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.275 6:48  Error: 'Calendar' is defined but never used.  no-unused-vars
12:29:50.275 111:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.276 
12:29:50.276 ./src/app/guardian/dashboard/page.tsx
12:29:50.276 7:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.276 7:10  Error: 'Button' is defined but never used.  no-unused-vars
12:29:50.276 
12:29:50.276 ./src/app/guardian/jobs/[id]/page.tsx
12:29:50.276 142:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.277 
12:29:50.277 ./src/app/guardian/jobs/page.tsx
12:29:50.277 7:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.277 7:10  Error: 'Button' is defined but never used.  no-unused-vars
12:29:50.277 89:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.277 
12:29:50.277 ./src/app/guardian/messages/[id]/page.tsx
12:29:50.278 37:5  Warning: Unexpected console statement.  no-console
12:29:50.278 
12:29:50.278 ./src/app/guardian/negotiation/waiting/page.tsx
12:29:50.278 84:68  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:29:50.278 
12:29:50.278 ./src/app/guardian/packages/[id]/page.tsx
12:29:50.279 116:65  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:29:50.279 
12:29:50.279 ./src/app/guardian/packages/filters/page.tsx
12:29:50.279 7:10  Warning: 'X' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.279 7:10  Error: 'X' is defined but never used.  no-unused-vars
12:29:50.279 31:5  Warning: Unexpected console statement.  no-console
12:29:50.280 
12:29:50.280 ./src/app/guardian/patients/[id]/edit/page.tsx
12:29:50.280 6:33  Warning: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.280 6:33  Error: 'Phone' is defined but never used.  no-unused-vars
12:29:50.280 6:40  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.281 6:40  Error: 'Calendar' is defined but never used.  no-unused-vars
12:29:50.281 6:50  Warning: 'MapPin' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.281 6:50  Error: 'MapPin' is defined but never used.  no-unused-vars
12:29:50.281 
12:29:50.281 ./src/app/guardian/patients/[id]/health-records/page.tsx
12:29:50.282 6:21  Warning: 'Upload' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.282 6:21  Error: 'Upload' is defined but never used.  no-unused-vars
12:29:50.282 78:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.282 
12:29:50.283 ./src/app/guardian/patients/[id]/page.tsx
12:29:50.283 6:52  Warning: 'Activity' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.283 6:52  Error: 'Activity' is defined but never used.  no-unused-vars
12:29:50.283 6:83  Warning: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.284 6:83  Error: 'Phone' is defined but never used.  no-unused-vars
12:29:50.284 115:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.284 
12:29:50.284 ./src/app/guardian/patients/new/page.tsx
12:29:50.284 61:5  Warning: Unexpected console statement.  no-console
12:29:50.284 
12:29:50.285 ./src/app/guardian/settings/page.tsx
12:29:50.285 56:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:29:50.285 
12:29:50.285 ./src/app/moderator/dashboard/page.tsx
12:29:50.285 6:62  Warning: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.286 6:62  Error: 'FileText' is defined but never used.  no-unused-vars
12:29:50.286 
12:29:50.286 ./src/app/moderator/disputes/[id]/page.tsx
12:29:50.286 6:21  Warning: 'Shield' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.286 6:21  Error: 'Shield' is defined but never used.  no-unused-vars
12:29:50.287 
12:29:50.287 ./src/app/moderator/packages/agency/page.tsx
12:29:50.287 6:21  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.287 6:21  Error: 'Package' is defined but never used.  no-unused-vars
12:29:50.287 6:30  Warning: 'Plus' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.287 6:30  Error: 'Plus' is defined but never used.  no-unused-vars
12:29:50.288 
12:29:50.288 ./src/app/moderator/packages/caregiver/page.tsx
12:29:50.288 6:21  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.288 6:21  Error: 'Package' is defined but never used.  no-unused-vars
12:29:50.288 6:30  Warning: 'Plus' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.290 6:30  Error: 'Plus' is defined but never used.  no-unused-vars
12:29:50.290 
12:29:50.290 ./src/app/moderator/subscription/agency/page.tsx
12:29:50.290 5:21  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.290 5:21  Error: 'Package' is defined but never used.  no-unused-vars
12:29:50.290 5:42  Warning: 'Check' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.291 5:42  Error: 'Check' is defined but never used.  no-unused-vars
12:29:50.291 9:10  Warning: 'Textarea' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.291 9:10  Error: 'Textarea' is defined but never used.  no-unused-vars
12:29:50.291 34:5  Warning: Unexpected console statement.  no-console
12:29:50.291 
12:29:50.291 ./src/app/moderator/subscription/caregiver/page.tsx
12:29:50.292 5:21  Warning: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.292 5:21  Error: 'Package' is defined but never used.  no-unused-vars
12:29:50.292 32:5  Warning: Unexpected console statement.  no-console
12:29:50.292 
12:29:50.292 ./src/app/moderator/tickets/[id]/page.tsx
12:29:50.293 6:21  Warning: 'MessageSquare' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.293 6:21  Error: 'MessageSquare' is defined but never used.  no-unused-vars
12:29:50.293 
12:29:50.293 ./src/app/moderator/verification/agencies/[id]/page.tsx
12:29:50.293 6:54  Warning: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.293 6:54  Error: 'FileText' is defined but never used.  no-unused-vars
12:29:50.294 
12:29:50.294 ./src/app/moderator/verification/caregivers/[id]/page.tsx
12:29:50.307 6:50  Warning: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.307 6:50  Error: 'FileText' is defined but never used.  no-unused-vars
12:29:50.307 
12:29:50.307 ./src/app/not-found/page.tsx
12:29:50.307 28:23  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:29:50.307 28:44  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:29:50.307 
12:29:50.307 ./src/app/not-found.tsx
12:29:50.307 42:29  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:29:50.307 42:50  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:29:50.307 
12:29:50.307 ./src/app/offline/page.tsx
12:29:50.307 19:85  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:29:50.307 21:28  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:29:50.307 47:53  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:29:50.307 
12:29:50.307 ./src/app/page.tsx
12:29:50.307 45:23  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:29:50.307 
12:29:50.307 ./src/app/patient/dashboard/page.tsx
12:29:50.307 9:20  Warning: 'Pill' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.307 9:20  Error: 'Pill' is defined but never used.  no-unused-vars
12:29:50.307 
12:29:50.307 ./src/app/patient/schedule/page.tsx
12:29:50.307 6:21  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.308 6:21  Error: 'Calendar' is defined but never used.  no-unused-vars
12:29:50.308 6:38  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
12:29:50.308 6:38  Error: 'User' is defined but never used.  no-unused-vars
12:29:50.308 38:66  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:29:50.308 
12:29:50.308 ./src/app/privacy/page.tsx
12:29:50.308 117:69  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
12:29:50.308 
12:29:50.308 ./src/app/shop/orders/[id]/page.tsx