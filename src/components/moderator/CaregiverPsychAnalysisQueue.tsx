import { Brain, Eye, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";

interface PsychAnalysis {
  id: string;
  caregiverName: string;
  testDate: string;
  testType: 'online' | 'in_person';
  score?: number;
  maxScore?: number;
  traits: {
    empathy?: number;
    patience?: number;
    reliability?: number;
    stressManagement?: number;
  };
  status: 'pending' | 'completed' | 'recommended' | 'not_recommended';
  analysisNotes?: string;
  submittedDate: string;
}

interface CaregiverPsychAnalysisQueueProps {
  analyses: PsychAnalysis[];
  onReview: (id: string) => void;
  onRecommend: (id: string, recommendation: 'approve' | 'reject') => void;
}

export function CaregiverPsychAnalysisQueue({
  analyses,
  onReview,
  onRecommend
}: CaregiverPsychAnalysisQueueProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recommended': return '#7CE577';
      case 'not_recommended': return '#FF6B7A';
      case 'completed': return '#5B9FFF';
      default: return '#FFD180';
    }
  };

  const getTraitColor = (score?: number) => {
    if (!score) return '#848484';
    if (score >= 80) return '#7CE577';
    if (score >= 60) return '#5B9FFF';
    if (score >= 40) return '#FFD180';
    return '#FF6B7A';
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Psychological Analysis Queue</h1>

        <div className="space-y-3">
          {analyses.map((analysis) => {
            const statusColor = getStatusColor(analysis.status);

            return (
              <div key={analysis.id} className="finance-card p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `${statusColor}33` }}>
                    <Brain className="w-6 h-6" style={{ color: statusColor }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p style={{ color: '#535353' }}>{analysis.caregiverName}</p>
                      <span className="text-xs px-2 py-1 rounded-full capitalize"
                        style={{ background: `${statusColor}33`, color: statusColor }}>
                        {analysis.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <p className="text-xs mb-2" style={{ color: '#848484' }}>
                      Test Date: {analysis.testDate} • Type: {analysis.testType.replace('_', ' ')}
                    </p>
                    
                    {analysis.score !== undefined && (
                      <p className="text-sm mb-2" style={{ color: '#535353' }}>
                        Overall Score: {analysis.score}/{analysis.maxScore || 100}
                      </p>
                    )}
                    
                    {Object.keys(analysis.traits).length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        {Object.entries(analysis.traits).map(([trait, score]) => (
                          score !== undefined && (
                            <div key={trait} className="flex items-center justify-between text-xs p-2 rounded"
                              style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                              <span style={{ color: '#848484' }} className="capitalize">
                                {trait.replace(/([A-Z])/g, ' $1').trim()}:
                              </span>
                              <span style={{ color: getTraitColor(score), fontWeight: 'bold' }}>
                                {score}%
                              </span>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                    
                    {analysis.analysisNotes && (
                      <p className="text-xs mt-2 p-2 rounded" style={{ 
                        background: 'rgba(142, 197, 252, 0.1)', 
                        color: '#535353' 
                      }}>
                        {analysis.analysisNotes}
                      </p>
                    )}
                    
                    <p className="text-xs mt-1" style={{ color: '#848484' }}>
                      Submitted: {analysis.submittedDate}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button onClick={() => onReview(analysis.id)} variant="outline" className="bg-white/50 border-white/50">
                    <Eye className="w-4 h-4 mr-1" />View
                  </Button>
                  
                  {analysis.status === 'completed' && (
                    <>
                      <Button onClick={() => onRecommend(analysis.id, 'approve')}
                        style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
                        <CheckCircle className="w-4 h-4 mr-1" />Recommend
                      </Button>
                      <Button onClick={() => onRecommend(analysis.id, 'reject')}
                        style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
                        <XCircle className="w-4 h-4 mr-1" />Not Suitable
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {analyses.length === 0 && (
            <div className="finance-card p-8 text-center">
              <Brain className="w-12 h-12 mx-auto mb-3" style={{ color: '#848484' }} />
              <p style={{ color: '#848484' }}>No analyses in queue</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

