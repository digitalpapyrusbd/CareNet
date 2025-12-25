import { FileText, Download, Eye, Calendar } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  type: 'subscription' | 'commission';
  description: string;
}

interface BillingHistoryProps {
  invoices: Invoice[];
  onViewInvoice: (id: string) => void;
  onDownloadInvoice: (id: string) => void;
}

export function BillingHistory({ invoices, onViewInvoice, onDownloadInvoice }: BillingHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

  const filteredInvoices = invoices.filter(inv => filter === 'all' || inv.status === filter);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'paid': return { bg: 'rgba(124, 229, 119, 0.2)', text: '#7CE577' };
      case 'pending': return { bg: 'rgba(255, 209, 128, 0.2)', text: '#FFD180' };
      case 'overdue': return { bg: 'rgba(255, 107, 122, 0.2)', text: '#FF6B7A' };
      default: return { bg: 'rgba(142, 197, 252, 0.2)', text: '#5B9FFF' };
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Billing History</h1>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', 'paid', 'pending', 'overdue'].map((f) => (
            <button key={f} onClick={() => setFilter(f as any)}
              className="px-4 py-2 rounded-lg capitalize text-sm whitespace-nowrap" style={{
                background: filter === f ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' : 'rgba(255, 255, 255, 0.5)',
                color: filter === f ? 'white' : '#535353'
              }}>
              {f}
            </button>
          ))}
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="finance-card p-8 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: '#848484' }} />
            <p style={{ color: '#848484' }}>No invoices found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredInvoices.map((invoice) => {
              const statusStyle = getStatusColor(invoice.status);
              return (
                <div key={invoice.id} className="finance-card p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: statusStyle.bg }}>
                      <FileText className="w-6 h-6" style={{ color: statusStyle.text }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 style={{ color: '#535353' }}>Invoice #{invoice.id}</h3>
                        <span className="text-xs px-3 py-1 rounded-full capitalize"
                          style={{ background: statusStyle.bg, color: statusStyle.text }}>
                          {invoice.status}
                        </span>
                      </div>
                      <p className="text-sm mb-1" style={{ color: '#848484' }}>{invoice.description}</p>
                      <div className="flex items-center gap-2 text-xs" style={{ color: '#848484' }}>
                        <Calendar className="w-3 h-3" />
                        {invoice.date}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/50">
                    <p className="text-xl" style={{ color: '#535353' }}>৳{invoice.amount.toLocaleString()}</p>
                    <div className="flex gap-2">
                      <Button onClick={() => onViewInvoice(invoice.id)} size="sm" variant="outline"
                        className="bg-white/50 border-white/50">
                        <Eye className="w-4 h-4 mr-2" />View
                      </Button>
                      <Button onClick={() => onDownloadInvoice(invoice.id)} size="sm" variant="outline"
                        className="bg-white/50 border-white/50">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
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

