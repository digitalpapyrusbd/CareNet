'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, UserCog, Edit, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function ModeratorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [name, setName] = useState('Afsana Rahman');
  const [email, setEmail] = useState('afsana@carenet.bd');
  const [phone, setPhone] = useState('+880 1712-345678');
  const [status, setStatus] = useState('active');

  return (
    <>
      <UniversalNav userRole="admin" showBack={true} />
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
          <h1 className="mb-2" style={{ color: '#535353' }}>Moderator Details</h1>
          <p style={{ color: '#848484' }}>ID: {id}</p>
        </div>

        <div className="finance-card p-6 mb-6">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)'
            }}
          >
            <UserCog className="w-8 h-8 text-white" />
          </div>

          <div className="space-y-4">
            <div>
              <Label style={{ color: '#535353' }}>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <div>
              <Label style={{ color: '#535353' }}>Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <div>
              <Label style={{ color: '#535353' }}>Phone</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <div>
              <Label style={{ color: '#535353' }}>Status</Label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full mt-2 px-3 py-2 rounded-lg bg-white/50 border border-white/50"
                style={{ color: '#535353' }}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        <Button
          onClick={() => router.back()}
          className="w-full"
          style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
            color: 'white'
          }}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
    </>

  );
}
