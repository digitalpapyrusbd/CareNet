import { MessageSquare, Eye, CheckCircle, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface Inquiry {
  id: string;
  customerName: string;
  phone: string;
  subject: string;
  message: string;
  submittedDate: string;
  status: 'new' | 'responded' | 'resolved';
  priority: 'low' | 'medium' | 'high';
}

interface CustomerInquiriesProps {
  inquiries: Inquiry[];
  onRespond: (id: string) => void;
}

export function CustomerInquiries({ inquiries, onRespond }: CustomerInquiriesProps) {
  const [filter, setFilter] = useState<'all' | 'new' | 'responded' | 'resolved'>('all');

  const filteredInquiries = inquiries.filter(i => filter === 'all' || i.status === filter);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'resolved': return { bg: 'rgba(124, 229, 119, 0.2)', text: '#7CE577' };
      case 'responded': return { bg: 'rgba(142, 197, 252, 0.2)', text: '#5B9FFF' };
      case 'new': return { bg: 'rgba(255, 143, 163, 0.2)', text: '#FF8FA3' };
      default: return { bg: 'rgba(255, 255, 255, 0.2)', text: '#848484' };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return '#FF6B7A';
      case 'medium': return '#FFD180';
      case 'low': return '#5B9FFF';
      default: return '#848484';
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Customer Inquiries</h1>

        <div className="flex gap-2 mb-6">
          {['all', 'new', 'responded', 'resolved'].map((f) => (
            <button key={f} onClick={() => setFilter(f as any)}
              className="flex-1 px-4 py-2 rounded-lg capitalize text-sm" style={{
                background: filter === f ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' : 'rgba(255, 255, 255, 0.5)',
                color: filter === f ? 'white' : '#535353'
              }}>
              {f}
            </button>
          ))}
        </div>

        {filteredInquiries.length === 0 ? (
          <div className="finance-card p-8 text-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-4" style={{ color: '#848484' }} />
            <p style={{ color: '#848484' }}>No inquiries found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredInquiries.map((inquiry) => {
              const statusStyle = getStatusColor(inquiry.status);
              return (
                <div key={inquiry.id} className="finance-card p-4"
                  style={{ borderLeft: `4px solid ${getPriorityColor(inquiry.priority)}` }}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: statusStyle.bg }}>
                      <MessageSquare className="w-6 h-6" style={{ color: statusStyle.text }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h3 style={{ color: '#535353' }}>{inquiry.subject}</h3>
                          <p className="text-sm" style={{ color: '#848484' }}>{inquiry.customerName}</p>
                          <p className="text-xs" style={{ color: '#848484' }}>{inquiry.phone}</p>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                          <span className="text-xs px-3 py-1 rounded-full capitalize"
                            style={{ background: statusStyle.bg, color: statusStyle.text }}>
                            {inquiry.status === 'new' ? (
                              <Clock className="w-3 h-3 inline mr-1" />
                            ) : (
                              <CheckCircle className="w-3 h-3 inline mr-1" />
                            )}
                            {inquiry.status}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full capitalize"
                            style={{ color: getPriorityColor(inquiry.priority) }}>
                            {inquiry.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm mb-3 p-3 rounded-lg" style={{ 
                    color: '#535353',
                    background: 'rgba(255, 255, 255, 0.3)'
                  }}>
                    {inquiry.message}
                  </p>

                  <div className="flex items-center justify-between">
                    <p className="text-xs" style={{ color: '#848484' }}>Submitted: {inquiry.submittedDate}</p>
                    <Button onClick={() => onRespond(inquiry.id)} size="sm"
                      style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
                      <Eye className="w-4 h-4 mr-2" />Respond
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

