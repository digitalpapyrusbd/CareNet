import { ArrowLeft, Upload, FileText, Download, Eye, Trash2, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface PatientHealthRecordsProps {
  patientId: string;
  patientName: string;
  onBack: () => void;
  onUploadDocument: () => void;
}

export function PatientHealthRecords({ patientId, patientName, onBack, onUploadDocument }: PatientHealthRecordsProps) {
  const [activeTab, setActiveTab] = useState<'prescriptions' | 'reports' | 'xrays' | 'other'>('prescriptions');

  const documents = {
    prescriptions: [
      { id: "1", name: "Prescription - Dr. Rahman", date: "Dec 1, 2024", size: "245 KB" },
      { id: "2", name: "Prescription - Diabetes Clinic", date: "Nov 15, 2024", size: "198 KB" },
    ],
    reports: [
      { id: "3", name: "Blood Test Results", date: "Nov 20, 2024", size: "412 KB" },
      { id: "4", name: "ECG Report", date: "Nov 10, 2024", size: "1.2 MB" },
    ],
    xrays: [
      { id: "5", name: "Chest X-Ray", date: "Oct 25, 2024", size: "2.4 MB" },
    ],
    other: [
      { id: "6", name: "Vaccination Record", date: "Jan 15, 2024", size: "156 KB" },
    ]
  };

  const tabs = [
    { id: 'prescriptions', label: 'Prescriptions', count: documents.prescriptions.length },
    { id: 'reports', label: 'Reports', count: documents.reports.length },
    { id: 'xrays', label: 'X-Rays', count: documents.xrays.length },
    { id: 'other', label: 'Other', count: documents.other.length },
  ];

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

        <div className="mb-6">
          <h1 className="mb-2" style={{ color: '#535353' }}>Health Records</h1>
          <p style={{ color: '#848484' }}>{patientName}</p>
        </div>

        {/* Upload Button */}
        <Button
          onClick={onUploadDocument}
          className="w-full mb-6"
          style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
            color: 'white'
          }}
        >
          <Plus className="w-5 h-5 mr-2" />
          Upload Document
        </Button>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all"
              style={{
                background: activeTab === tab.id 
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                  : 'rgba(255, 255, 255, 0.5)',
                color: activeTab === tab.id ? 'white' : '#535353'
              }}
            >
              <span className="text-sm">{tab.label}</span>
              {tab.count > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full" style={{
                  background: activeTab === tab.id ? 'rgba(255, 255, 255, 0.3)' : 'rgba(132, 132, 132, 0.2)'
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Documents List */}
        <div className="space-y-3">
          {documents[activeTab].map((doc) => (
            <div key={doc.id} className="finance-card p-4">
              <div className="flex items-start gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)'
                  }}
                >
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1" style={{ color: '#535353' }}>{doc.name}</h3>
                  <p className="text-sm" style={{ color: '#848484' }}>
                    {doc.date} • {doc.size}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4">
                <button className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-sm" style={{ background: 'rgba(142, 197, 252, 0.2)', color: '#5B9FFF' }}>
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-sm" style={{ background: 'rgba(168, 224, 99, 0.2)', color: '#7CE577' }}>
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-sm" style={{ background: 'rgba(255, 107, 122, 0.2)', color: '#FF6B7A' }}>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {documents[activeTab].length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto mb-4" style={{ color: '#848484' }} />
            <p style={{ color: '#535353' }}>No documents yet</p>
            <p className="text-sm" style={{ color: '#848484' }}>Upload your first document to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
