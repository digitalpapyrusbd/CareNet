import { CreditCard, Download, Calendar } from "lucide-react";
import { Button } from "../ui/button";

interface ShopBillingProps {
  invoices: {
    id: string;
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
    dueDate: string;
  }[];
  onPayInvoice: (invoiceId: string) => void;
  onDownloadInvoice: (invoiceId: string) => void;
}

export function ShopBilling({ invoices, onPayInvoice, onDownloadInvoice }: ShopBillingProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#7CE577';
      case 'pending': return '#FFD180';
      case 'overdue': return '#FF8FA3';
      default: return '#848484';
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-6" style={{ color: '#535353' }}>Billing & Invoices</h1>

        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="finance-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="mb-1" style={{ color: '#535353' }}>Invoice #{invoice.id}</h3>
                  <p className="text-sm" style={{ color: '#848484' }}>{invoice.date}</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full"
                  style={{ background: `${getStatusColor(invoice.status)}33` }}>
                  <span className="text-sm capitalize" style={{ color: getStatusColor(invoice.status) }}>
                    {invoice.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                  <p className="text-sm mb-1" style={{ color: '#848484' }}>Amount</p>
                  <p className="text-xl" style={{ color: '#535353' }}>৳{invoice.amount.toLocaleString()}</p>
                </div>

                <div className="p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                  <p className="text-sm mb-1" style={{ color: '#848484' }}>Due Date</p>
                  <p className="text-xl" style={{ color: '#535353' }}>{invoice.dueDate}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => onDownloadInvoice(invoice.id)}
                  variant="outline"
                  className="flex-1 bg-white/50 border-white/50"
                >
                  <Download className="w-4 h-4 mr-2" />Download
                </Button>

                {invoice.status !== 'paid' && (
                  <Button
                    onClick={() => onPayInvoice(invoice.id)}
                    className="flex-1"
                    style={{
                      background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                      color: 'white'
                    }}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />Pay Now
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

