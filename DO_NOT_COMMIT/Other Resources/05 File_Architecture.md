# File Architecture

## Web (Next.js)
```
/caregiver-web/
│
├── /pages/
│   ├── index.tsx
│   ├── login.tsx
│   ├── dashboard.tsx
│   └── [role]/[view].tsx
│
├── /components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Card.tsx
│   └── Form/
│
├── /lib/
│   ├── api.ts
│   ├── auth.ts
│   └── i18n.ts
│
├── /public/
│   └── /locales/
│       ├── en.json
│       └── bn.json
│
└── next.config.js
```

## Mobile (React Native)
```
/caregiver-app/
├── /src/
│   ├── screens/
│   ├── components/
│   ├── navigation/
│   ├── services/
│   └── assets/
│
└── App.tsx
```

## Backend (NestJS)
```
/api/
├── /src/
│   ├── modules/
│   │   ├── user/
│   │   ├── company/
│   │   ├── job/
│   │   └── payment/
│   ├── common/
│   ├── middleware/
│   ├── utils/
│   └── main.ts
└── package.json
```
