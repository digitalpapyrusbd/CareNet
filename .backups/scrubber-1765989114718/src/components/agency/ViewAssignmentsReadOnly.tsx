import { Eye, User, Calendar, MapPin } from "lucide-react";
import { Button } from "../ui/button";

interface Assignment {
  id: string;
  caregiverName: string;
  patientName: string;
  packageName: string;
  startDate: string;
  endDate: string;
  location: string;
  status: 'active' | 'completed' | 'upcoming';
}

interface ViewAssignmentsReadOnlyProps {
  assignments: Assignment[];
  onViewDetails: (id: string) => void;
}

export function ViewAssignmentsReadOnly({ assignments, onViewDetails }: ViewAssignmentsReadOnlyProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#7CE577';
      case 'completed': return '#848484';
      case 'upcoming': return '#5B9FFF';
      default: return '#848484';
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="mb-2" style={{ color: '#535353' }}>View Assignments</h1>
          <p className="text-sm" style={{ color: '#848484' }}>Read-only access - Contact admin to make changes</p>
        </div>

        <div className="space-y-3">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="finance-card p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p style={{ color: '#535353' }}>{assignment.caregiverName}</p>
                    <span className="text-xs px-2 py-1 rounded-full capitalize"
                      style={{
                        background: `${getStatusColor(assignment.status)}33`,
                        color: getStatusColor(assignment.status)
                      }}>
                      {assignment.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2" style={{ color: '#848484' }}>
                      <User className="w-4 h-4" />
                      <span>{assignment.patientName}</span>
                    </div>
                    <div className="flex items-center gap-2" style={{ color: '#848484' }}>
                      <Calendar className="w-4 h-4" />
                      <span>{assignment.startDate} - {assignment.endDate}</span>
                    </div>
                    <div className="flex items-center gap-2" style={{ color: '#848484' }}>
                      <MapPin className="w-4 h-4" />
                      <span>{assignment.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={() => onViewDetails(assignment.id)} variant="outline" className="w-full bg-white/50 border-white/50">
                <Eye className="w-4 h-4 mr-2" />View Details
              </Button>
            </div>
          ))}

          {assignments.length === 0 && (
            <div className="finance-card p-8 text-center">
              <p style={{ color: '#848484' }}>No assignments found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

