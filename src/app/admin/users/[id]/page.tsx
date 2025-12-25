'use client';

import React, { useState, useEffect } from 'react';
import { UniversalNav } from '@/components/layout/UniversalNav';
import { useRouter, useParams } from 'next/navigation';
import { Users, ArrowLeft, Edit, Shield, Building2, UserCog, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslationContext } from '@/components/providers/TranslationProvider';
import { apiCall } from '@/lib/api-client';
import { UserRole } from '@/lib/auth';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  phone: string;
  role: UserRole;
  kyc_status: string | null;
  is_active: boolean;
  last_login_at: Date | null;
  created_at: Date;
}

export default function UserDetailPage() {
  const { t } = useTranslationContext();
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'users/[id]/page.tsx:32',message:'User detail page mounted',data:{userId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'users/[id]/page.tsx:42',message:'Fetching user data',data:{userId,endpoint:`/admin/users/${userId}`},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      const response = await apiCall(`/admin/users/${userId}`);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'users/[id]/page.tsx:45',message:'User data received',data:{hasUser:!!response.data,userId:response.data?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      setUser(response.data);
    } catch (error: any) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'users/[id]/page.tsx:49',message:'User fetch error',data:{error:error?.message,status:error?.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      console.error('Error fetching user:', error);
      setError(error?.message || 'Failed to load user');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
      case UserRole.MODERATOR:
        return <Shield className="w-5 h-5" />;
      case UserRole.AGENCY:
        return <Building2 className="w-5 h-5" />;
      case UserRole.CAREGIVER:
        return <UserCog className="w-5 h-5" />;
      case UserRole.GUARDIAN:
        return <Heart className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return { bg: 'rgba(255, 107, 122, 0.2)', text: '#FF6B7A' };
      case UserRole.MODERATOR:
        return { bg: 'rgba(184, 167, 255, 0.2)', text: '#8B7AE8' };
      case UserRole.AGENCY:
        return { bg: 'rgba(142, 197, 252, 0.2)', text: '#5B9FFF' };
      case UserRole.CAREGIVER:
        return { bg: 'rgba(124, 229, 119, 0.2)', text: '#7CE577' };
      case UserRole.GUARDIAN:
        return { bg: 'rgba(255, 179, 193, 0.2)', text: '#FF8FA3' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.2)', text: '#848484' };
    }
  };

  if (isLoading) {
    return (
      <div className="relative">
        <UniversalNav userRole="admin" showBack={true} />
        <div className="min-h-screen pb-6 pb-24 md:pt-14">
          <div className="p-6">
            <div className="finance-card p-8 text-center">
              <p style={{ color: '#848484' }}>Loading user...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="relative">
        <UniversalNav userRole="admin" showBack={true} />
        <div className="min-h-screen pb-6 pb-24 md:pt-14">
          <div className="p-6">
            <div className="finance-card p-8 text-center">
              <p style={{ color: '#FF6B7A' }}>{error || 'User not found'}</p>
              <Button onClick={() => router.back()} className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const roleStyle = getRoleColor(user.role);
  const statusStyle = user.is_active 
    ? { bg: 'rgba(124, 229, 119, 0.2)', text: '#7CE577' }
    : { bg: 'rgba(255, 107, 122, 0.2)', text: '#FF6B7A' };

  return (
    <div className="relative">
      <UniversalNav userRole="admin" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.back()}
                variant="outline"
                size="sm"
                className="bg-white/50 border-white/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />Back
              </Button>
              <h1 style={{ color: '#535353' }}>User Details</h1>
            </div>
            <Button
              onClick={() => router.push(`/admin/users/${user.id}/edit`)}
              variant="outline"
              className="bg-white/50 border-white/50"
            >
              <Edit className="w-4 h-4 mr-2" />Edit
            </Button>
          </div>

          <div className="finance-card p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)' }}>
                {getRoleIcon(user.role)}
              </div>
              <div className="flex-1">
                <h2 style={{ color: '#535353', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                  {user.name || 'No Name'}
                </h2>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs px-3 py-1 rounded-full capitalize"
                    style={{ background: roleStyle.bg, color: roleStyle.text }}>
                    {user.role.replace('_', ' ')}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full"
                    style={{ background: statusStyle.bg, color: statusStyle.text }}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                  {user.kyc_status && (
                    <span className="text-xs px-3 py-1 rounded-full capitalize"
                      style={{ background: 'rgba(142, 197, 252, 0.2)', color: '#5B9FFF' }}>
                      KYC: {user.kyc_status}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                <p className="text-xs mb-1" style={{ color: '#848484' }}>Email</p>
                <p className="text-sm" style={{ color: '#535353' }}>{user.email || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                <p className="text-xs mb-1" style={{ color: '#848484' }}>Phone</p>
                <p className="text-sm" style={{ color: '#535353' }}>{user.phone}</p>
              </div>
              <div className="p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                <p className="text-xs mb-1" style={{ color: '#848484' }}>Joined</p>
                <p className="text-sm" style={{ color: '#535353' }}>
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                <p className="text-xs mb-1" style={{ color: '#848484' }}>Last Login</p>
                <p className="text-sm" style={{ color: '#535353' }}>
                  {user.last_login_at 
                    ? new Date(user.last_login_at).toLocaleDateString()
                    : 'Never'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

