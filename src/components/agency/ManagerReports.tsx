import { FileText, Download, Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useState } from "react";

interface ManagerReportsProps {
  onGenerate: (type: string, dateRange: { start: string; end: string }) => void;
  onExport: (format: 'pdf' | 'csv') => void;
}

export function ManagerReports({ onGenerate, onExport }: ManagerReportsProps) {
  const [reportType, setReportType] = useState('performance');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const reportTypes = [
    { value: 'performance', label: 'Performance Report', description: 'Caregiver performance metrics' },
    { value: 'quality', label: 'Quality Report', description: 'Quality scores and ratings' },
    { value: 'activity', label: 'Activity Report', description: 'Job activity and completion rates' },
  ];

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="mb-6" style={{ color: '#535353' }}>Generate Reports</h1>

        {/* Report Type Selection */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Report Type</h3>
          <div className="space-y-3">
            {reportTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setReportType(type.value)}
                className="w-full p-4 rounded-lg text-left transition-all"
                style={{
                  background: reportType === type.value
                    ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                    : 'rgba(255, 255, 255, 0.5)',
                  color: reportType === type.value ? 'white' : '#535353'
                }}
              >
                <p className="mb-1">{type.label}</p>
                <p className="text-sm" style={{ 
                  color: reportType === type.value ? 'rgba(255, 255, 255, 0.8)' : '#848484' 
                }}>
                  {type.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Date Range</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label style={{ color: '#535353' }}>Start Date</Label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full mt-2 p-3 rounded-lg border"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  background: 'rgba(255, 255, 255, 0.5)',
                  color: '#535353'
                }}
              />
            </div>
            <div>
              <Label style={{ color: '#535353' }}>End Date</Label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full mt-2 p-3 rounded-lg border"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  background: 'rgba(255, 255, 255, 0.5)',
                  color: '#535353'
                }}
              />
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={() => onGenerate(reportType, { start: startDate, end: endDate })}
          disabled={!startDate || !endDate}
          className="w-full mb-4"
          style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
            color: 'white',
            opacity: (!startDate || !endDate) ? 0.5 : 1
          }}
        >
          <FileText className="w-4 h-4 mr-2" />Generate Report
        </Button>

        {/* Export Options */}
        <div className="finance-card p-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Export Options</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={() => onExport('pdf')} variant="outline" className="bg-white/50 border-white/50">
              <Download className="w-4 h-4 mr-2" />PDF
            </Button>
            <Button onClick={() => onExport('csv')} variant="outline" className="bg-white/50 border-white/50">
              <Download className="w-4 h-4 mr-2" />CSV
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

