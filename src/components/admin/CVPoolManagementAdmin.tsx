import { Users, Search, Filter, Eye, UserX } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

interface CVPoolManagementAdminProps {
  caregivers: {
    id: string;
    name: string;
    phone: string;
    specializations: string[];
    experience: string;
    rating: number;
    totalJobs: number;
    availability: 'available' | 'busy' | 'unavailable';
    verifiedDate: string;
  }[];
  onViewProfile: (caregiverId: string) => void;
  onRemoveFromPool: (caregiverId: string) => void;
}

export function CVPoolManagementAdmin({ caregivers, onViewProfile, onRemoveFromPool }: CVPoolManagementAdminProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return '#7CE577';
      case 'busy': return '#FFD180';
      default: return '#FF8FA3';
    }
  };

  const filteredCaregivers = caregivers.filter(cg => {
    if (availabilityFilter !== 'all' && cg.availability !== availabilityFilter) return false;
    if (searchTerm && !cg.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !cg.phone.includes(searchTerm)) return false;
    return true;
  });

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="mb-6" style={{ color: '#535353' }}>CV Pool Management</h1>

        {/* Filters */}
        <div className="finance-card p-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#848484' }} />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or phone..."
                className="pl-10 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <div>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full p-3 rounded-lg border"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  background: 'rgba(255, 255, 255, 0.5)',
                  color: '#535353'
                }}
              >
                <option value="all">All Availability</option>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>
        </div>

        {/* Caregivers List */}
        <div className="space-y-4">
          {filteredCaregivers.map((caregiver) => (
            <div key={caregiver.id} className="finance-card p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 style={{ color: '#535353' }}>{caregiver.name}</h3>
                    <span className="px-2 py-1 rounded-full text-xs capitalize"
                      style={{
                        background: `${getAvailabilityColor(caregiver.availability)}33`,
                        color: getAvailabilityColor(caregiver.availability)
                      }}>
                      {caregiver.availability}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-sm" style={{ color: '#848484' }}>Phone</p>
                      <p style={{ color: '#535353' }}>{caregiver.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: '#848484' }}>Experience</p>
                      <p style={{ color: '#535353' }}>{caregiver.experience}</p>
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: '#848484' }}>Rating</p>
                      <p style={{ color: '#535353' }}>{caregiver.rating} ⭐ ({caregiver.totalJobs} jobs)</p>
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: '#848484' }}>Verified</p>
                      <p style={{ color: '#535353' }}>{caregiver.verifiedDate}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {caregiver.specializations.map((spec, index) => (
                      <span key={index} className="px-2 py-1 rounded-full text-xs"
                        style={{ background: 'rgba(142, 197, 252, 0.2)', color: '#5B9FFF' }}>
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => onViewProfile(caregiver.id)}
                    variant="outline"
                    className="bg-white/50 border-white/50"
                  >
                    <Eye className="w-4 h-4 mr-2" />View
                  </Button>
                  <Button
                    onClick={() => onRemoveFromPool(caregiver.id)}
                    variant="outline"
                    className="bg-white/50 border-white/50"
                  >
                    <UserX className="w-4 h-4 mr-2" />Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {filteredCaregivers.length === 0 && (
            <div className="finance-card p-12 text-center">
              <Users className="w-12 h-12 mx-auto mb-4" style={{ color: '#848484' }} />
              <p style={{ color: '#848484' }}>No caregivers match your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

