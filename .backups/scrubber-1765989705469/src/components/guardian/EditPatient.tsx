import { ArrowLeft, Save, User, Phone, Calendar, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { useTranslationContext } from '@/components/providers/TranslationProvider';

interface EditPatientProps {
  patientId: string;
  initialData: {
    name: string;
    age: number;
    gender: string;
    phone: string;
    address: string;
    medicalConditions: string;
    medications: string;
    allergies: string;
    emergencyContact: string;
    emergencyPhone: string;
  };
  onSave: (data: any) => void;
  onBack: () => void;
}

export function EditPatient({ patientId, initialData, onSave, onBack }: EditPatientProps) {
  const { t } = useTranslationContext();
  const [name, setName] = useState(initialData.name);
  const [age, setAge] = useState(initialData.age.toString());
  const [gender, setGender] = useState(initialData.gender);
  const [phone, setPhone] = useState(initialData.phone);
  const [address, setAddress] = useState(initialData.address);
  const [medicalConditions, setMedicalConditions] = useState(initialData.medicalConditions);
  const [medications, setMedications] = useState(initialData.medications);
  const [allergies, setAllergies] = useState(initialData.allergies);
  const [emergencyContact, setEmergencyContact] = useState(initialData.emergencyContact);
  const [emergencyPhone, setEmergencyPhone] = useState(initialData.emergencyPhone);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      age: parseInt(age),
      gender,
      phone,
      address,
      medicalConditions,
      medications,
      allergies,
      emergencyContact,
      emergencyPhone
    });
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 hover:bg-white/30"
          style={{ color: '#535353' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="max-w-2xl mx-auto">
          <h1 className="mb-6" style={{ color: '#535353' }}>{t('editpatient.heading.editpatientprofile')}</h1>

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
                <h2 style={{ color: '#535353' }}>{t('editpatient.heading.basicinformation')}</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
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
                    <Label htmlFor="age">Age *</Label>
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
                    <Label htmlFor="gender">Gender *</Label>
                    <select
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full mt-2 px-3 py-2 rounded-lg bg-white/50 border border-white/50"
                      style={{ color: '#535353' }}
                      required
                    >
                      <option value="male">{t('editpatient.text.male')}</option>
                      <option value="female">{t('editpatient.text.female')}</option>
                      <option value="other">{t('editpatient.text.other')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">{t('editpatient.text.phonenumber')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('editpatient.placeholder.8801xxxxxxxxx')}
                    className="mt-2 bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
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
              <h3 className="mb-4" style={{ color: '#535353' }}>{t('editpatient.heading.medicalinformation')}</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="conditions">{t('editpatient.text.medicalconditions')}</Label>
                  <Textarea
                    id="conditions"
                    value={medicalConditions}
                    onChange={(e) => setMedicalConditions(e.target.value)}
                    placeholder={t('editpatient.placeholder.diabeteshypertension')}
                    className="mt-2 bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                </div>

                <div>
                  <Label htmlFor="medications">{t('editpatient.text.currentmedications')}</Label>
                  <Textarea
                    id="medications"
                    value={medications}
                    onChange={(e) => setMedications(e.target.value)}
                    placeholder={t('editpatient.placeholder.metformin500mgamlodi')}
                    className="mt-2 bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                </div>

                <div>
                  <Label htmlFor="allergies">{t('editpatient.text.allergies')}</Label>
                  <Textarea
                    id="allergies"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder={t('editpatient.placeholder.penicillinpeanutsetc')}
                    className="mt-2 bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="finance-card p-6">
              <h3 className="mb-4" style={{ color: '#535353' }}>{t('editpatient.heading.emergencycontact')}</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="emergencyContact">Contact Name *</Label>
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
                  <Label htmlFor="emergencyPhone">Contact Phone *</Label>
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
                onClick={onBack}
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
  );
}
