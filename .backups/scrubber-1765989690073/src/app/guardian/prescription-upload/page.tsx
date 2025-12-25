'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

import { useRouter } from 'next/navigation';
import { Upload, Camera, FileText, X, Check, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function PrescriptionUploadPage() {
  const { t } = useTranslationContext();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isScanned, setIsScanned] = useState(false);
  const [medications, setMedications] = useState<Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    editable: boolean;
  }>>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleScanWithAI = () => {
    setIsScanning(true);
    setTimeout(() => {
      setMedications([
        { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days', editable: true },
        { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days', editable: true },
        { name: 'Aspirin', dosage: '75mg', frequency: 'Once daily', duration: '30 days', editable: true },
      ]);
      setIsScanning(false);
      setIsScanned(true);
    }, 2000);
  };

  const updateMedication = (index: number, field: string, value: string) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  return (
    <>
      <UniversalNav userRole="guardian" showBack={true} />
      <div className="min-h-screen p-6 pb-24 md:pt-14">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 hover:bg-white/30"
          style={{ color: '#535353' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="finance-card p-6">
          <h2 className="mb-6" style={{ color: '#535353' }}>{t('page.heading.uploadprescription')}</h2>

          {/* Upload Area */}
          {!file && (
            <div className="space-y-3 mb-6">
              <label
                className="flex flex-col items-center justify-center gap-3 p-8 rounded-lg border-2 border-dashed cursor-pointer hover:bg-white/30 transition-colors"
                style={{ borderColor: 'rgba(255, 255, 255, 0.5)', background: 'rgba(255, 255, 255, 0.3)' }}
              >
                <Upload className="w-12 h-12" style={{ color: '#848484' }} />
                <div className="text-center">
                  <p style={{ color: '#535353' }}>{t('page.text.clicktouploadprescri')}</p>
                  <p className="text-sm" style={{ color: '#848484' }}>PDF or Image (JPG, PNG)</p>
                </div>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div className="text-center text-sm" style={{ color: '#848484' }}>{t('page.text.or')}</div>

              <Button
                variant="outline"
                className="w-full bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              >
                <Camera className="w-5 h-5 mr-2" />
                Take Photo
              </Button>
            </div>
          )}

          {/* File Preview */}
          {file && !isScanned && (
            <div className="mb-6">
              <div className="finance-card p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                    }}
                  >
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p style={{ color: '#535353' }}>{file.name}</p>
                    <p className="text-sm" style={{ color: '#848484' }}>
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/50"
                    style={{ color: '#848484' }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <Button
                onClick={handleScanWithAI}
                disabled={isScanning}
                className="w-full"
                size="lg"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                  color: 'white',
                  opacity: isScanning ? 0.7 : 1
                }}
              >
                {isScanning ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                    Scanning with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Scan with AI
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Extracted Medications */}
          {isScanned && medications.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Check className="w-5 h-5" style={{ color: '#7CE577' }} />
                <h3 style={{ color: '#535353' }}>{t('page.heading.extractedmedications')}</h3>
              </div>

              <div className="space-y-3">
                {medications.map((med, index) => (
                  <div key={index} className="finance-card p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-xs mb-1 block" style={{ color: '#848484' }}>{t('page.text.medicationname')}</label>
                        <Input
                          value={med.name}
                          onChange={(e) => updateMedication(index, 'name', e.target.value)}
                          className="bg-white/50 border-white/50"
                          style={{ color: '#535353' }}
                        />
                      </div>
                      <div>
                        <label className="text-xs mb-1 block" style={{ color: '#848484' }}>{t('page.text.dosage')}</label>
                        <Input
                          value={med.dosage}
                          onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                          className="bg-white/50 border-white/50"
                          style={{ color: '#535353' }}
                        />
                      </div>
                      <div>
                        <label className="text-xs mb-1 block" style={{ color: '#848484' }}>{t('page.text.frequency')}</label>
                        <Input
                          value={med.frequency}
                          onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                          className="bg-white/50 border-white/50"
                          style={{ color: '#535353' }}
                        />
                      </div>
                      <div>
                        <label className="text-xs mb-1 block" style={{ color: '#848484' }}>{t('page.text.duration5')}</label>
                        <Input
                          value={med.duration}
                          onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                          className="bg-white/50 border-white/50"
                          style={{ color: '#535353' }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeMedication(index)}
                      className="text-sm flex items-center gap-1 hover:underline"
                      style={{ color: '#FF6B7A' }}
                    >
                      <X className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex-1 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => router.back()}
              disabled={!file || medications.length === 0}
              className="flex-1"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                color: 'white',
                opacity: (!file || medications.length === 0) ? 0.5 : 1
              }}
            >
              <Check className="w-5 h-5 mr-2" />
              Confirm & Save
            </Button>
          </div>
        </div>
      </div>
    </div>
    </>

  );
}
