import { FileText, Calendar, DollarSign, Download, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useState } from "react";

interface GenerateInvoiceProps {
  caregiverName: string;
  onGenerate: (data: any) => void;
  onCancel: () => void;
}

export function GenerateInvoice({ caregiverName, onGenerate, onCancel }: GenerateInvoiceProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

  const completedJobs = [
    {
      id: "1",
      patient: "Mrs. Fatima Ahmed",
      date: "Dec 1, 2024",
      hours: 8,
      rate: 300,
      amount: 2400
    },
    {
      id: "2",
      patient: "Mr. Abdul Rahman",
      date: "Dec 2, 2024",
      hours: 6,
      rate: 300,
      amount: 1800
    },
    {
      id: "3",
      patient: "Mrs. Ayesha Khan",
      date: "Dec 3, 2024",
      hours: 8,
      rate: 300,
      amount: 2400
    },
  ];

  const toggleJob = (jobId: string) => {
    if (selectedJobs.includes(jobId)) {
      setSelectedJobs(selectedJobs.filter(id => id !== jobId));
    } else {
      setSelectedJobs([...selectedJobs, jobId]);
    }
  };

  const totalAmount = completedJobs
    .filter(job => selectedJobs.includes(job.id))
    .reduce((sum, job) => sum + job.amount, 0);

  const handleGenerate = () => {
    onGenerate({
      startDate,
      endDate,
      jobs: completedJobs.filter(job => selectedJobs.includes(job.id)),
      totalAmount
    });
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
              }}
            >
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 style={{ color: '#535353' }}>Generate Invoice</h1>
              <p style={{ color: '#848484' }}>{caregiverName}</p>
            </div>
          </div>

          {/* Date Range */}
          <div className="finance-card p-6 mb-6">
            <h3 className="mb-4" style={{ color: '#535353' }}>Invoice Period</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full mt-2 px-3 py-2 rounded-lg bg-white/50 border border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full mt-2 px-3 py-2 rounded-lg bg-white/50 border border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>
            </div>
          </div>

          {/* Select Jobs */}
          <div className="finance-card p-6 mb-6">
            <h3 className="mb-4" style={{ color: '#535353' }}>Select Completed Jobs</h3>
            <div className="space-y-3">
              {completedJobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => toggleJob(job.id)}
                  className="w-full p-4 rounded-lg text-left transition-all"
                  style={{
                    background: selectedJobs.includes(job.id)
                      ? 'rgba(142, 197, 252, 0.2)'
                      : 'rgba(255, 255, 255, 0.5)',
                    border: selectedJobs.includes(job.id)
                      ? '2px solid #5B9FFF'
                      : '2px solid transparent'
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p style={{ color: '#535353' }}>{job.patient}</p>
                      <p className="text-sm" style={{ color: '#848484' }}>{job.date}</p>
                    </div>
                    <div className="text-right">
                      <p style={{ color: '#7CE577' }}>৳{job.amount.toLocaleString()}</p>
                      <p className="text-sm" style={{ color: '#848484' }}>{job.hours}h × ৳{job.rate}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="finance-card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span style={{ color: '#848484' }}>Total Jobs Selected:</span>
              <span style={{ color: '#535353' }}>{selectedJobs.length}</span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}>
              <span style={{ color: '#535353' }}><strong>Total Amount:</strong></span>
              <span className="text-2xl" style={{ color: '#7CE577' }}>
                <strong>৳{totalAmount.toLocaleString()}</strong>
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={selectedJobs.length === 0}
              className="flex-1"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
                color: 'white',
                opacity: selectedJobs.length === 0 ? 0.5 : 1
              }}
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Invoice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
