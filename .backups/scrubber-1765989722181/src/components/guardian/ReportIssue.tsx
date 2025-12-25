import { AlertCircle, Send, Camera, X } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { useTranslationContext } from '@/components/providers/TranslationProvider';

interface ReportIssueProps {
  jobId: string;
  caregiverName: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function ReportIssue({ jobId, caregiverName, onSubmit, onCancel }: ReportIssueProps) {
  const { t } = useTranslationContext();
  const [category, setCategory] = useState("");
  const [severity, setSeverity] = useState("");
  const [description, setDescription] = useState("");
  const [evidence, setEvidence] = useState<File[]>([]);

  const categories = [
    "Unprofessional Behavior",
    "Late Arrival/No Show",
    "Poor Quality of Care",
    "Safety Concern",
    "Communication Issue",
    "Contract Violation",
    "Other"
  ];

  const severities = [
    { value: "low", label: "Low - Minor issue", color: "#FFD180" },
    { value: "medium", label: "Medium - Needs attention", color: "#FFB74D" },
    { value: "high", label: "High - Urgent", color: "#FF6B7A" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ category, severity, description, evidence, jobId });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onCancel} />

      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl finance-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF8FA3 100%)'
              }}
            >
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 style={{ color: '#535353' }}>{t('reportissue.heading.reportissue')}</h2>
              <p className="text-sm" style={{ color: '#848484' }}>Caregiver: {caregiverName}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/50"
            style={{ color: '#848484' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category */}
          <div>
            <Label style={{ color: '#535353' }}>Issue Category *</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className="text-sm px-3 py-2 rounded-lg text-left transition-colors"
                  style={{
                    background: category === cat 
                      ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF8FA3 100%)'
                      : 'rgba(255, 255, 255, 0.5)',
                    color: category === cat ? 'white' : '#535353'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Severity */}
          <div>
            <Label style={{ color: '#535353' }}>Severity Level *</Label>
            <div className="space-y-2 mt-2">
              {severities.map((sev) => (
                <button
                  key={sev.value}
                  type="button"
                  onClick={() => setSeverity(sev.value)}
                  className="w-full text-sm px-4 py-3 rounded-lg text-left flex items-center gap-3 transition-colors"
                  style={{
                    background: severity === sev.value 
                      ? `${sev.color}40`
                      : 'rgba(255, 255, 255, 0.5)',
                    borderLeft: severity === sev.value ? `4px solid ${sev.color}` : 'none'
                  }}
                >
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ background: sev.color }}
                  />
                  <span style={{ color: '#535353' }}>{sev.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" style={{ color: '#535353' }}>
              Detailed Description *
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('reportissue.placeholder.pleaseprovideasmuchd')}
              required
              className="mt-2 bg-white/50 border-white/50 min-h-32"
              style={{ color: '#535353' }}
            />
          </div>

          {/* Evidence */}
          <div>
            <Label style={{ color: '#535353' }}>Evidence (Optional)</Label>
            <p className="text-xs mb-2" style={{ color: '#848484' }}>
              Upload photos or documents to support your report
            </p>
            <label
              className="flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed cursor-pointer hover:bg-white/30 transition-colors"
              style={{ borderColor: 'rgba(255, 255, 255, 0.5)', background: 'rgba(255, 255, 255, 0.3)' }}
            >
              <Camera className="w-8 h-8" style={{ color: '#848484' }} />
              <span className="text-sm" style={{ color: '#535353' }}>
                {evidence.length > 0 ? `${evidence.length} files uploaded` : 'Click to upload files'}
              </span>
              <input
                type="file"
                accept="image/*,.pdf"
                multiple
                onChange={(e) => e.target.files && setEvidence(Array.from(e.target.files))}
                className="hidden"
              />
            </label>
          </div>

          {/* Warning */}
          <div 
            className="p-4 rounded-lg"
            style={{ background: 'rgba(255, 211, 128, 0.1)' }}
          >
            <p className="text-sm" style={{ color: '#535353' }}>
              ⚠️ <strong>{t('reportissue.text.important')}</strong> False reports may result in account suspension. Our team will investigate all reports thoroughly.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="flex-1 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!category || !severity || !description}
              className="flex-1"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF8FA3 100%)',
                color: 'white',
                opacity: (!category || !severity || !description) ? 0.5 : 1
              }}
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Report
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
