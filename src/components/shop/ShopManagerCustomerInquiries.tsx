import { MessageCircle, Clock, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";

interface ShopManagerCustomerInquiriesProps {
  inquiries: {
    id: string;
    customerName: string;
    subject: string;
    message: string;
    date: string;
    status: 'pending' | 'responded';
    productName?: string;
  }[];
  onRespond: (inquiryId: string) => void;
  onViewDetails: (inquiryId: string) => void;
}

export function ShopManagerCustomerInquiries({
  inquiries,
  onRespond,
  onViewDetails
}: ShopManagerCustomerInquiriesProps) {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-6" style={{ color: '#535353' }}>Customer Inquiries</h1>

        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="finance-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: inquiry.status === 'pending'
                        ? 'rgba(255, 209, 128, 0.2)'
                        : 'rgba(124, 229, 119, 0.2)'
                    }}>
                    {inquiry.status === 'pending' ? (
                      <Clock className="w-5 h-5" style={{ color: '#FFD180' }} />
                    ) : (
                      <CheckCircle className="w-5 h-5" style={{ color: '#7CE577' }} />
                    )}
                  </div>
                  <div>
                    <h3 className="mb-1" style={{ color: '#535353' }}>{inquiry.subject}</h3>
                    <p className="text-sm mb-1" style={{ color: '#848484' }}>From: {inquiry.customerName}</p>
                    {inquiry.productName && (
                      <p className="text-sm" style={{ color: '#848484' }}>Product: {inquiry.productName}</p>
                    )}
                  </div>
                </div>
                <span className="text-sm" style={{ color: '#848484' }}>{inquiry.date}</span>
              </div>

              <div className="p-3 rounded-lg mb-4" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                <p className="text-sm" style={{ color: '#535353' }}>{inquiry.message}</p>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => onViewDetails(inquiry.id)} variant="outline" className="flex-1 bg-white/50 border-white/50">
                  View Full Thread
                </Button>
                {inquiry.status === 'pending' && (
                  <Button onClick={() => onRespond(inquiry.id)} className="flex-1"
                    style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)', color: 'white' }}>
                    <MessageCircle className="w-4 h-4 mr-2" />Respond
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

