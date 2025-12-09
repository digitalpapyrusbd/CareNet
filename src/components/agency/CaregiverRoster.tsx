import { Search, Plus, User, Star, CheckCircle, Clock, Filter } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

interface CaregiverRosterProps {
  onAddCaregiver: () => void;
  onSelectCaregiver: (id: string) => void;
  onFilterCaregivers: () => void;
}

export function CaregiverRoster({ onAddCaregiver, onSelectCaregiver, onFilterCaregivers }: CaregiverRosterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<'all' | 'available' | 'assigned' | 'inactive'>('all');

  const caregivers = {
    all: [
      {
        id: "1",
        name: "Rashida Begum",
        rating: 4.9,
        jobs: 45,
        status: "available",
        specializations: ["Senior Care", "Dementia"],
        verified: true
      },
      {
        id: "2",
        name: "Fatima Khatun",
        rating: 4.7,
        jobs: 32,
        status: "assigned",
        currentJob: "Mrs. Ahmed",
        specializations: ["Post-Surgery", "Mobility"],
        verified: true
      },
      {
        id: "3",
        name: "Ayesha Rahman",
        rating: 4.8,
        jobs: 28,
        status: "available",
        specializations: ["Palliative Care"],
        verified: true
      },
    ],
    available: [],
    assigned: [],
    inactive: []
  };

  const stats = {
    total: 24,
    available: 8,
    assigned: 12,
    inactive: 4
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 style={{ color: '#535353' }}>Caregiver Roster</h1>
            <p style={{ color: '#848484' }}>{stats.total} caregivers</p>
          </div>
          <Button
            onClick={onAddCaregiver}
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              color: 'white'
            }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Caregiver
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#848484' }} />
            <Input
              placeholder="Search by name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
          </div>
          <Button
            onClick={onFilterCaregivers}
            variant="outline"
            className="bg-white/50 border-white/50"
            style={{ color: '#535353' }}
          >
            <Filter className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="finance-card p-3 text-center">
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>{stats.total}</p>
            <p className="text-xs" style={{ color: '#848484' }}>Total</p>
          </div>
          <div className="finance-card p-3 text-center">
            <p className="text-2xl mb-1" style={{ color: '#7CE577' }}>{stats.available}</p>
            <p className="text-xs" style={{ color: '#848484' }}>Available</p>
          </div>
          <div className="finance-card p-3 text-center">
            <p className="text-2xl mb-1" style={{ color: '#FFD180' }}>{stats.assigned}</p>
            <p className="text-xs" style={{ color: '#848484' }}>Assigned</p>
          </div>
          <div className="finance-card p-3 text-center">
            <p className="text-2xl mb-1" style={{ color: '#848484' }}>{stats.inactive}</p>
            <p className="text-xs" style={{ color: '#848484' }}>Inactive</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto mb-6">
          {[
            { id: 'all', label: 'All', count: stats.total },
            { id: 'available', label: 'Available', count: stats.available },
            { id: 'assigned', label: 'Assigned', count: stats.assigned },
            { id: 'inactive', label: 'Inactive', count: stats.inactive },
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

        {/* Caregivers List */}
        <div className="space-y-3">
          {caregivers.all.map((caregiver) => (
            <button
              key={caregiver.id}
              onClick={() => onSelectCaregiver(caregiver.id)}
              className="w-full finance-card p-4 hover:shadow-lg transition-all text-left"
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center relative"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                  }}
                >
                  <User className="w-7 h-7 text-white" />
                  {caregiver.verified && (
                    <div 
                      className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: '#7CE577', border: '2px solid white' }}
                    >
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="mb-1" style={{ color: '#535353' }}>{caregiver.name}</h3>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-current" style={{ color: '#FFD54F' }} />
                          <span className="text-sm" style={{ color: '#535353' }}>{caregiver.rating}</span>
                        </div>
                        <span className="text-sm" style={{ color: '#848484' }}>{caregiver.jobs} jobs</span>
                      </div>
                    </div>
                    <span 
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        background: caregiver.status === 'available' 
                          ? 'rgba(124, 229, 119, 0.2)'
                          : caregiver.status === 'assigned'
                          ? 'rgba(255, 211, 128, 0.2)'
                          : 'rgba(132, 132, 132, 0.2)',
                        color: caregiver.status === 'available' 
                          ? '#7CE577'
                          : caregiver.status === 'assigned'
                          ? '#FFD180'
                          : '#848484'
                      }}
                    >
                      {caregiver.status === 'assigned' && caregiver.currentJob 
                        ? `Assigned: ${caregiver.currentJob}`
                        : caregiver.status
                      }
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {caregiver.specializations.map((spec, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ background: 'rgba(142, 197, 252, 0.2)', color: '#5B9FFF' }}
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
