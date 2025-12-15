# Frontend 11: UI Components Library & Design System

**Version**: 1.0  
**Last Updated**: December 11, 2025  
**Related Files**: [TOC](01%20Frontend%20TOC.md) | [01: Architecture](01%20Frontend%2001.md)

---

## 📋 Table of Contents

1. [Design System Overview](#design-system-overview)
2. [UI Component Library](#ui-component-library)
3. [Base Components](#base-components)
4. [Form Components](#form-components)
5. [Layout Components](#layout-components)
6. [Data Display Components](#data-display-components)
7. [Feedback Components](#feedback-components)
8. [Navigation Components](#navigation-components)
9. [Custom Components](#custom-components)
10. [Component Usage Examples](#component-usage-examples)
11. [Theming & Styling](#theming--styling)
12. [Accessibility](#accessibility)
13. [Testing Components](#testing-components)
14. [Component Development Guide](#component-development-guide)

---

## 🎨 Design System Overview

### **Technology Stack**

- **UI Library**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS 3.4
- **Component Variants**: class-variance-authority (CVA)
- **Icons**: Lucide React
- **Total Components**: 60+ base components

### **Design Principles**

1. **Consistency**: Unified design language across all portals
2. **Accessibility**: WCAG 2.1 AA compliant
3. **Responsiveness**: Mobile-first approach
4. **Dark Mode**: Full dark mode support
5. **Performance**: Optimized rendering and lazy loading
6. **Reusability**: DRY principle for component composition

### **Color System**

```typescript
// Bangladesh-themed color palette
const colors = {
  // Primary gradients
  primary: {
    pink: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
    blue: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
    green: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
    purple: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)',
    orange: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB347 100%)',
  },
  
  // Text colors
  text: {
    primary: '#535353',
    secondary: '#848484',
    light: '#AFAFAF',
    white: '#FFFFFF',
  },
  
  // Status colors
  status: {
    success: '#7CE577',
    warning: '#FFD180',
    error: '#FF6B7A',
    info: '#5B9FFF',
  },
  
  // Background
  background: {
    card: 'rgba(255, 255, 255, 0.8)',
    input: 'rgba(255, 255, 255, 0.5)',
  }
};
```

### **Typography**

```css
/* Bengali & English Font Support */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', 'Noto Sans Bengali', sans-serif;
}
```

---

## 📦 UI Component Library

### **Component Categories**

```
src/components/ui/
├── Base Components (15)
│   ├── button.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── textarea.tsx
│   └── checkbox.tsx
│
├── Form Components (12)
│   ├── form.tsx
│   ├── select.tsx
│   ├── radio-group.tsx
│   ├── switch.tsx
│   └── slider.tsx
│
├── Layout Components (8)
│   ├── card.tsx
│   ├── separator.tsx
│   ├── sheet.tsx
│   ├── sidebar.tsx
│   └── tabs.tsx
│
├── Data Display (10)
│   ├── table.tsx
│   ├── badge.tsx
│   ├── avatar.tsx
│   ├── accordion.tsx
│   └── data-table.tsx
│
├── Feedback (8)
│   ├── alert.tsx
│   ├── alert-dialog.tsx
│   ├── dialog.tsx
│   ├── toast.tsx (sonner)
│   └── progress.tsx
│
└── Navigation (7)
    ├── navigation-menu.tsx
    ├── breadcrumb.tsx
    ├── dropdown-menu.tsx
    ├── menubar.tsx
    └── pagination.tsx
```

---

## 🔘 Base Components

### **Button Component**

**File**: `src/components/ui/button.tsx`

```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md gap-1.5 px-3",
        lg: "h-10 rounded-md px-6",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="mr-2 h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };
```

**Usage:**

```tsx
// Default button
<Button>Click me</Button>

// With variants
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Menu</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>

// Loading state
<Button loading>Processing...</Button>

// Custom gradient style
<Button 
  style={{
    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
    color: 'white'
  }}
>
  Custom Gradient
</Button>
```

### **Input Component**

**File**: `src/components/ui/input.tsx`

```tsx
import * as React from "react";
import { cn } from "./utils";

export type InputProps = React.ComponentProps<"input">

function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md border border-input bg-input-background px-3 py-1 text-base",
        "placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input };
```

**Usage:**

```tsx
<Input type="text" placeholder="Enter your name" />
<Input type="email" placeholder="you@example.com" />
<Input type="password" placeholder="Password" />
<Input type="number" placeholder="0" />
<Input disabled placeholder="Disabled" />
<Input aria-invalid="true" placeholder="Invalid input" />
```

### **Label Component**

**File**: `src/components/ui/label.tsx`

```tsx
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cn } from "./utils"

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
```

---

## 📝 Form Components

### **Select Component**

**File**: `src/components/ui/select.tsx`

```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>
```

### **Checkbox Component**

```tsx
<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <label htmlFor="terms">Accept terms and conditions</label>
</div>
```

### **Radio Group Component**

```tsx
<RadioGroup defaultValue="option1">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option1" id="option1" />
    <Label htmlFor="option1">Option 1</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option2" id="option2" />
    <Label htmlFor="option2">Option 2</Label>
  </div>
</RadioGroup>
```

### **Switch Component**

```tsx
<div className="flex items-center space-x-2">
  <Switch id="notifications" />
  <Label htmlFor="notifications">Enable notifications</Label>
</div>
```

---

## 🗂️ Layout Components

### **Card Component**

**File**: `src/components/ui/card.tsx`

```tsx
function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border",
        className
      )}
      {...props}
    />
  );
}
```

**Usage:**

```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### **Tabs Component**

```tsx
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    Account settings content
  </TabsContent>
  <TabsContent value="password">
    Password settings content
  </TabsContent>
</Tabs>
```

### **Separator Component**

```tsx
<div>
  <p>Content above</p>
  <Separator className="my-4" />
  <p>Content below</p>
</div>
```

---

## 📊 Data Display Components

### **Table Component**

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
      <TableCell>
        <Badge>Active</Badge>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### **Badge Component**

```tsx
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

### **Avatar Component**

```tsx
<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
```

### **Accordion Component**

```tsx
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Is it styled?</AccordionTrigger>
    <AccordionContent>
      Yes. It comes with default styles.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

---

## 🔔 Feedback Components

### **Alert Component**

```tsx
<Alert>
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components to your app using the cli.
  </AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertTriangle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Your session has expired. Please log in again.
  </AlertDescription>
</Alert>
```

### **Dialog Component**

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### **Toast Component (Sonner)**

**File**: `src/components/ui/sonner.tsx`

```tsx
import { toast } from "sonner";

// Success toast
toast.success("Profile updated successfully");

// Error toast
toast.error("Failed to save changes");

// Info toast
toast.info("New message received");

// Warning toast
toast.warning("Your session will expire soon");

// Custom toast
toast("Event has been created", {
  description: "Sunday, December 03, 2023 at 9:00 AM",
  action: {
    label: "Undo",
    onClick: () => console.log("Undo"),
  },
});
```

### **Progress Component**

```tsx
<Progress value={33} />
<Progress value={66} />
<Progress value={100} />
```

---

## 🧭 Navigation Components

### **UniversalNav Component**

**File**: `src/components/layout/UniversalNav.tsx`

```tsx
export function UniversalNav({ userRole, showBack = true }: UniversalNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  const getDashboardPath = () => {
    switch (userRole) {
      case 'guardian': return '/guardian/dashboard';
      case 'caregiver': return '/caregiver/dashboard';
      case 'agency': return '/agency/dashboard';
      case 'patient': return '/patient/dashboard';
      case 'shop': return '/shop/dashboard';
      case 'moderator': return '/moderator/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/dashboard';
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="flex items-center justify-between px-6 py-3">
        {showBack && (
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <Button variant="ghost" onClick={() => router.push(getDashboardPath())}>
          <Home className="w-5 h-5" />
        </Button>
        <Button variant="ghost" onClick={() => setShowProfileMenu(!showProfileMenu)}>
          <User className="w-5 h-5" />
        </Button>
      </div>
    </nav>
  );
}
```

**Usage:**

```tsx
<UniversalNav userRole="guardian" showBack={true} />
<UniversalNav userRole="caregiver" showBack={false} />
```

### **Breadcrumb Component**

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/components">Components</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### **Pagination Component**

```tsx
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">3</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

---

## 🎨 Custom Components

### **Finance Card (Custom)**

**Usage across portals:**

```tsx
<div className="finance-card p-6">
  <h2 style={{ color: '#535353' }}>Card Title</h2>
  <p style={{ color: '#848484' }}>Card description</p>
</div>
```

**CSS Definition:**

```css
.finance-card {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 24px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
}
```

### **bKash Payment Component**

**File**: `src/components/ui/bkash-payment.tsx`

```tsx
export function BkashPayment({ amount, onSuccess, onError }: BkashPaymentProps) {
  return (
    <div className="finance-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <img src="/bkash-logo.png" alt="bKash" className="h-8" />
        <h3 style={{ color: '#535353' }}>bKash Payment</h3>
      </div>
      <p className="text-2xl mb-4" style={{ color: '#E2136E' }}>
        ৳{amount.toLocaleString()}
      </p>
      <Input placeholder="01XXXXXXXXX" type="tel" />
      <Button 
        className="w-full mt-4"
        style={{ background: '#E2136E', color: 'white' }}
      >
        Pay with bKash
      </Button>
    </div>
  );
}
```

### **Nagad Payment Component**

**File**: `src/components/ui/nagad-payment.tsx`

Similar structure to bKash, using Nagad branding (#F26522).

### **Language Switcher**

**File**: `src/components/ui/language-switcher.tsx`

```tsx
export function LanguageSwitcher() {
  const [language, setLanguage] = useState('en');

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">🇬🇧 English</SelectItem>
        <SelectItem value="bn">🇧🇩 বাংলা</SelectItem>
      </SelectContent>
    </Select>
  );
}
```

### **Theme Switcher**

**File**: `src/components/ui/theme-switcher.tsx`

```tsx
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
```

---

## 💡 Component Usage Examples

### **Login Form Example**

```tsx
<Card className="w-full max-w-md">
  <CardHeader>
    <CardTitle>Login</CardTitle>
    <CardDescription>Enter your credentials to continue</CardDescription>
  </CardHeader>
  <CardContent>
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          required
        />
      </div>
      <Button type="submit" className="w-full" loading={isLoading}>
        Sign In
      </Button>
    </form>
  </CardContent>
</Card>
```

### **Data Table Example**

```tsx
<Card>
  <CardHeader>
    <CardTitle>Users</CardTitle>
  </CardHeader>
  <CardContent>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>
              <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                {user.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Button size="sm" variant="ghost">Edit</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </CardContent>
</Card>
```

---

## 🎨 Theming & Styling

### **Tailwind Configuration**

**File**: `tailwind.config.js`

```javascript
module.exports = {
  darkMode: ["class"],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... more colors
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

### **CSS Variables**

**File**: `src/app/globals.css`

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 3.9%;
  --primary: 0 0% 9%;
  --primary-foreground: 0 0% 98%;
  --radius: 0.5rem;
}

.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  --card: 0 0% 3.9%;
  --card-foreground: 0 0% 98%;
}
```

---

## ♿ Accessibility

### **ARIA Labels**

```tsx
<Button aria-label="Close dialog">
  <X className="h-4 w-4" />
</Button>

<Input aria-invalid={hasError} aria-describedby="error-message" />
{hasError && <p id="error-message" role="alert">Error message</p>}
```

### **Keyboard Navigation**

All components support:
- Tab navigation
- Enter/Space for activation
- Escape to close modals/menus
- Arrow keys for navigation

---

## 🧪 Testing Components

```typescript
describe('Button Component', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    const { user } = render(<Button onClick={handleClick}>Click</Button>);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

---

## 📝 Component Development Guide

### **Creating a New Component**

1. **Create component file**: `src/components/ui/my-component.tsx`
2. **Add TypeScript types**
3. **Implement component with Radix UI (if needed)**
4. **Add Tailwind styling**
5. **Export from index**: `src/components/ui/index.ts`
6. **Write tests**: `src/components/ui/__tests__/my-component.test.tsx`
7. **Document usage**

### **Component Template**

```tsx
import * as React from "react"
import { cn } from "./utils"

export interface MyComponentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "base-classes",
          variant === 'outline' && "outline-classes",
          size === 'sm' && "sm-classes",
          className
        )}
        {...props}
      />
    )
  }
)
MyComponent.displayName = "MyComponent"

export { MyComponent }
```

---

**Last Updated**: December 11, 2025  
**Maintained By**: Development Team
