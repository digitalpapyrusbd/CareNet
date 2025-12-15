'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, Eye, CreditCard, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function GuardianBillingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pending' | 'paid' | 'overdue'>('pending');

  const invoices = {
    pending: [
      {
        id: 'INV-2024-001',
        entity: 'Green Care Agency',
        amount: 35000,
        dueDate: 'Dec 10, 2024',
        issuedDate: 'Dec 3, 2024',
        status: 'pending',
        services: '24/7 Senior Care - Basic (Dec 1-31)'
      },
    ],
    paid: [
      {
        id: 'INV-2024-002',
        entity: 'MediCare Services',
        amount: 28000,
        paidDate: 'Nov 28, 2024',
        issuedDate: 'Nov 21, 2024',
        status: 'paid',
        services: 'Post-Surgery Care Package (Nov 15-30)'
      },
    ],
    overdue: []
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return CheckCircle;
      case 'pending': return Clock;
      case 'overdue': return AlertCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#7CE577';
      case 'pending': return '#FFD180';
      case 'overdue': return '#FF6B7A';
      default: return '#848484';
    }
  };

  return (
    <>
      <UniversalNav userRole="guardian" showBack={true} />
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
          <h1 className="mb-2" style={{ color: '#535353' }}>Agency Invoices</h1>
          <p style={{ color: '#848484' }}>
            Invoices from care agencies for services provided
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="finance-card p-4">
            <p className="text-xs mb-1" style={{ color: '#848484' }}>Pending</p>
            <p className="text-xl" style={{ color: '#FFD180' }}>
              ৳{invoices.pending.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
            </p>
          </div>
          <div className="finance-card p-4">
            <p className="text-xs mb-1" style={{ color: '#848484' }}>Paid</p>
            <p className="text-xl" style={{ color: '#7CE577' }}>
              ৳{invoices.paid.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
            </p>
          </div>
          <div className="finance-card p-4">
            <p className="text-xs mb-1" style={{ color: '#848484' }}>Overdue</p>
            <p className="text-xl" style={{ color: '#FF6B7A' }}>
              ৳{invoices.overdue.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto mb-6">
          {[
            { id: 'pending', label: 'Pending', count: invoices.pending.length },
            { id: 'paid', label: 'Paid', count: invoices.paid.length },
            { id: 'overdue', label: 'Overdue', count: invoices.overdue.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap"
              style={{
                background: activeTab === tab.id 
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                  : 'rgba(255, 255, 255, 0.5)',
                color: activeTab === tab.id ? 'white' : '#535353'
              }}
            >
              <span className="text-sm">{tab.label}</span>
              {tab.count > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full" style={{
                  background: activeTab === tab.id ? 'rgba(255, 255, 255, 0.3)' : 'rgba(132, 132, 132, 0.2)'
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Invoices List */}
        <div className="space-y-3">
          {invoices[activeTab].map((invoice) => {
            const StatusIcon = getStatusIcon(invoice.status);
            return (
              <div key={invoice.id} className="finance-card p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 style={{ color: '#535353' }}>{invoice.id}</h3>
                      <span 
                        className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                        style={{ background: `${getStatusColor(invoice.status)}20`, color: getStatusColor(invoice.status) }}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {invoice.status}
                      </span>
                    </div>
                    <p className="text-sm mb-2" style={{ color: '#848484' }}>{invoice.entity}</p>
                    <p className="text-sm mb-3" style={{ color: '#535353' }}>{invoice.services}</p>
                    <div className="flex items-center gap-4 text-xs" style={{ color: '#848484' }}>
                      <span>Issued: {invoice.issuedDate}</span>
                      {invoice.status === 'pending' && <span>Due: {invoice.dueDate}</span>}
                      {invoice.status === 'paid' && <span>Paid: {invoice.paidDate}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl mb-1" style={{ color: '#535353' }}>
                      ৳{invoice.amount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {}}
                    className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-sm"
                    style={{ background: 'rgba(142, 197, 252, 0.2)', color: '#5B9FFF' }}
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => {}}
                    className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-sm"
                    style={{ background: 'rgba(184, 167, 255, 0.2)', color: '#8B7AE8' }}
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  {invoice.status === 'pending' && (
                    <button
                      onClick={() => {}}
                      className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-sm"
                      style={{ background: 'rgba(168, 224, 99, 0.2)', color: '#7CE577' }}
                    >
                      <CreditCard className="w-4 h-4" />
                      Pay
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {invoices[activeTab].length === 0 && (
          <div className="text-center py-12 finance-card">
            <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#7CE577' }} />
            <p style={{ color: '#535353' }}>No {activeTab} invoices</p>
            <p className="text-sm" style={{ color: '#848484' }}>
              {activeTab === 'overdue' && "Great! You're all caught up on payments."}
              {activeTab === 'pending' && 'You have no pending invoices at this time.'}
              {activeTab === 'paid' && 'Your payment history will appear here.'}
            </p>
          </div>
        )}
      </div>
    </div>
    </>

  );
}
