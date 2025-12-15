import { ArrowLeft, Download, Share, Trash2, FileText } from "lucide-react";
import { Button } from "../ui/button";

interface ViewPrescriptionDetailProps {
  prescription: {
    id: string;
    doctorName: string;
    date: string;
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
    }>;
    diagnosis: string;
    notes: string;
    imageUrl?: string;
  };
  onBack: () => void;
  onDownload: () => void;
  onShare: () => void;
  onDelete: () => void;
}

export function ViewPrescriptionDetail({
  prescription,
  onBack,
  onDownload,
  onShare,
  onDelete
}: ViewPrescriptionDetailProps) {
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
          {/* Header */}
          <div className="finance-card p-6 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                }}
              >
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="mb-1" style={{ color: '#535353' }}>
                  Dr. {prescription.doctorName}
                </h1>
                <p style={{ color: '#848484' }}>
                  {new Date(prescription.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          {prescription.diagnosis && (
            <div className="finance-card p-6 mb-6">
              <h2 className="mb-3" style={{ color: '#535353' }}>Diagnosis</h2>
              <p style={{ color: '#848484' }}>{prescription.diagnosis}</p>
            </div>
          )}

          {/* Medications */}
          <div className="finance-card p-6 mb-6">
            <h2 className="mb-4" style={{ color: '#535353' }}>Prescribed Medications</h2>
            <div className="space-y-4">
              {prescription.medications.map((med, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg"
                  style={{ background: 'rgba(142, 197, 252, 0.1)' }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 style={{ color: '#535353' }}>{med.name}</h3>
                    <span 
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ background: '#8EC5FC', color: 'white' }}
                    >
                      {med.dosage}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p style={{ color: '#848484' }}>
                      <strong>Frequency:</strong> {med.frequency}
                    </p>
                    <p style={{ color: '#848484' }}>
                      <strong>Duration:</strong> {med.duration}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor's Notes */}
          {prescription.notes && (
            <div className="finance-card p-6 mb-6">
              <h2 className="mb-3" style={{ color: '#535353' }}>Doctor's Notes</h2>
              <p style={{ color: '#848484' }}>{prescription.notes}</p>
            </div>
          )}

          {/* Prescription Image */}
          {prescription.imageUrl && (
            <div className="finance-card p-6 mb-6">
              <h2 className="mb-3" style={{ color: '#535353' }}>Original Prescription</h2>
              <img
                src={prescription.imageUrl}
                alt="Prescription"
                className="w-full rounded-lg"
              />
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={onDownload}
              variant="outline"
              className="bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              onClick={onShare}
              variant="outline"
              className="bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          <Button
            onClick={onDelete}
            variant="outline"
            className="w-full mt-3 bg-white/50 border-white/50"
            style={{ color: '#FF6B7A' }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Prescription
          </Button>
        </div>
      </div>
    </div>
  );
}
