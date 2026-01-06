src/
├── app/                    # Next.js App Router (Entry Point)
│   ├── admin/             # Admin panel with comprehensive management tools
│   ├── agency/            # Agency management interface  
│   ├── caregiver/         # Caregiver dashboard and tools
│   ├── guardian/          # Guardian/family dashboard
│   ├── auth/              # Authentication flows and user management
│   ├── dashboard/         # Default dashboard routing
│   ├── marketplace/       # Caregiver marketplace and discovery
│   ├── messages/          # Messaging system
│   ├── ... (other routes)
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Landing page component
├── components/            # Reusable UI components
│   ├── layout/            # Layout components (UniversalNav, Sidebar, etc.)
│   ├── ui/                # Design system components
│   ├── providers/         # Context providers and state management
│   ├── chat/              # Chat functionality components
│   ├── auth/              # Authentication components
│   └── ... (role-specific components)
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries and helpers
├── notifications/         # Notification system
├── pages/                 # Legacy page components (if any)
├── services/              # API services and external integrations
├── store/                 # Global state management
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── proxy.ts               # API proxy configuration
```

### Key Components

- **Entry Point**: `src/app/layout.tsx` - Root layout with providers and global navigation
- **Main App Component**: `src/app/page.tsx` - Landing page with comprehensive feature showcase
- **Navigation**: `src/components/layout/UniversalNav.tsx` - Mobile-first bottom navigation with role-based routing

## 🛠️ Tech Stack

### Core Technologies
- **Frontend Framework**: Next.js 16.1.1 (App Router)
- **React Version**: 19.2.3
- **TypeScript**: 5.3.2
- **Styling**: Tailwind CSS 3.3.0 with JIT compilation
- **UI Library**: Radix UI primitives for accessible components
- **State Management**: React Context + TanStack Query (5.90.12)

### Authentication & Security
- **Auth Provider**: NextAuth.js 4.24.13
- **JWT**: jsonwebtoken 9.0.3
- **Password Hashing**: bcryptjs 2.4.3
- **Multi-Factor Auth**: speakeasy 2.0.0
- **Rate Limiting**: Upstash Redis rate limiting

### Data Management
- **Database**: Prisma ORM with SQLite 5.1.7 (development)
- **Cache**: Upstash Redis 1.36.0
- **Search**: In-memory search with Next.js routing
- **File Storage**: Firebase Admin for cloud storage

### AI & Intelligence
- **Generative AI**: Google Generative AI 0.24.1
- **Chat System**: Sonner notifications + custom chat components
- **Performance Monitoring**: Web Vitals integration

### Additional Libraries
- **Forms**: React Hook Form 7.69.0 + Zod validation
- **Charts**: Recharts 3.6.0
- **Date Handling**: date-fns 4.1.0
- **QR Codes**: qrcode 1.5.4
- **Email**: SendGrid 8.1.6
- **SMS**: Twilio 5.11.1
- **Testing**: Jest, React Testing Library, Playwright
- **PWA**: Service worker registration and offline indicators

## 🚀 Getting Started

### Prerequisites
- Node.js >= 22.12.0
- Yarn or npm

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd Caregiver

# Install dependencies
npm install
# or
yarn install
```

### Development
```bash
# Start development server
npm run dev
# or
yarn dev

# Run type checking
npm run type-check
# or
yarn type-check

# Run linting
npm run lint
# or
yarn lint

# Fix linting issues
npm run lint:fix
# or
yarn lint:fix
```

### Available Scripts
```bash
# Development
npm run dev                    # Start development server
npm run build                 # Build for production
npm run start                 # Start production server

# Database
npm run db:generate           # Generate Prisma client
npm run db:migrate            # Run database migrations
npm run db:studio             # Open Prisma Studio
npm run db:seed               # Seed database
npm run db:reset              # Reset and seed database

# Testing
npm run test                  # Run all tests
npm run test:watch            # Run tests in watch mode
npm run test:coverage         # Generate coverage report
npm run test:frontend         # Run frontend tests only
npm run test:unit             # Run unit tests
npm run test:integration      # Run integration tests
npm run test:performance      # Run performance tests
npm run test:security         # Run security tests
npm run test:accessibility    # Run accessibility tests
npm run test:playwright       # Run end-to-end tests
npm run test:load             # Run load tests

# Quality Assurance
npm run ci                    # Run CI pipeline
npm run analyze               # Bundle analysis
npm run security:audit        # Security audit
npm run perf:audit            # Performance audit
```

### Environment Variables
Create a `.env.local` file based on the example configuration:

```bash
# Database
DATABASE_URL="file:./dev.db"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Email
SENDGRID_API_KEY="your-sendgrid-key"
FROM_EMAIL="noreply@caregiverbd.com"

# SMS
TWILIO_ACCOUNT_SID="your-twilio-sid"
TWILIO_AUTH_TOKEN="your-twilio-token"
TWILIO_PHONE_NUMBER="+1234567890"

# AI
GOOGLE_API_KEY="your-google-api-key"

# Redis
UPSTASH_REDIS_REST_URL="your-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"

# Firebase
FIREBASE_SERVICE_ACCOUNT_JSON="your-firebase-config"

# JWT
JWT_SECRET="your-jwt-secret"

# Frontend
NEXT_PUBLIC_APP_NAME="CaregiverBD"
NEXT_PUBLIC_APP_VERSION="0.1.0"
```

## 🌐 Key Features & Routes

### Main Routes
- **`/`** - Landing page with caregiver platform overview
- **`/auth/`** - Authentication flows (login, registration, MFA)
- **`/dashboard/`** - Default dashboard routing
- **`/caregiver/`** - Caregiver-specific features
- **`/guardian/`** - Guardian/family dashboard
- **`/agency/`** - Agency management interface
- **`/admin/`** - Administrative controls
- **`/moderator/`** - Content moderation tools
- **`/shop/`** - Marketplace functionality
- **`/messages/`** - Messaging system
- **`/assistant/`** - AI-powered assistant

### Role-Based Features

#### Guardians
- Patient profile management
- Caregiver booking and scheduling
- Care progress tracking
- Emergency contact management
- Payment processing

#### Caregivers
- Profile management and verification
- Job applications and assignments
- Care log recording
- Earnings and payment tracking
- Training and certification

#### Agencies
- Caregiver pool management
- Job posting and assignment
- Billing and invoicing
- Performance monitoring

#### Administrators
- User management and permissions
- System analytics and reporting
- Content moderation
- System settings and configuration

## 📁 Folder Conventions

### Structural Organization
The project follows a **feature-based organizational structure** with the following conventions:

#### App Router (`src/app/`)
- **Route-based structure**: Each folder represents a route segment
- **Component isolation**: Each route contains its own components, styles, and logic
- **Nested routing**: Deeply nested features are organized hierarchically

#### Components (`src/components/`)
- **By functionality**: Components grouped by their primary purpose
- **Reusability focus**: Shared components in `common/` and `ui/` folders
- **Role-specific**: Role-based components in dedicated folders (caregiver/, guardian/, etc.)

#### State Management
- **Context providers**: Centralized in `src/components/providers/`
- **Global state**: Managed in `src/store/` using React Context
- **Query management**: TanStack Query for data fetching and caching

#### Type Organization
- **Shared types**: Common interfaces in `src/types/`
- **Feature-specific types**: Types co-located with their features
- **API types**: Generated and maintained in `src/types/api/`

### Naming Conventions
- **PascalCase** for components and React elements
- **camelCase** for variables and function names
- **kebab-case** for file names and URLs
- **UPPER_CASE** for constants and environment variables
- **Descriptive names**: Functions and components named for their purpose

### Development Patterns
- **Mobile-first design**: All components designed for mobile first
- **Accessibility**: ARIA labels and semantic HTML throughout
- **Type safety**: Comprehensive TypeScript coverage
- **Testing**: Unit, integration, and end-to-end test coverage
- **Performance**: Optimized bundles with code splitting and lazy loading

This platform represents a sophisticated, production-ready caregiver management system with comprehensive features for all stakeholders in the caregiving ecosystem.