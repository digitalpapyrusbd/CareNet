'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Download, CheckCircle, Clock, XCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

type Invoice = {
  id: string;
  invoiceNumber: string;
  type: 'Platform Subscription' | 'Commission';
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDate: string;
  paidDate?: string;
};

export default function ModeratorBillingPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const invoices: Invoice[] = [
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      type: 'Platform Subscription',
      amount: 5000,
      status: 'Paid',
      dueDate: '2024-12-01',
      paidDate: '2024-11-28'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      type: 'Commission',
      amount: 2500,
      status: 'Pending',
      dueDate: '2024-12-15'
    },
    {
      id: '3',
      invoiceNumber: 'INV-2024-003',
      type: 'Platform Subscription',
      amount: 5000,
      status: 'Overdue',
      dueDate: '2024-11-20'
    }
  ];

  const filtered = invoices.filter(inv =>
    inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Overdue':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'text-green-600';
      case 'Pending':
        return 'text-yellow-600';
      case 'Overdue':
        return 'text-red-600';
      default:
        return '';
    }
  };

  const totalPaid = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
  const totalPending = invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.amount, 0);
  const totalOverdue = invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + i.amount, 0);

  return (
    <>
      <UniversalNav userRole="moderator" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
        <div className="p-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 hover:bg-white/30"
            style={{ color: '#535353' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="mb-6">
            <h1 className="mb-2" style={{ color: '#535353' }}>Billing & Invoices</h1>
            <p style={{ color: '#848484' }}>View invoice details and payment status</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="finance-card p-4">
              <div className="text-sm mb-1" style={{ color: '#848484' }}>Total Paid</div>
              <div className="text-xl font-semibold text-green-600">BDT {totalPaid.toLocaleString()}</div>
            </div>
            <div className="finance-card p-4">
              <div className="text-sm mb-1" style={{ color: '#848484' }}>Pending</div>
              <div className="text-xl font-semibold text-yellow-600">BDT {totalPending.toLocaleString()}</div>
            </div>
            <div className="finance-card p-4">
              <div className="text-sm mb-1" style={{ color: '#848484' }}>Overdue</div>
              <div className="text-xl font-semibold text-red-600">BDT {totalOverdue.toLocaleString()}</div>
            </div>
          </div>

          {/* Search */}
          <div className="finance-card p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#848484' }} />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search invoices..."
                className="pl-10 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>
          </div>

          {/* Invoice List */}
          <div className="space-y-3">
            {filtered.map((invoice) => (
              <div key={invoice.id} className="finance-card p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4" style={{ color: '#848484' }} />
                      <span className="font-semibold" style={{ color: '#535353' }}>
                        {invoice.invoiceNumber}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: '#848484' }}>{invoice.type}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold mb-1" style={{ color: '#535353' }}>
                      BDT {invoice.amount.toLocaleString()}
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      {invoice.status}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm pt-3 border-t border-white/20">
                  <div>
                    <span style={{ color: '#848484' }}>Due: </span>
                    <span style={{ color: '#535353' }}>
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  {invoice.paidDate && (
                    <div>
                      <span style={{ color: '#848484' }}>Paid: </span>
                      <span style={{ color: '#535353' }}>
                        {new Date(invoice.paidDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="finance-card p-8 text-center">
              <FileText className="w-12 h-12 mx-auto mb-3" style={{ color: '#848484' }} />
              <p style={{ color: '#848484' }}>No invoices found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
