'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, User, Phone, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function EditPatientPage() {
  const { t } = useTranslationContext();
  const router = useRouter();
  
  const [name, setName] = useState('Mrs. Fatima Ahmed');
  const [age, setAge] = useState('72');
  const [gender, setGender] = useState('female');
  const [phone, setPhone] = useState('+880 1712-345678');
  const [address, setAddress] = useState('House 45, Road 12, Dhanmondi, Dhaka');
  const [medicalConditions, setMedicalConditions] = useState('Diabetes Type 2, Hypertension, Arthritis');
  const [medications, setMedications] = useState('Metformin 500mg, Amlodipine 5mg');
  const [allergies, setAllergies] = useState('Penicillin, Aspirin');
  const [emergencyContact, setEmergencyContact] = useState('Abdul Ahmed (Son)');
  const [emergencyPhone, setEmergencyPhone] = useState('+880 1712-345678');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.back();
  };

  return (
    <>
      <UniversalNav userRole="guardian" showBack={true} />
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

        <div className="max-w-2xl mx-auto">
          <h1 className="mb-6" style={{ color: '#535353' }}>{t('page.heading.editpatientprofile')}</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="finance-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                  }}
                >
                  <User className="w-6 h-6 text-white" />
                </div>
                <h2 style={{ color: '#535353' }}>{t('page.heading.basicinformation1')}</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" style={{ color: '#535353' }}>Full Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-2 bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age" style={{ color: '#535353' }}>Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                      className="mt-2 bg-white/50 border-white/50"
                      style={{ color: '#535353' }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="gender" style={{ color: '#535353' }}>Gender *</Label>
                    <select
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full mt-2 px-3 py-2 rounded-lg bg-white/50 border border-white/50"
                      style={{ color: '#535353' }}
                      required
                      aria-label={t('page.label.gender')}
                    >
                      <option value="male">{t('page.text.male1')}</option>
                      <option value="female">{t('page.text.female1')}</option>
                      <option value="other">{t('page.text.other1')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" style={{ color: '#535353' }}>{t('page.text.phonenumber3')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('page.placeholder.8801xxxxxxxxx')}
                    className="mt-2 bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                </div>

                <div>
                  <Label htmlFor="address" style={{ color: '#535353' }}>Address *</Label>
                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="mt-2 bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="finance-card p-6">
              <h3 className="mb-4" style={{ color: '#535353' }}>{t('page.heading.medicalinformation')}</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="conditions" style={{ color: '#535353' }}>{t('page.text.medicalconditions')}</Label>
                  <Textarea
                    id="conditions"
                    value={medicalConditions}
                    onChange={(e) => setMedicalConditions(e.target.value)}
                    placeholder={t('page.placeholder.diabeteshypertension')}
                    className="mt-2 bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                </div>

                <div>
                  <Label htmlFor="medications" style={{ color: '#535353' }}>{t('page.text.currentmedications')}</Label>
                  <Textarea
                    id="medications"
                    value={medications}
                    onChange={(e) => setMedications(e.target.value)}
                    placeholder={t('page.placeholder.metformin500mgamlodi')}
                    className="mt-2 bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                </div>

                <div>
                  <Label htmlFor="allergies" style={{ color: '#535353' }}>{t('page.text.allergies')}</Label>
                  <Textarea
                    id="allergies"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder={t('page.placeholder.penicillinpeanutsetc')}
                    className="mt-2 bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="finance-card p-6">
              <h3 className="mb-4" style={{ color: '#535353' }}>{t('page.heading.emergencycontact')}</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="emergencyContact" style={{ color: '#535353' }}>Contact Name *</Label>
                  <Input
                    id="emergencyContact"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    required
                    className="mt-2 bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                </div>

                <div>
                  <Label htmlFor="emergencyPhone" style={{ color: '#535353' }}>Contact Phone *</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    required
                    className="mt-2 bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => router.back()}
                variant="outline"
                className="flex-1 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              >
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
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>

  );
}
