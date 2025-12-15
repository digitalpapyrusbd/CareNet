'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, MapPin, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function BrowsePackagesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const packages = [
    {
      id: '1',
      name: '24/7 Senior Care - Basic',
      agency: 'Green Care Agency',
      agencyLogo: null,
      price: 35000,
      duration: '30 days',
      rating: 4.8,
      reviews: 124,
      location: 'Dhanmondi, Dhaka',
      services: ['Daily Vital Monitoring', 'Medication Management', 'Meal Assistance', 'Mobility Support'],
      category: 'Full-time Care'
    },
    {
      id: '2',
      name: 'Post-Surgery Care Package',
      agency: 'MediCare Services',
      agencyLogo: null,
      price: 28000,
      duration: '15 days',
      rating: 4.9,
      reviews: 89,
      location: 'Gulshan, Dhaka',
      services: ['Wound Care', 'Physical Therapy', 'Pain Management', 'Recovery Monitoring'],
      category: 'Specialized Care'
    },
    {
      id: '3',
      name: 'Dementia Care - Advanced',
      agency: 'Heart & Soul Caregivers',
      agencyLogo: null,
      price: 45000,
      duration: '30 days',
      rating: 4.7,
      reviews: 67,
      location: 'Banani, Dhaka',
      services: ['Memory Activities', 'Behavioral Management', '24/7 Supervision', 'Family Training'],
      category: 'Specialized Care'
    },
  ];

  return (
    <>
      <UniversalNav userRole="guardian" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
      {/* Header */}
      <div className="p-6">
        <h1 className="mb-2" style={{ color: '#535353' }}>Browse Packages</h1>
        <p style={{ color: '#848484' }}>Find the perfect care package for your loved one</p>
      </div>

      {/* Search and Filter */}
      <div className="px-6 mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#848484' }} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search packages..."
              className="pl-10 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
          </div>
          <Button
            onClick={() => router.push('/guardian/packages/filters')}
            variant="outline"
            className="bg-white/50 border-white/50"
            style={{ color: '#535353' }}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Packages List */}
      <div className="px-6 space-y-4">
        {packages.map((pkg) => (
          <button
            key={pkg.id}
            onClick={() => router.push(`/guardian/packages/${pkg.id}`)}
            className="w-full finance-card p-4 hover:shadow-lg transition-all text-left"
          >
            {/* Agency Header */}
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                }}
              >
                <span className="text-white text-sm">{pkg.agency.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm" style={{ color: '#535353' }}>{pkg.agency}</p>
                <div className="flex items-center gap-2 text-xs" style={{ color: '#848484' }}>
                  <MapPin className="w-3 h-3" />
                  <span>{pkg.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-current" style={{ color: '#FFD54F' }} />
                <span className="text-sm" style={{ color: '#535353' }}>{pkg.rating}</span>
                <span className="text-xs" style={{ color: '#848484' }}>({pkg.reviews})</span>
              </div>
            </div>

            {/* Package Info */}
            <h3 className="mb-2" style={{ color: '#535353' }}>{pkg.name}</h3>
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{ background: 'rgba(142, 197, 252, 0.3)', color: '#535353' }}
              >
                {pkg.category}
              </span>
              <span className="text-sm" style={{ color: '#848484' }}>
                {pkg.duration}
              </span>
            </div>

            {/* Services */}
            <div className="flex flex-wrap gap-1 mb-3">
              {pkg.services.slice(0, 3).map((service, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ background: 'rgba(255, 255, 255, 0.7)', color: '#535353' }}
                >
                  {service}
                </span>
              ))}
              {pkg.services.length > 3 && (
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ background: 'rgba(255, 255, 255, 0.7)', color: '#848484' }}
                >
                  +{pkg.services.length - 3} more
                </span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}>
              <div>
                <p className="text-sm" style={{ color: '#848484' }}>Starting from</p>
                <p className="text-lg" style={{ color: '#535353' }}>৳{pkg.price.toLocaleString()}</p>
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/guardian/packages/${pkg.id}`);
                }}
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                  color: 'white'
                }}
              >
                View Details
              </Button>
            </div>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {packages.length === 0 && (
        <div className="px-6 py-12 text-center">
          <Heart className="w-12 h-12 mx-auto mb-4" style={{ color: '#848484' }} />
          <p style={{ color: '#535353' }}>No packages found</p>
          <p className="text-sm" style={{ color: '#848484' }}>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
    </>

  );
}
