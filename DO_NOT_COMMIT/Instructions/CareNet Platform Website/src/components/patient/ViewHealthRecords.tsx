import { FileText, Download, Eye } from "lucide-react";
import { useState } from "react";

interface ViewHealthRecordsProps {
  records: Array<{
    id: string;
    type: string;
    date: string;
    doctor?: string;
  }>;
  onView: (id: string) => void;
  onDownload: (id: string) => void;
}

export function ViewHealthRecords({ records, onView, onDownload }: ViewHealthRecordsProps) {
  const [activeTab, setActiveTab] = useState<'prescriptions' | 'reports' | 'xrays'>('prescriptions');

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Health Records</h1>

        <div className="flex gap-2 mb-6">
          {['prescriptions', 'reports', 'xrays'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab as any)}
              className="flex-1 px-4 py-2 rounded-lg capitalize text-sm" style={{
                background: activeTab === tab ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' : 'rgba(255, 255, 255, 0.5)',
                color: activeTab === tab ? 'white' : '#535353'
              }}>
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {records.filter(r => r.type === activeTab).map((record) => (
            <div key={record.id} className="finance-card p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)' }}>
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p style={{ color: '#535353' }}>{record.date}</p>
                  {record.doctor && <p className="text-sm" style={{ color: '#848484' }}>{record.doctor}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => onView(record.id)} className="py-2 rounded-lg text-sm"
                  style={{ background: 'rgba(142, 197, 252, 0.2)', color: '#5B9FFF' }}>
                  <Eye className="w-4 h-4 inline mr-1" />View
                </button>
                <button onClick={() => onDownload(record.id)} className="py-2 rounded-lg text-sm"
                  style={{ background: 'rgba(168, 224, 99, 0.2)', color: '#7CE577' }}>
                  <Download className="w-4 h-4 inline mr-1" />Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

