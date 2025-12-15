import { Search, User, Star, MapPin, Briefcase, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

interface Caregiver {
  id: string;
  name: string;
  photo?: string;
  rating: number;
  experience: number;
  specializations: string[];
  location: string;
  availability: 'available' | 'busy' | 'unavailable';
  jobsCompleted: number;
}

interface CaregiverPoolSearchProps {
  caregivers: Caregiver[];
  onViewProfile: (id: string) => void;
  onSendOffer: (id: string) => void;
}

export function CaregiverPoolSearch({ caregivers, onViewProfile, onSendOffer }: CaregiverPoolSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    availability: 'all',
    minRating: 0,
    minExperience: 0
  });

  const filteredCaregivers = caregivers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.specializations.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesAvailability = filters.availability === 'all' || c.availability === filters.availability;
    const matchesRating = c.rating >= filters.minRating;
    const matchesExperience = c.experience >= filters.minExperience;
    return matchesSearch && matchesAvailability && matchesRating && matchesExperience;
  });

  const getAvailabilityColor = (status: string) => {
    switch(status) {
      case 'available': return { bg: 'rgba(124, 229, 119, 0.2)', text: '#7CE577' };
      case 'busy': return { bg: 'rgba(255, 209, 128, 0.2)', text: '#FFD180' };
      case 'unavailable': return { bg: 'rgba(255, 107, 122, 0.2)', text: '#FF6B7A' };
      default: return { bg: 'rgba(255, 255, 255, 0.2)', text: '#848484' };
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Caregiver Pool</h1>

        <div className="finance-card p-4 mb-6">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#848484' }} />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or specialization..."
              className="pl-10 bg-white/50 border-white/50"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {['all', 'available', 'busy'].map((status) => (
              <button key={status} onClick={() => setFilters(prev => ({ ...prev, availability: status }))}
                className="px-3 py-1 rounded-lg capitalize text-xs whitespace-nowrap" style={{
                  background: filters.availability === status ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' : 'rgba(255, 255, 255, 0.5)',
                  color: filters.availability === status ? 'white' : '#535353'
                }}>
                {status}
              </button>
            ))}
          </div>
        </div>

        {filteredCaregivers.length === 0 ? (
          <div className="finance-card p-8 text-center">
            <User className="w-16 h-16 mx-auto mb-4" style={{ color: '#848484' }} />
            <p style={{ color: '#848484' }}>No caregivers found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCaregivers.map((caregiver) => {
              const availabilityStyle = getAvailabilityColor(caregiver.availability);
              return (
                <div key={caregiver.id} className="finance-card p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
                      {caregiver.photo ? (
                        <img src={caregiver.photo} alt={caregiver.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <User className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h3 style={{ color: '#535353' }}>{caregiver.name}</h3>
                          <div className="flex items-center gap-2 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current"
                                style={{ color: i < caregiver.rating ? '#FFD54F' : '#E0E0E0' }} />
                            ))}
                            <span className="text-xs" style={{ color: '#535353' }}>{caregiver.rating}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs" style={{ color: '#848484' }}>
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {caregiver.experience}y exp
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {caregiver.location}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full capitalize"
                          style={{ background: availabilityStyle.bg, color: availabilityStyle.text }}>
                          {caregiver.availability}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {caregiver.specializations.map((spec, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full"
                        style={{ background: 'rgba(142, 197, 252, 0.2)', color: '#5B9FFF' }}>
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => onViewProfile(caregiver.id)} size="sm" variant="outline"
                      className="flex-1 bg-white/50 border-white/50">
                      <Eye className="w-4 h-4 mr-2" />View Profile
                    </Button>
                    {caregiver.availability === 'available' && (
                      <Button onClick={() => onSendOffer(caregiver.id)} size="sm" className="flex-1"
                        style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
                        Send Offer
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

