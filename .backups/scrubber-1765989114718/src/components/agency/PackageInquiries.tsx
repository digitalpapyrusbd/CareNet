import { Package, Eye, CheckCircle, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface Inquiry {
  id: string;
  guardianName: string;
  packageName: string;
  originalPrice: number;
  proposedPrice: number;
  modifications: string;
  submittedDate: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface PackageInquiriesProps {
  inquiries: Inquiry[];
  onReview: (id: string) => void;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export function PackageInquiries({ inquiries, onReview, onAccept, onReject }: PackageInquiriesProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  const filteredInquiries = inquiries.filter(i => filter === 'all' || i.status === filter);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'accepted': return { bg: 'rgba(124, 229, 119, 0.2)', text: '#7CE577' };
      case 'rejected': return { bg: 'rgba(255, 107, 122, 0.2)', text: '#FF6B7A' };
      case 'pending': return { bg: 'rgba(255, 209, 128, 0.2)', text: '#FFD180' };
      default: return { bg: 'rgba(255, 255, 255, 0.2)', text: '#848484' };
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Package Inquiries</h1>

        <div className="flex gap-2 mb-6">
          {['all', 'pending', 'accepted', 'rejected'].map((f) => (
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
            <Package className="w-16 h-16 mx-auto mb-4" style={{ color: '#848484' }} />
            <p style={{ color: '#848484' }}>No inquiries found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredInquiries.map((inquiry) => {
              const statusStyle = getStatusColor(inquiry.status);
              const priceDiff = inquiry.proposedPrice - inquiry.originalPrice;
              return (
                <div key={inquiry.id} className="finance-card p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: statusStyle.bg }}>
                      <Package className="w-6 h-6" style={{ color: statusStyle.text }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h3 style={{ color: '#535353' }}>{inquiry.packageName}</h3>
                          <p className="text-sm" style={{ color: '#848484' }}>{inquiry.guardianName}</p>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full capitalize"
                          style={{ background: statusStyle.bg, color: statusStyle.text }}>
                          {inquiry.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg mb-3" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                    <div className="grid grid-cols-2 gap-3 mb-2">
                      <div>
                        <p className="text-xs mb-1" style={{ color: '#848484' }}>Original Price</p>
                        <p style={{ color: '#535353' }}>৳{inquiry.originalPrice.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs mb-1" style={{ color: '#848484' }}>Proposed Price</p>
                        <p style={{ color: priceDiff >= 0 ? '#7CE577' : '#FF6B7A' }}>
                          ৳{inquiry.proposedPrice.toLocaleString()}
                          <span className="text-xs ml-1">
                            ({priceDiff >= 0 ? '+' : ''}{priceDiff.toLocaleString()})
                          </span>
                        </p>
                      </div>
                    </div>
                    <p className="text-xs mb-1" style={{ color: '#848484' }}>Modifications:</p>
                    <p className="text-sm" style={{ color: '#535353' }}>{inquiry.modifications}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs" style={{ color: '#848484' }}>Submitted: {inquiry.submittedDate}</p>
                    {inquiry.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button onClick={() => onReview(inquiry.id)} size="sm" variant="outline"
                          className="bg-white/50 border-white/50">
                          <Eye className="w-4 h-4 mr-2" />Review
                        </Button>
                        <Button onClick={() => onAccept(inquiry.id)} size="sm"
                          style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button onClick={() => onReject(inquiry.id)} size="sm" variant="outline"
                          className="bg-white/50 border-white/50">
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
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

