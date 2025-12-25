import { Calendar, Eye, CheckCircle, XCircle, Clock, User } from "lucide-react";
import { Button } from "../ui/button";

interface Interview {
  id: string;
  caregiverName: string;
  scheduledDate?: string;
  scheduledTime?: string;
  interviewer?: string;
  status: 'pending' | 'scheduled' | 'completed' | 'no_show' | 'passed' | 'failed';
  marks?: number;
  maxMarks?: number;
  notes?: string;
  submittedDate: string;
}

interface CaregiverInterviewQueueProps {
  interviews: Interview[];
  onSchedule: (id: string) => void;
  onReview: (id: string) => void;
  onSubmitMarks: (id: string) => void;
  onRecommend: (id: string, recommendation: 'pass' | 'fail') => void;
}

export function CaregiverInterviewQueue({
  interviews,
  onSchedule,
  onReview,
  onSubmitMarks,
  onRecommend
}: CaregiverInterviewQueueProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return '#7CE577';
      case 'failed': return '#FF6B7A';
      case 'completed': return '#5B9FFF';
      case 'scheduled': return '#FFD180';
      case 'no_show': return '#848484';
      default: return '#FFB3C1';
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Interview Queue</h1>

        <div className="space-y-3">
          {interviews.map((interview) => {
            const statusColor = getStatusColor(interview.status);

            return (
              <div key={interview.id} className="finance-card p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `${statusColor}33` }}>
                    <User className="w-6 h-6" style={{ color: statusColor }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p style={{ color: '#535353' }}>{interview.caregiverName}</p>
                      <span className="text-xs px-2 py-1 rounded-full capitalize"
                        style={{ background: `${statusColor}33`, color: statusColor }}>
                        {interview.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    {interview.scheduledDate && (
                      <div className="flex items-center gap-2 mb-1 text-sm" style={{ color: '#848484' }}>
                        <Calendar className="w-4 h-4" />
                        <span>{interview.scheduledDate} at {interview.scheduledTime}</span>
                      </div>
                    )}
                    
                    {interview.interviewer && (
                      <p className="text-xs mb-1" style={{ color: '#848484' }}>
                        Interviewer: {interview.interviewer}
                      </p>
                    )}
                    
                    {interview.marks !== undefined && (
                      <p className="text-sm mb-1" style={{ color: '#535353' }}>
                        Score: {interview.marks}/{interview.maxMarks || 100}
                      </p>
                    )}
                    
                    {interview.notes && (
                      <p className="text-xs mt-2 p-2 rounded" style={{ 
                        background: 'rgba(142, 197, 252, 0.1)', 
                        color: '#535353' 
                      }}>
                        {interview.notes}
                      </p>
                    )}
                    
                    <p className="text-xs mt-1" style={{ color: '#848484' }}>
                      Submitted: {interview.submittedDate}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button onClick={() => onReview(interview.id)} variant="outline" className="bg-white/50 border-white/50">
                    <Eye className="w-4 h-4 mr-1" />View
                  </Button>
                  
                  {interview.status === 'pending' && (
                    <Button onClick={() => onSchedule(interview.id)} className="col-span-2"
                      style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)', color: 'white' }}>
                      <Clock className="w-4 h-4 mr-1" />Schedule
                    </Button>
                  )}
                  
                  {interview.status === 'completed' && interview.marks === undefined && (
                    <Button onClick={() => onSubmitMarks(interview.id)} className="col-span-2"
                      style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)', color: 'white' }}>
                      Submit Marks
                    </Button>
                  )}
                  
                  {interview.status === 'completed' && interview.marks !== undefined && interview.status !== 'passed' && interview.status !== 'failed' && (
                    <>
                      <Button onClick={() => onRecommend(interview.id, 'pass')}
                        style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
                        <CheckCircle className="w-4 h-4 mr-1" />Pass
                      </Button>
                      <Button onClick={() => onRecommend(interview.id, 'fail')}
                        style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
                        <XCircle className="w-4 h-4 mr-1" />Fail
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {interviews.length === 0 && (
            <div className="finance-card p-8 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-3" style={{ color: '#848484' }} />
              <p style={{ color: '#848484' }}>No interviews in queue</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

