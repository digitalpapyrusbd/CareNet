'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function PackageFiltersPage() {
  const router = useRouter();
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);

  const categories = [
    'Full-time Care', 'Part-time Care', 'Specialized Care', 
    'Post-Surgery Care', 'Dementia Care', 'Palliative Care'
  ];

  const services = [
    'Vital Monitoring', 'Medication Management', 'Mobility Support',
    'Meal Preparation', 'Physical Therapy', 'Wound Care', 'Personal Care'
  ];

  const handleApply = () => {
    console.log('Applying filters:', {
      priceRange,
      categories: selectedCategories,
      services: selectedServices,
      minRating
    });
    router.push('/guardian/packages');
  };

  const handleReset = () => {
    setPriceRange([0, 100000]);
    setSelectedCategories([]);
    setSelectedServices([]);
    setMinRating(0);
  };

  return (
    <>
      <UniversalNav userRole="guardian" showBack={true} />
      <div className="min-h-screen p-6 pb-24 md:pt-14">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 hover:bg-white/30"
            style={{ color: '#535353' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" style={{ color: '#5B9FFF' }} />
            <h2 style={{ color: '#535353' }}>Filters</h2>
          </div>
        </div>

        {/* Filter Card */}
        <div className="finance-card p-6">
          <div className="space-y-6">
            {/* Price Range */}
            <div>
              <Label className="mb-3 block" style={{ color: '#535353' }}>
                Price Range: ৳{priceRange[0].toLocaleString()} - ৳{priceRange[1].toLocaleString()}
              </Label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={100000}
                step={1000}
                className="mb-2"
              />
            </div>

            {/* Categories */}
            <div>
              <Label className="mb-3 block" style={{ color: '#535353' }}>Category</Label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center gap-2">
                    <Checkbox
                      id={`cat-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategories([...selectedCategories, category]);
                        } else {
                          setSelectedCategories(selectedCategories.filter(c => c !== category));
                        }
                      }}
                    />
                    <label htmlFor={`cat-${category}`} className="text-sm cursor-pointer" style={{ color: '#535353' }}>
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <Label className="mb-3 block" style={{ color: '#535353' }}>Services Included</Label>
              <div className="space-y-2">
                {services.map((service) => (
                  <div key={service} className="flex items-center gap-2">
                    <Checkbox
                      id={`srv-${service}`}
                      checked={selectedServices.includes(service)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedServices([...selectedServices, service]);
                        } else {
                          setSelectedServices(selectedServices.filter(s => s !== service));
                        }
                      }}
                    />
                    <label htmlFor={`srv-${service}`} className="text-sm cursor-pointer" style={{ color: '#535353' }}>
                      {service}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <Label className="mb-3 block" style={{ color: '#535353' }}>Minimum Rating</Label>
              <div className="flex gap-2">
                {[0, 3, 4, 4.5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className="flex-1 py-2 px-3 rounded-lg text-sm transition-colors"
                    style={{
                      background: minRating === rating 
                        ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                        : 'rgba(255, 255, 255, 0.5)',
                      color: minRating === rating ? 'white' : '#535353'
                    }}
                  >
                    {rating === 0 ? 'Any' : `${rating}+ ★`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-6 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}>
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex-1 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            >
              Reset
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                color: 'white'
              }}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
    </>

  );
}
