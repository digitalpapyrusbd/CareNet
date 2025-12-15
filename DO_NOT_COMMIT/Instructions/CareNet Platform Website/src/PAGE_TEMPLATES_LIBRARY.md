# CareNet Platform - Page Templates Library
## Reusable Templates for Remaining 139 Pages

This library provides copy-paste templates for all remaining pages, maintaining 100% design consistency.

---

## 🎨 **Design Constants**

```typescript
// Use these exact colors and gradients across all pages

const COLORS = {
  text: {
    primary: '#535353',
    secondary: '#848484',
  },
  gradients: {
    pink: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
    blue: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
    green: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
    orange: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)',
    purple: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)',
  },
  status: {
    success: '#7CE577',
    error: '#FF6B7A',
    warning: '#FFD180',
    info: '#5B9FFF',
  }
};
```

---

## 📋 **Template 1: List View Page**

Use for: Job lists, caregiver lists, package lists, invoice lists, etc.

```tsx
import { Search, Plus, Filter } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

interface [PageName]Props {
  onSelectItem: (id: string) => void;
  onCreateNew: () => void;
}

export function [PageName]({ onSelectItem, onCreateNew }: [PageName]Props) {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState("");

  const items = {
    all: [
      { id: "1", name: "Item 1", status: "active" },
      { id: "2", name: "Item 2", status: "completed" },
    ],
    active: [],
    completed: []
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ color: '#535353' }}>[Page Title]</h1>
          <Button
            onClick={onCreateNew}
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              color: 'white'
            }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#848484' }} />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/50 border-white/50"
            style={{ color: '#535353' }}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto mb-6">
          {['all', 'active', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className="px-4 py-2 rounded-lg capitalize"
              style={{
                background: activeTab === tab 
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                  : 'rgba(255, 255, 255, 0.5)',
                color: activeTab === tab ? 'white' : '#535353'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Items List */}
        <div className="space-y-3">
          {items[activeTab].map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectItem(item.id)}
              className="w-full finance-card p-4 hover:shadow-lg transition-all text-left"
            >
              <h3 style={{ color: '#535353' }}>{item.name}</h3>
              <p style={{ color: '#848484' }}>{item.status}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 📋 **Template 2: Detail View Page**

Use for: Job details, user profiles, package details, order details, etc.

```tsx
import { ArrowLeft, Edit, Trash2, Share } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface [PageName]Props {
  id: string;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function [PageName]({ id, onBack, onEdit, onDelete }: [PageName]Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'history'>('overview');

  const data = {
    name: "Item Name",
    status: "active",
    // Add more fields
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 hover:bg-white/30"
          style={{ color: '#535353' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Header Card */}
        <div className="finance-card p-6 mb-6">
          <h1 className="mb-2" style={{ color: '#535353' }}>{data.name}</h1>
          <p style={{ color: '#848484' }}>Status: {data.status}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['overview', 'details', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className="px-4 py-2 rounded-lg capitalize text-sm"
              style={{
                background: activeTab === tab 
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                  : 'rgba(255, 255, 255, 0.5)',
                color: activeTab === tab ? 'white' : '#535353'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="finance-card p-6">
            <p style={{ color: '#535353' }}>Overview content</p>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button
            onClick={onEdit}
            variant="outline"
            className="bg-white/50 border-white/50"
            style={{ color: '#535353' }}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            onClick={onDelete}
            variant="outline"
            className="bg-white/50 border-white/50"
            style={{ color: '#FF6B7A' }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
```

---

## 📋 **Template 3: Form Page (Create/Edit)**

Use for: Create package, edit profile, add caregiver, etc.

```tsx
import { Save, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

interface [PageName]Props {
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function [PageName]({ initialData, onSave, onCancel }: [PageName]Props) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, description });
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="mb-6" style={{ color: '#535353' }}>
            {initialData ? 'Edit' : 'Create'} [Item]
          </h1>

          <form onSubmit={handleSubmit} className="finance-card p-8">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                  required
                  className="mt-2 bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                  className="mt-2 bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                onClick={onCancel}
                variant="outline"
                className="flex-1 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                  color: 'white'
                }}
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
```

---

## 📋 **Template 4: Dashboard/Stats Page**

Use for: Analytics, reports, overview dashboards

```tsx
import { TrendingUp, Users, DollarSign, Package } from "lucide-react";

interface [PageName]Props {
  onNavigate: (section: string) => void;
}

export function [PageName]({ onNavigate }: [PageName]Props) {
  const stats = {
    total: 1250,
    active: 856,
    revenue: 245000,
    growth: 12.5
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>[Dashboard Name]</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="finance-card p-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
              }}
            >
              <Users className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>{stats.total}</p>
            <p className="text-sm" style={{ color: '#848484' }}>Total Users</p>
          </div>

          <div className="finance-card p-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
              }}
            >
              <Package className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>{stats.active}</p>
            <p className="text-sm" style={{ color: '#848484' }}>Active</p>
          </div>

          <div className="finance-card p-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
              }}
            >
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>৳{stats.revenue.toLocaleString()}</p>
            <p className="text-sm" style={{ color: '#848484' }}>Revenue</p>
          </div>

          <div className="finance-card p-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
              }}
            >
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl mb-1" style={{ color: '#7CE577' }}>+{stats.growth}%</p>
            <p className="text-sm" style={{ color: '#848484' }}>Growth</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 📋 **Template 5: Modal/Dialog**

Use for: Confirmations, quick forms, alerts

```tsx
import { X, AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

interface [PageName]Props {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function [PageName]({ title, message, onConfirm, onCancel }: [PageName]Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onCancel} />

      <div className="relative w-full max-w-md rounded-t-2xl sm:rounded-2xl finance-card p-6">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/50"
          style={{ color: '#848484' }}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
            }}
          >
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>

          <h2 className="mb-4" style={{ color: '#535353' }}>{title}</h2>
          <p className="mb-6" style={{ color: '#848484' }}>{message}</p>

          <div className="flex gap-3">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                color: 'white'
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 🔧 **Component Usage Guide**

### **Buttons**
```tsx
// Primary Action
<Button style={{
  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
  color: 'white'
}}>Primary</Button>

// Secondary Action
<Button variant="outline" className="bg-white/50 border-white/50" style={{ color: '#535353' }}>
  Secondary
</Button>

// Success Action
<Button style={{
  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
  color: 'white'
}}>Success</Button>
```

### **Status Badges**
```tsx
<span className="text-xs px-3 py-1 rounded-full" style={{ background: '#7CE577', color: 'white' }}>
  Active
</span>

<span className="text-xs px-3 py-1 rounded-full" style={{ background: '#FFD180', color: 'white' }}>
  Pending
</span>

<span className="text-xs px-3 py-1 rounded-full" style={{ background: '#FF6B7A', color: 'white' }}>
  Error
</span>
```

### **Icon Circles**
```tsx
<div 
  className="w-12 h-12 rounded-full flex items-center justify-center"
  style={{
    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
  }}
>
  <Icon className="w-6 h-6 text-white" />
</div>
```

---

## 📊 **Remaining Pages by Template Type**

| Template Type | Count | Examples |
|---------------|-------|----------|
| List View | 45 | Job lists, user lists, invoice lists |
| Detail View | 35 | Profile views, job details, package details |
| Form Pages | 30 | Create/edit forms, settings |
| Dashboard | 15 | Analytics, reports, overviews |
| Modal/Dialog | 14 | Confirmations, quick actions |

**Total:** 139 pages remaining

---

## ✅ **Implementation Checklist**

For each new page:
- [ ] Use exact color codes
- [ ] Apply `.finance-card` class for containers
- [ ] Use radial gradients for buttons/icons
- [ ] Include proper TypeScript interfaces
- [ ] Add responsive design
- [ ] Include empty states
- [ ] Add loading states where needed
- [ ] Test on mobile viewport

---

**This library enables rapid page creation while maintaining 100% design consistency!**
