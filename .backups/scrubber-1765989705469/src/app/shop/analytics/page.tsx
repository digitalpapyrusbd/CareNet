'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

import React from 'react';
import Layout from '@/components/layout/Layout';
import { TrendingUp, ShoppingCart, Package, DollarSign } from 'lucide-react';

const metrics = [
  { label: 'Total Sales', value: '284K', period: 'This Month', icon: DollarSign, accent: '#A8E063' },
  { label: 'Orders', value: 142, period: 'This Month', icon: ShoppingCart, accent: '#8EC5FC' },
  { label: 'Top Product', value: 'BP Monitor', period: '28 sold', icon: Package, accent: '#B8A7FF' },
  { label: 'Growth', value: '+22%', period: 'vs Last Month', icon: TrendingUp, accent: '#FFB3C1' },
];

const topProducts = [
  { name: 'Blood Pressure Monitor', sold: 28, revenue: 61600 },
  { name: 'Wheelchair - Standard', sold: 15, revenue: 127500 },
  { name: 'Oxygen Concentrator (Rental)', sold: 12, revenue: 60000 },
];

export default function ShopAnalyticsPage() {
  const { t } = useTranslationContext();
  return (
    <>
      <UniversalNav userRole="shop" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 px-4 py-8 pb-24 md:pt-14">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-semibold mb-6" style={{ color: '#535353' }}>{t('page.heading.shopanalytics')}</h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
              <div key={metric.label} className="finance-card p-5 rounded-3xl">
                  <Icon className="w-6 h-6 mb-2" style={{ color: metric.accent }} />
                  <p className="text-2xl font-semibold" style={{ color: metric.accent }}>{metric.value}</p>
                  <p className="text-xs" style={{ color: '#848484' }}>{metric.label}</p>
                  <p className="text-xs" style={{ color: '#848484' }}>{metric.period}</p>
                </div>
              );
            })}
          </div>

          <div className="finance-card p-6 rounded-3xl mb-6">
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#535353' }}>{t('page.heading.topproducts')}</h2>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.7)' }}>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)', color: 'white' }}>
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold" style={{ color: '#535353' }}>{product.name}</p>
                      <p className="text-sm" style={{ color: '#848484' }}>{product.sold} units sold</p>
                    </div>
                  </div>
                  <p className="font-semibold" style={{ color: '#8B7AE8' }}>{product.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="finance-card p-6 rounded-3xl">
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#535353' }}>{t('page.heading.revenuebycategory')}</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span style={{ color: '#848484' }}>{t('page.text.medicaldevices')}</span>
                <span style={{ color: '#535353' }}>142K (50%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: '#848484' }}>{t('page.text.equipmentsales')}</span>
                <span style={{ color: '#535353' }}>98K (35%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: '#848484' }}>{t('page.text.equipmentrentals')}</span>
                <span style={{ color: '#535353' }}>44K (15%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}
