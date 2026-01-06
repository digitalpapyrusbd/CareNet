import { Download, Printer, Share, Check, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

interface DownloadInvoiceProps {
  invoice?: {
    number: string;
    date: string;
    dueDate: string;
    entity: string;
    amount: number;
    items: Array<{
      description: string;
      quantity: number;
      rate: number;
      amount: number;
    }>;
    subtotal: number;
    tax: number;
    total: number;
    status: string;
    guardianName: string;
    guardianAddress: string;
  };
  onDownloadPDF?: () => void;
  onPrint?: () => void;
  onShare?: () => void;
  onNavigate?: (page: string) => void;
}

export function DownloadInvoice({ invoice, onDownloadPDF, onPrint, onShare, onNavigate }: DownloadInvoiceProps) {
  // Default invoice data
  const defaultInvoice = {
    number: "INV-001",
    date: "Dec 26, 2024",
    dueDate: "Jan 10, 2025",
    entity: "CareNet Services",
    amount: 45000,
    items: [
      { description: "Post-Surgery Care Package", quantity: 1, rate: 45000, amount: 45000 }
    ],
    subtotal: 45000,
    tax: 0,
    total: 45000,
    status: "Paid",
    guardianName: "Mr. Kamal",
    guardianAddress: "Gulshan 2, Dhaka"
  };

  const invoiceData = invoice || defaultInvoice;

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        {/* Back Button */}
        <button
          onClick={() => onNavigate?.('toc')}
          className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
        >
          <ArrowLeft className="w-5 h-5" style={{ color: '#535353' }} />
        </button>

        <div className="max-w-3xl mx-auto">
          {/* Actions Bar */}
          <div className="flex gap-3 mb-6">
            <Button
              onClick={onDownloadPDF}
              className="flex-1"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
                color: 'white'
              }}
            >
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </Button>
            <Button
              onClick={onPrint}
              variant="outline"
              className="bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            >
              <Printer className="w-5 h-5" />
            </Button>
            <Button
              onClick={onShare}
              variant="outline"
              className="bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            >
              <Share className="w-5 h-5" />
            </Button>
          </div>

          {/* Invoice Preview */}
          <div className="finance-card p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-3xl mb-2" style={{ color: '#535353' }}>INVOICE</h1>
                <p style={{ color: '#848484' }}>#{invoiceData.number}</p>
              </div>
              {invoiceData.status === 'paid' && (
                <div 
                  className="px-4 py-2 rounded-lg flex items-center gap-2"
                  style={{ background: 'rgba(124, 229, 119, 0.2)' }}
                >
                  <Check className="w-5 h-5" style={{ color: '#7CE577' }} />
                  <span style={{ color: '#7CE577' }}>PAID</span>
                </div>
              )}
            </div>

            {/* Bill To / From */}
            <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}>
              <div>
                <p className="text-sm mb-2" style={{ color: '#848484' }}>Bill To:</p>
                <p style={{ color: '#535353' }}><strong>{invoiceData.guardianName}</strong></p>
                <p className="text-sm" style={{ color: '#848484' }}>{invoiceData.guardianAddress}</p>
              </div>
              <div>
                <p className="text-sm mb-2" style={{ color: '#848484' }}>From:</p>
                <p style={{ color: '#535353' }}><strong>{invoiceData.entity}</strong></p>
                <div className="text-sm mt-3" style={{ color: '#848484' }}>
                  <p>Invoice Date: {invoiceData.date}</p>
                  <p>Due Date: {invoiceData.dueDate}</p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}>
                    <th className="text-left py-3 text-sm" style={{ color: '#848484' }}>Description</th>
                    <th className="text-right py-3 text-sm" style={{ color: '#848484' }}>Qty</th>
                    <th className="text-right py-3 text-sm" style={{ color: '#848484' }}>Rate</th>
                    <th className="text-right py-3 text-sm" style={{ color: '#848484' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, index) => (
                    <tr key={index} className="border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}>
                      <td className="py-3" style={{ color: '#535353' }}>{item.description}</td>
                      <td className="text-right py-3" style={{ color: '#535353' }}>{item.quantity}</td>
                      <td className="text-right py-3" style={{ color: '#535353' }}>৳{item.rate.toLocaleString()}</td>
                      <td className="text-right py-3" style={{ color: '#535353' }}>৳{item.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between py-2">
                  <span style={{ color: '#848484' }}>Subtotal:</span>
                  <span style={{ color: '#535353' }}>৳{invoiceData.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span style={{ color: '#848484' }}>Tax:</span>
                  <span style={{ color: '#535353' }}>৳{invoiceData.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-3 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}>
                  <span style={{ color: '#535353' }}><strong>Total:</strong></span>
                  <span className="text-xl" style={{ color: '#535353' }}>
                    <strong>৳{invoiceData.total.toLocaleString()}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-8 border-t text-center" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}>
              <p className="text-sm" style={{ color: '#848484' }}>
                Thank you for your business!
              </p>
              <p className="text-xs mt-2" style={{ color: '#848484' }}>
                For questions, contact: billing@carenet.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}