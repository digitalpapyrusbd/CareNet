'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Upload, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function AddPatientPage() {
  const { t } = useTranslationContext();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    bloodGroup: '',
    photo: null as File | null,
    medicalConditions: [] as string[],
    allergies: '',
    mobilityLevel: '',
    cognitiveStatus: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  const [conditionInput, setConditionInput] = useState('');

  const medicalConditionOptions = [
    'Diabetes', 'Hypertension', 'Heart Disease', 'Stroke', 'Dementia', 
    'Alzheimer\'s', 'Parkinson\'s', 'Arthritis', 'Cancer', 'COPD'
  ];

  const addCondition = (condition: string) => {
    if (condition && !formData.medicalConditions.includes(condition)) {
      setFormData({
        ...formData,
        medicalConditions: [...formData.medicalConditions, condition]
      });
    }
    setConditionInput('');
  };

  const removeCondition = (condition: string) => {
    setFormData({
      ...formData,
      medicalConditions: formData.medicalConditions.filter(c => c !== condition)
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, photo: e.target.files[0] });
    }
  };

  const handleSubmit = () => {
    console.log('Saving patient:', formData);
    router.push('/guardian/dashboard');
  };

  const canSubmit = formData.name && formData.dob && formData.gender && formData.address && formData.emergencyContact && formData.emergencyPhone;

  return (
    <>
      <UniversalNav userRole="guardian" showBack={true} />
      <div className="min-h-screen p-6 pb-24 md:pt-14">
      <div className="max-w-2xl mx-auto">
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

          <h2 style={{ color: '#535353' }}>{t('page.heading.addnewpatient')}</h2>
        </div>

        {/* Form Card */}
        <div className="finance-card p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" style={{ color: '#535353' }}>Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('page.placeholder.enterpatientname')}
                  className="bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob" style={{ color: '#535353' }}>Date of Birth *</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender" style={{ color: '#535353' }}>Gender *</Label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full p-3 rounded-lg border"
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    background: 'rgba(255, 255, 255, 0.5)',
                    color: '#535353'
                  }}
                >
                  <option value="">{t('page.text.selectgender')}</option>
                  <option value="male">{t('page.text.male2')}</option>
                  <option value="female">{t('page.text.female2')}</option>
                  <option value="other">{t('page.text.other2')}</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodGroup" style={{ color: '#535353' }}>{t('page.text.bloodgroup')}</Label>
                <select
                  id="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full p-3 rounded-lg border"
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    background: 'rgba(255, 255, 255, 0.5)',
                    color: '#535353'
                  }}
                >
                  <option value="">{t('page.text.selectbloodgroup')}</option>
                  <option value="A+">A+</option>
                  <option value="A-">{t('page.text.a1')}</option>
                  <option value="B+">B+</option>
                  <option value="B-">{t('page.text.b1')}</option>
                  <option value="O+">O+</option>
                  <option value="O-">{t('page.text.o1')}</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">{t('page.text.ab1')}</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo" style={{ color: '#535353' }}>{t('page.text.profilephoto')}</Label>
              <label
                htmlFor="photo"
                className="flex items-center justify-center gap-2 p-4 rounded-lg border cursor-pointer hover:bg-white/30 transition-colors"
                style={{ borderColor: 'rgba(255, 255, 255, 0.5)', background: 'rgba(255, 255, 255, 0.5)' }}
              >
                <Upload className="w-5 h-5" style={{ color: '#848484' }} />
                <span className="text-sm" style={{ color: '#535353' }}>
                  {formData.photo ? formData.photo.name : 'Upload Photo'}
                </span>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-2">
              <Label style={{ color: '#535353' }}>{t('page.text.medicalconditions1')}</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={conditionInput}
                  onChange={(e) => setConditionInput(e.target.value)}
                  placeholder={t('page.placeholder.typeorselectconditio')}
                  className="bg-white/50 border-white/50 flex-1"
                  style={{ color: '#535353' }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCondition(conditionInput);
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => addCondition(conditionInput)}
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
                    color: 'white'
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Quick Select */}
              <div className="flex flex-wrap gap-2">
                {medicalConditionOptions.map((condition) => (
                  <button
                    key={condition}
                    type="button"
                    onClick={() => addCondition(condition)}
                    className="text-xs px-3 py-1 rounded-full transition-colors"
                    style={{
                      background: formData.medicalConditions.includes(condition)
                        ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                        : 'rgba(255, 255, 255, 0.5)',
                      color: formData.medicalConditions.includes(condition) ? 'white' : '#535353',
                      border: '1px solid rgba(255, 255, 255, 0.5)'
                    }}
                  >
                    {condition}
                  </button>
                ))}
              </div>

              {/* Selected Conditions */}
              {formData.medicalConditions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.medicalConditions.map((condition) => (
                    <span
                      key={condition}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                      style={{
                        background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                        color: 'white'
                      }}
                    >
                      {condition}
                      <button
                        type="button"
                        onClick={() => removeCondition(condition)}
                        className="ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies" style={{ color: '#535353' }}>{t('page.text.allergies2')}</Label>
              <Textarea
                id="allergies"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                placeholder={t('page.placeholder.listanyallergiesmedi')}
                className="bg-white/50 border-white/50 min-h-20"
                style={{ color: '#535353' }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mobility" style={{ color: '#535353' }}>{t('page.text.mobilitylevel')}</Label>
                <select
                  id="mobility"
                  value={formData.mobilityLevel}
                  onChange={(e) => setFormData({ ...formData, mobilityLevel: e.target.value })}
                  className="w-full p-3 rounded-lg border"
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    background: 'rgba(255, 255, 255, 0.5)',
                    color: '#535353'
                  }}
                >
                  <option value="">{t('page.text.selectmobilitylevel')}</option>
                  <option value="independent">{t('page.text.independent')}</option>
                  <option value="assisted">{t('page.text.needsassistance')}</option>
                  <option value="wheelchair">{t('page.text.wheelchair')}</option>
                  <option value="bedridden">{t('page.text.bedridden')}</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cognitive" style={{ color: '#535353' }}>{t('page.text.cognitivestatus1')}</Label>
                <select
                  id="cognitive"
                  value={formData.cognitiveStatus}
                  onChange={(e) => setFormData({ ...formData, cognitiveStatus: e.target.value })}
                  className="w-full p-3 rounded-lg border"
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    background: 'rgba(255, 255, 255, 0.5)',
                    color: '#535353'
                  }}
                >
                  <option value="">{t('page.text.selectcognitivestatu')}</option>
                  <option value="normal">{t('page.text.normal')}</option>
                  <option value="mild">{t('page.text.mildimpairment')}</option>
                  <option value="moderate">{t('page.text.moderateimpairment')}</option>
                  <option value="severe">{t('page.text.severeimpairment')}</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" style={{ color: '#535353' }}>Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder={t('page.placeholder.enterfulladdress')}
                className="bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact" style={{ color: '#535353' }}>Emergency Contact Name *</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  placeholder={t('page.placeholder.contactpersonname')}
                  className="bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyPhone" style={{ color: '#535353' }}>Emergency Phone *</Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  placeholder={t('page.placeholder.01xxxxxxxxx5')}
                  className="bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex-1 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="flex-1"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)',
                color: 'white',
                border: 'none',
                opacity: canSubmit ? 1 : 0.5
              }}
            >
              Save Patient
            </Button>
          </div>
        </div>
      </div>
    </div>
    </>

  );
}
