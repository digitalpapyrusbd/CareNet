Development Guidelines & Implementation Standards
Document Version: 1.0
Purpose: Specific technical guidelines for AI agent implementation
Scope: Caregiver Platform Development

🎯 DEVELOPMENT PRINCIPLES
1. Code Quality Standards
TypeScript Strict Mode: All code must be fully typed, no any types
ESLint Compliance: Follow existing configuration, zero linting errors
Component Structure: Consistent patterns across all components
Error Boundaries: Implement comprehensive error handling
Performance: Optimize for Core Web Vitals (LCP < 2.5s, FID < 100ms)
2. Security Requirements
Input Validation: All user inputs validated using Zod schemas
SQL Injection Prevention: Use Prisma parameterized queries only
XSS Protection: Sanitize all user-generated content
Authentication: JWT tokens with proper expiration and refresh
Authorization: Role-based access control on all endpoints
3. User Experience Standards
Mobile-First: Responsive design for all screen sizes
Accessibility: WCAG 2.1 AA compliance mandatory
Performance: Page load times under 2 seconds
Localization: English/Bengali support from day one
Error Handling: User-friendly error messages with recovery options
🏗️ ARCHITECTURAL PATTERNS
1. Project Structure

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes group
│   ├── dashboard/          # Role-based dashboards
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── forms/            # Form components
│   ├── cards/            # Card components
│   └── layout/           # Layout components
├── lib/                  # Utilities and configurations
│   ├── auth/             # Authentication logic
│   ├── db/               # Database utilities
│   ├── utils/            # Helper functions
│   ├── validations/      # Zod schemas
│   └── constants/        # App constants
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── public/               # Static assets
2. Naming Conventions
Files: kebab-case for folders, PascalCase for components
Components: PascalCase (e.g., UserProfileCard.tsx)
Functions: camelCase (e.g., getUserProfile())
Constants: UPPER_SNAKE_CASE (e.g., API_BASE_URL)
Database: snake_case for tables/columns (Prisma handles this)
3. Component Patterns
typescript

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
⌄
⌄
// Component structure template
interface ComponentProps {
  // Props with TypeScript types
}

export function ComponentName({ prop }: ComponentProps) {
  // 1. Hooks (useState, useEffect, etc.)
  // 2. Event handlers
  // 3. Derived values
  // 4. JSX return
  
  return (
    <div className="component-wrapper">
      {/* Component content */}
    </div>
  );
}
📊 DATABASE IMPLEMENTATION
1. Prisma Schema Guidelines
prisma

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
// Example entity implementation
model User {
  id                String    @id @default(cuid())
  role              UserRole  // Enum defined separately
  phone             String    @unique
  email             String?   @unique
  passwordHash      String    @map("password_hash")
  name              String
  language          String    @default("en")
  kycStatus         KyCStatus @default(PENDING) @map("kyc_status")
  kycDocumentUrl    String?   @map("kyc_document_url")
  mfaEnabled        Boolean   @default(false) @map("mfa_enabled")
  mfaSecret         String?   @map("mfa_secret")
  lastLoginAt       DateTime?  @map("last_login_at")
  isActive          Boolean   @default(true) @map("is_active")
  deletedAt         DateTime?  @map("deleted_at")
  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")

  // Relations
  company           Company?
  caregiver         Caregiver?
  patients          Patient[]
  jobsGuardian      Job[]       @relation("GuardianJobs")
  payments          Payment[]
  feedbackGiven     Feedback[]  @relation("FeedbackGiven")
  feedbackReceived  Feedback[]  @relation("FeedbackReceived")

  @@map("users")
}

enum UserRole {
  SUPER_ADMIN
  MODERATOR
  COMPANY
  CAREGIVER
  GUARDIAN
  PATIENT
}

enum KyCStatus {
  PENDING
  VERIFIED
  REJECTED
}
2. Database Optimization Rules
Indexes: Add indexes on foreign keys and frequently queried columns
Constraints: Use check constraints for data validation
Relationships: Proper foreign key relationships with cascade rules
Soft Deletes: Use deletedAt instead of hard deletes
Timestamps: All tables must have createdAt and updatedAt
3. Migration Strategy
bash

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
# Generate migration
npx prisma migrate dev --name init

# Reset database (development only)
npx prisma migrate reset

# Generate Prisma client
npx prisma generate

# Seed database
npx prisma db seed
🔐 AUTHENTICATION IMPLEMENTATION
1. JWT Token Management
typescript

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
⌄
⌄
⌄
⌄
// lib/auth/jwt.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export interface JWTPayload {
  userId: string;
  role: UserRole;
  email?: string;
}

export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}
2. Password Security
typescript

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
12
⌄
⌄
// lib/auth/password.ts
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
3. Phone Number Validation (Bangladesh)
typescript

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
⌄
⌄
// lib/validations/phone.ts
import { z } from 'zod';

export const bangladeshPhoneSchema = z.string()
  .regex(/^(\+8801|01)[3-9]\d{8}$/, 'Invalid Bangladesh phone number')
  .transform(phone => {
    if (phone.startsWith('01')) {
      return '+880' + phone.substring(1);
    }
    return phone;
  });
🌐 API DEVELOPMENT STANDARDS
1. API Route Structure
typescript

Line Wrapping

Collapse
Copy
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99
100
101
102
103
104
105
106
107
108
109
⌄
⌄
⌄
⌄
⌄
⌄
⌄
// src/app/api/users/route.ts
        OR: [
          { email: validatedData.email },
          { phone: validatedData.phone },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Create user
    const user = await db.user.create({
      data: {
        ...validatedData,
        passwordHash: await hashPassword(validatedData.password),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('User Creation Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
2. Validation Schemas
typescript

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
⌄
⌄
// lib/validations/user.ts
import { z } from 'zod';
import { UserRole } from '@prisma/client';
import { bangladeshPhoneSchema } from './phone';

export const userCreateSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email().optional(),
  phone: bangladeshPhoneSchema,
  password: z.string().min(8).max(100),
  role: z.nativeEnum(UserRole),
  language: z.enum(['en', 'bn']).default('en'),
});

export const userUpdateSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  email: z.string().email().optional(),
  language: z.enum(['en', 'bn']).optional(),
});
3. Error Handling Middleware
typescript

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
⌄
⌄
⌄
⌄
⌄
⌄
// lib/auth/middleware.ts
import { NextRequest } from 'next/server';
import { verifyAccessToken } from './jwt';

export async function authMiddleware(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { success: false, error: 'No token provided' };
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    // Check if user still exists and is active
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, isActive: true, role: true },
    });

    if (!user || !user.isActive) {
      return { success: false, error: 'Invalid token' };
    }

    return { success: true, user };
  } catch (error) {
    return { success: false, error: 'Invalid token' };
  }
}
🎨 FRONTEND DEVELOPMENT STANDARDS
1. Component Structure
typescript

Line Wrapping

Collapse
Copy
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
⌄
⌄
⌄
⌄
⌄
⌄
⌄
// src/components/forms/UserForm.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { userCreateSchema } from '@/lib/validations/user';

type UserFormData = z.infer<typeof userCreateSchema>;

interface UserFormProps {
  onSubmit: (data: UserFormData) => Promise<void>;
  initialData?: Partial<UserFormData>;
}

export function UserForm({ onSubmit, initialData }: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: initialData,
  });

  const onFormSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...register('name')}
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          {...register('phone')}
          disabled={isLoading}
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Saving...' : 'Save User'}
      </Button>
    </form>
  );
}
2. Data Fetching Pattern
typescript

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
⌄
⌄
⌄
⌄
⌄
⌄
⌄
⌄
// src/hooks/useUsers.ts
import { useState, useEffect } from 'react';
import { User } from '@prisma/client';

interface UseUsersOptions {
  page?: number;
  limit?: number;
  search?: string;
}

export function useUsers(options: UseUsersOptions = {}) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        if (options.page) params.append('page', options.page.toString());
        if (options.limit) params.append('limit', options.limit.toString());
        if (options.search) params.append('search', options.search);

        const response = await fetch(`/api/users?${params}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [options.page, options.limit, options.search]);

  return { users, loading, error };
}
3. Responsive Design Implementation
typescript

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
⌄
⌄
⌄
// src/components/layout/DashboardLayout.tsx
'use client';

import { useState } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {!isDesktop && sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        className={isDesktop ? 'hidden md:block' : 'fixed'}
      />

      {/* Main content */}
      <div className={isDesktop ? 'md:ml-64' : ''}>
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
🌍 INTERNATIONALIZATION
1. i18n Setup
typescript

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
⌄
⌄
⌄
⌄
⌄
⌄
⌄
⌄
// src/lib/i18n.ts
import { z } from 'zod';

export type Locale = 'en' | 'bn';

export const translations = {
  en: {
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.phone': 'Phone Number',
    'auth.password': 'Password',
    'error.required': 'This field is required',
    'error.invalidPhone': 'Invalid phone number',
    'user.guardian': 'Guardian',
    'user.caregiver': 'Caregiver',
    'user.company': 'Company',
  },
  bn: {
    'auth.login': 'লগইন',
    'auth.register': 'নিবন্ধন করুন',
    'auth.phone': 'ফোন নম্বর',
    'auth.password': 'পাসওয়ার্ড',
    'error.required': 'এই ক্ষেত্রটি আবশ্যক',
    'error.invalidPhone': 'অবৈধ ফোন নম্বর',
    'user.guardian': 'অভিভাবক',
    'user.caregiver': 'যত্নকারী',
    'user.company': 'কোম্পানি',
  },
};

export function t(key: keyof typeof translations.en, locale: Locale = 'en'): string {
  return translations[locale][key] || translations.en[key] || key;
}

export function createZodI18nError(locale: Locale) {
  return z.ZodError.create((issue) => {
    switch (issue.code) {
      case z.ZodIssueCode.invalid_string:
        if (issue.validation === 'email') {
          return { message: t('error.invalidEmail', locale) };
        }
        break;
      case z.ZodIssueCode.too_small:
        return { message: t('error.tooShort', locale) };
      default:
        return { message: t('error.invalidInput', locale) };
    }
  });
}
2. Language Switcher Component
typescript

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
⌄
⌄
// src/components/ui/LanguageSwitcher.tsx
'use client';

import { useLocale } from '@/hooks/use-locale';
import { Button } from './button';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'bn' : 'en');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="w-20"
    >
      <Globe className="w-4 h-4 mr-1" />
      {locale.toUpperCase()}
    </Button>
  );
}
📱 MOBILE APP DEVELOPMENT
1. React Native Setup
typescript

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
⌄
// caregiver-app/src/navigation/AppNavigator.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { JobsScreen } from '../screens/JobsScreen';
import { EarningsScreen } from '../screens/EarningsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export function AppNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="Jobs" 
        component={JobsScreen}
        options={{ tabBarLabel: 'Jobs' }}
      />
      <Tab.Screen 
        name="Earnings" 
        component={EarningsScreen}
        options={{ tabBarLabel: 'Earnings' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
2. GPS Check-in Implementation
typescript

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
⌄
⌄
⌄
⌄
⌄
⌄
⌄
⌄
⌄
⌄
⌄
⌄
⌄
⌄
⌄
⌄
⌄
⌄
// caregiver-app/src/services/LocationService.ts
import Geolocation from '@react-native-community/geolocation';
import { Alert, PermissionsAndroid, Platform } from 'react-native';

export class LocationService {
  static async requestLocationPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  }

  static async getCurrentLocation(): Promise<{
    latitude: number;
    longitude: number;
  }> {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    });
  }

  static async checkInForJob(jobId: string): Promise<void> {
    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('Permission Required', 'Location permission is required for check-in');
        return;
      }

      const location = await this.getCurrentLocation();
      
      // Send check-in data to server
      const response = await fetch('/api/care-logs/check-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify({
          jobId,
          location,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Check-in failed');
      }

      Alert.alert('Success', 'Checked in successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to check in. Please try again.');
    }
  }
}
💳 PAYMENT INTEGRATION
1. bKash Integration
typescript

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
⌄
⌄
⌄
⌄
⌄
⌄
⌄
⌄
⌄
⌄
⌄
⌄
// src/lib/payments/bkash.ts
import crypto from 'crypto';

export class BkashService {
  private baseUrl: string;
  private appKey: string;
  private appSecret: string;
  private username: string;
  private password: string;

  constructor() {
    this.baseUrl = process.env.BKASH_BASE_URL!;
    this.appKey = process.env.BKASH_APP_KEY!;
    this.appSecret = process.env.BKASH_APP_SECRET!;
    this.username = process.env.BKASH_USERNAME!;
    this.password = process.env.BKASH_PASSWORD!;
  }

  async getGrantToken(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/token/grant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        app_key: this.appKey,
        app_secret: this.appSecret,
      }),
    });

    const data = await response.json();
    return data.id_token;
  }

  async createCheckoutURL(amount: number, orderId: string): Promise<string> {
    const token = await this.getGrantToken();
    
    const response = await fetch(`${this.baseUrl}/payment/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        mode: '0011',
        payerReference: '01770618575',
        callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/bkash/callback`,
        amount: amount.toString(),
        currency: 'BDT',
        intent: 'sale',
        merchantInvoiceNumber: orderId,
      }),
    });

    const data = await response.json();
    return data.bkashURL;
  }

  async verifyPayment(paymentID: string): Promise<boolean> {
    const token = await this.getGrantToken();
    
    const response = await fetch(`${this.baseUrl}/payment/status/${paymentID}`, {
2. Payment Processing API
typescript

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
⌄
⌄
⌄
⌄
⌄
⌄
⌄
⌄
⌄
// src/app/api/payments/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { BkashService } from '@/lib/payments/bkash';
import { paymentCreateSchema } from '@/lib/validations/payment';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId, amount, method } = paymentCreateSchema.parse(body);

    // Get job details
    const job = await db.job.findUnique({
      where: { id: jobId },
      include: { company: true },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Create payment record
    const payment = await db.payment.create({
      data: {
        jobId,
        payerId: job.guardianId,
        amount,
        method,
        status: 'PENDING',
        invoiceNumber: `INV-${Date.now()}`,
      },
    });

    // Create checkout URL based on payment method
    let checkoutURL: string;
    
    switch (method) {
      case 'BKASH':
        const bkash = new BkashService();
        checkoutURL = await bkash.createCheckoutURL(amount, payment.id);
        break;
      case 'NAGAD':
        // Implement Nagad integration
        throw new Error('Nagad not implemented yet');
      default:
        throw new Error('Invalid payment method');
    }

    return NextResponse.json({
      paymentId: payment.id,
      checkoutURL,
      invoiceNumber: payment.invoiceNumber,
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
📊 MONITORING & LOGGING
1. Error Tracking
typescript

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
⌄
⌄
⌄
⌄
⌄
⌄
// src/lib/monitoring/error-tracker.ts
export class ErrorTracker {
  static track(error: Error, context?: Record<string, any>) {
    console.error('Application Error:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });

    // Send to external monitoring service (e.g., Sentry)
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error, { extra: context });
    }
  }

  static trackAPIError(endpoint: string, error: unknown, requestBody?: any) {
    this.track(new Error(`API Error: ${endpoint}`), {
      endpoint,
      requestBody,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
2. Performance Monitoring
typescript

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
⌄
⌄
⌄
⌄
⌄
// src/lib/monitoring/performance.ts
export class PerformanceMonitor {
  static async measureAsync<T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      
      console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
      
      if (duration > 1000) {
        console.warn(`Slow operation detected: ${name}`);
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`Failed operation: ${name} after ${duration.toFixed(2)}ms`);
      throw error;
    }
  }
}
🧪 TESTING GUIDELINES
1. Unit Testing
typescript

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
⌄
⌄
⌄
// __tests__/lib/auth/jwt.test.ts
import { generateAccessToken, verifyAccessToken } from '@/lib/auth/jwt';

describe('JWT Token Management', () => {
  it('should generate and verify access token', () => {
    const payload = { userId: 'user123', role: 'GUARDIAN' };
    const token = generateAccessToken(payload);
    
    expect(typeof token).toBe('string');
    
    const decoded = verifyAccessToken(token);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.role).toBe(payload.role);
  });

  it('should throw error for invalid token', () => {
    expect(() => verifyAccessToken('invalid-token')).toThrow();
  });
});
2. Integration Testing
typescript

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
⌄
⌄
⌄
⌄
// __tests__/api/users.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/users/route';

describe('/api/users', () => {
  it('should create a new user', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'Test User',
        phone: '+8801712345678',
        password: 'password123',
        role: 'GUARDIAN',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data.name).toBe('Test User');
    expect(data.phone).toBe('+8801712345678');
  });
});
📋 DEPLOYMENT CHECKLIST
1. Pre-Deployment
 All tests passing
 Code linting clean
 TypeScript compilation successful
 Environment variables configured
 Database migrations tested
 Security audit completed
 Performance benchmarks met
2. Production Deployment
 Database backup created
 Migrations applied
 Application deployed
 Health checks passing
 Monitoring configured
 SSL certificates valid
 DNS configured correctly
3. Post-Deployment
 Functionality tests passed
 Performance metrics monitored
 Error tracking active
 User acceptance testing
 Documentation updated
This document provides comprehensive guidelines for implementing the caregiver platform. The AI agent should follow these standards strictly to ensure code quality, security, and maintainability.
