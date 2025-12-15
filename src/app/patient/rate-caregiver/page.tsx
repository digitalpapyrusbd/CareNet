'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const tags = ['Caring', 'Professional', 'Punctual', 'Skilled', 'Friendly'];

export default function PatientRateCaregiverPage() {
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Caring']);
  const [comment, setComment] = useState('');

  const toggleTag = (tag: string) => setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  return (
    <>
      <UniversalNav userRole="patient" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-yellow-50 dark:from-gray-900 dark:to-yellow-950 px-4 py-10 pb-24 md:pt-14">
        <div className="max-w-2xl mx-auto finance-card p-8">
          <h1 className="text-3xl font-semibold mb-2" style={{ color: '#535353' }}>Rate your caregiver</h1>
          <p className="text-sm mb-6" style={{ color: '#848484' }}>Share quick feedback for Shaila to help improve your care.</p>

          <div className="flex items-center gap-2 mb-6 text-3xl">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setRating(star)}>{star <= rating ? '' : ''}</button>
            ))}
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium mb-2" style={{ color: '#535353' }}>What stood out?</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button key={tag} onClick={() => toggleTag(tag)} className="px-4 py-2 rounded-full text-sm"
                  style={{ background: selectedTags.includes(tag) ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)' : 'rgba(255,255,255,0.6)', color: selectedTags.includes(tag) ? '#7C2D12' : '#535353' }}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full rounded-3xl border bg-white/70 px-4 py-3 mb-6" placeholder="Optional comments"></textarea>

          <Button className="w-full" style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)', color: '#7C2D12' }}>
            Submit Review
          </Button>
        </div>
      </div>
    </Layout>
    </>

  );
}
