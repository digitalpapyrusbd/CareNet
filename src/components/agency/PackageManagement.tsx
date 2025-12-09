import { Package, Plus, Edit, Trash2, Eye, Copy, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface PackageManagementProps {
  onCreatePackage: () => void;
  onEditPackage: (id: string) => void;
  onViewPackage: (id: string) => void;
  onDeletePackage: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function PackageManagement({ onCreatePackage, onEditPackage, onViewPackage, onDeletePackage, onToggleStatus }: PackageManagementProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'inactive' | 'draft'>('active');

  const packages = {
    active: [
      {
        id: "1",
        name: "24/7 Senior Care - Basic",
        price: 35000,
        duration: "Monthly",
        bookings: 12,
        rating: 4.8,
        status: "active",
        category: "Full-time Care"
      },
      {
        id: "2",
        name: "Post-Surgery Care Package",
        price: 28000,
        duration: "2 weeks",
        bookings: 8,
        rating: 4.9,
        status: "active",
        category: "Specialized Care"
      },
    ],
    inactive: [
      {
        id: "3",
        name: "Weekend Care Special",
        price: 15000,
        duration: "Weekend",
        bookings: 5,
        rating: 4.6,
        status: "inactive",
        category: "Part-time Care"
      },
    ],
    draft: [
      {
        id: "4",
        name: "Dementia Care Advanced",
        price: 45000,
        duration: "Monthly",
        bookings: 0,
        rating: 0,
        status: "draft",
        category: "Specialized Care"
      },
    ]
  };

  const stats = {
    total: 15,
    active: 10,
    inactive: 3,
    draft: 2
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 style={{ color: '#535353' }}>Package Management</h1>
            <p style={{ color: '#848484' }}>{stats.total} packages</p>
          </div>
          <Button
            onClick={onCreatePackage}
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              color: 'white'
            }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Package
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="finance-card p-4 text-center">
            <p className="text-2xl mb-1" style={{ color: '#7CE577' }}>{stats.active}</p>
            <p className="text-sm" style={{ color: '#848484' }}>Active</p>
          </div>
          <div className="finance-card p-4 text-center">
            <p className="text-2xl mb-1" style={{ color: '#848484' }}>{stats.inactive}</p>
            <p className="text-sm" style={{ color: '#848484' }}>Inactive</p>
          </div>
          <div className="finance-card p-4 text-center">
            <p className="text-2xl mb-1" style={{ color: '#FFD180' }}>{stats.draft}</p>
            <p className="text-sm" style={{ color: '#848484' }}>Draft</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto mb-6">
          {[
            { id: 'active', label: 'Active', count: stats.active },
            { id: 'inactive', label: 'Inactive', count: stats.inactive },
            { id: 'draft', label: 'Draft', count: stats.draft },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap"
              style={{
                background: activeTab === tab.id 
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                  : 'rgba(255, 255, 255, 0.5)',
                color: activeTab === tab.id ? 'white' : '#535353'
              }}
            >
              <span className="text-sm">{tab.label}</span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{
                background: activeTab === tab.id ? 'rgba(255, 255, 255, 0.3)' : 'rgba(132, 132, 132, 0.2)'
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Packages List */}
        <div className="space-y-3">
          {packages[activeTab].map((pkg) => (
            <div key={pkg.id} className="finance-card p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: pkg.status === 'active'
                        ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                        : pkg.status === 'draft'
                        ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
                        : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #848484 0%, #B0B0B0 100%)'
                    }}
                  >
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1" style={{ color: '#535353' }}>{pkg.name}</h3>
                    <p className="text-sm mb-2" style={{ color: '#848484' }}>{pkg.category}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span style={{ color: '#535353' }}>৳{pkg.price.toLocaleString()}/{pkg.duration}</span>
                      {pkg.status !== 'draft' && (
                        <>
                          <span style={{ color: '#848484' }}>{pkg.bookings} bookings</span>
                          {pkg.rating > 0 && (
                            <span style={{ color: '#FFD54F' }}>★ {pkg.rating}</span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onToggleStatus(pkg.id)}
                  className="shrink-0"
                >
                  {pkg.status === 'active' ? (
                    <ToggleRight className="w-10 h-10" style={{ color: '#7CE577' }} />
                  ) : (
                    <ToggleLeft className="w-10 h-10" style={{ color: '#848484' }} />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => onViewPackage(pkg.id)}
                  className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-sm"
                  style={{ background: 'rgba(142, 197, 252, 0.2)', color: '#5B9FFF' }}
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => onEditPackage(pkg.id)}
                  className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-sm"
                  style={{ background: 'rgba(255, 211, 128, 0.2)', color: '#FFB74D' }}
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-sm"
                  style={{ background: 'rgba(168, 224, 99, 0.2)', color: '#7CE577' }}
                >
                  <Copy className="w-4 h-4" />
                  Clone
                </button>
                <button
                  onClick={() => onDeletePackage(pkg.id)}
                  className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-sm"
                  style={{ background: 'rgba(255, 107, 122, 0.2)', color: '#FF6B7A' }}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {packages[activeTab].length === 0 && (
          <div className="text-center py-12 finance-card">
            <Package className="w-12 h-12 mx-auto mb-4" style={{ color: '#848484' }} />
            <p style={{ color: '#535353' }}>No {activeTab} packages</p>
            <p className="text-sm mb-6" style={{ color: '#848484' }}>
              {activeTab === 'draft' 
                ? "Create a new package to get started"
                : `No packages in ${activeTab} status`
              }
            </p>
            {activeTab === 'draft' && (
              <Button
                onClick={onCreatePackage}
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                  color: 'white'
                }}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create First Package
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
