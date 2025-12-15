import { MessageSquare, Eye, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface Ticket {
  id: string;
  userType: 'guardian' | 'agency' | 'caregiver' | 'shop';
  userName: string;
  category: 'technical' | 'payment' | 'dispute' | 'account' | 'other';
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  submittedDate: string;
}

interface SupportTicketsProps {
  tickets: Ticket[];
  onReview: (id: string) => void;
}

export function SupportTickets({ tickets, onReview }: SupportTicketsProps) {
  const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'urgent' | 'high'>('all');

  const filteredTickets = tickets.filter(t => {
    const statusMatch = filter === 'all' || t.status === filter;
    const priorityMatch = priorityFilter === 'all' || t.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgent': return { bg: 'rgba(255, 107, 122, 0.2)', text: '#FF6B7A' };
      case 'high': return { bg: 'rgba(255, 143, 163, 0.2)', text: '#FF8FA3' };
      case 'medium': return { bg: 'rgba(255, 209, 128, 0.2)', text: '#FFD180' };
      default: return { bg: 'rgba(142, 197, 252, 0.2)', text: '#5B9FFF' };
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'resolved') return <CheckCircle className="w-4 h-4" style={{ color: '#7CE577' }} />;
    if (status === 'in_progress') return <Clock className="w-4 h-4" style={{ color: '#FFD180' }} />;
    return <AlertCircle className="w-4 h-4" style={{ color: '#FF8FA3' }} />;
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Support Tickets</h1>

        <div className="flex gap-2 mb-3 overflow-x-auto">
          {['all', 'open', 'in_progress', 'resolved'].map((f) => (
            <button key={f} onClick={() => setFilter(f as any)}
              className="px-4 py-2 rounded-lg capitalize text-sm whitespace-nowrap" style={{
                background: filter === f ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' : 'rgba(255, 255, 255, 0.5)',
                color: filter === f ? 'white' : '#535353'
              }}>
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', 'urgent', 'high'].map((p) => (
            <button key={p} onClick={() => setPriorityFilter(p as any)}
              className="px-3 py-1 rounded-lg capitalize text-xs whitespace-nowrap" style={{
                background: priorityFilter === p ? 'rgba(255, 107, 122, 0.2)' : 'rgba(255, 255, 255, 0.3)',
                color: priorityFilter === p ? '#FF6B7A' : '#535353'
              }}>
              {p} priority
            </button>
          ))}
        </div>

        {filteredTickets.length === 0 ? (
          <div className="finance-card p-8 text-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-4" style={{ color: '#848484' }} />
            <p style={{ color: '#848484' }}>No tickets found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTickets.map((ticket) => {
              const priorityStyle = getPriorityColor(ticket.priority);
              return (
                <div key={ticket.id} className="finance-card p-4"
                  style={{ borderLeft: `4px solid ${priorityStyle.text}` }}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: priorityStyle.bg }}>
                      <MessageSquare className="w-6 h-6" style={{ color: priorityStyle.text }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h3 style={{ color: '#535353' }}>{ticket.subject}</h3>
                          <p className="text-sm" style={{ color: '#848484' }}>
                            {ticket.userName} ({ticket.userType})
                          </p>
                          <span className="text-xs px-2 py-1 rounded-full capitalize"
                            style={{ background: 'rgba(142, 197, 252, 0.1)', color: '#5B9FFF' }}>
                            {ticket.category}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                          <span className="text-xs px-3 py-1 rounded-full capitalize"
                            style={{ background: priorityStyle.bg, color: priorityStyle.text }}>
                            {ticket.priority}
                          </span>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(ticket.status)}
                            <span className="text-xs capitalize" style={{ color: '#535353' }}>
                              {ticket.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm mb-3 p-3 rounded-lg" style={{ 
                    color: '#535353',
                    background: 'rgba(255, 255, 255, 0.3)'
                  }}>
                    {ticket.message}
                  </p>

                  <div className="flex items-center justify-between">
                    <p className="text-xs" style={{ color: '#848484' }}>Submitted: {ticket.submittedDate}</p>
                    <Button onClick={() => onReview(ticket.id)} size="sm"
                      style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
                      <Eye className="w-4 h-4 mr-2" />Review
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

