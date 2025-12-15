'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Plus, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function ModeratorCaregiverSubscriptionCreatorPage() {
  const router = useRouter();
  const [packageName, setPackageName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('monthly');
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // Handle subscription package creation
    console.log('Creating caregiver subscription package:', { packageName, price, duration, features });
    router.back();
  };

  return (
    <>
      <UniversalNav userRole="moderator" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
        <div className="p-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 hover:bg-white/30"
            style={{ color: '#535353' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="mb-6">
            <h1 className="mb-2" style={{ color: '#535353' }}>Create Caregiver Subscription Package</h1>
            <p style={{ color: '#848484' }}>Define subscription plans for caregivers</p>
          </div>

          <div className="finance-card p-6 mb-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="packageName" style={{ color: '#535353' }}>Package Name *</Label>
                <Input
                  id="packageName"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  placeholder="E.g., Caregiver Pro, Caregiver Premium"
                  className="mt-2 bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" style={{ color: '#535353' }}>Price (BDT) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="1000"
                    className="mt-2 bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                </div>

                <div>
                  <Label htmlFor="duration" style={{ color: '#535353' }}>Duration *</Label>
                  <select
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="mt-2 w-full p-2 rounded-lg bg-white/50 border border-white/50"
                    style={{ color: '#535353' }}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div>
                <Label style={{ color: '#535353' }}>Features *</Label>
                <div className="mt-2 flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                    placeholder="Add feature (e.g., Priority job matching)"
                    className="bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                  <Button
                    onClick={addFeature}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="mt-3 space-y-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white/30 rounded">
                      <span style={{ color: '#535353' }}>{feature}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-4 h-4" style={{ color: '#848484' }} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-blue-500 hover:bg-blue-600"
            >
              <Save className="w-4 h-4 mr-2" />
              Create Package
            </Button>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
