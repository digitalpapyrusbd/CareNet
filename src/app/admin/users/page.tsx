'use client';

import React, { useState, useEffect } from 'react';
import { UniversalNav } from '@/components/layout/UniversalNav';
import { useRouter } from 'next/navigation';
import { Users, Search, Eye, Edit, Ban, Shield, UserCog, Building2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export default function UsersManagementPage() {
  const { t } = useTranslationContext();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | UserRole>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [filter, search, page]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });
      
      if (filter !== 'all') {
        params.append('role', filter);
      }
      
      if (search) {
        params.append('search', search);
      }

      const response = await apiCall(`/admin/users?${params.toString()}`);
      setUsers(response.data || []);
      setTotalPages(response.meta?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching users:', error);
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

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? { bg: 'rgba(124, 229, 119, 0.2)', text: '#7CE577' }
      : { bg: 'rgba(255, 107, 122, 0.2)', text: '#FF6B7A' };
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case UserRole.AGENCY:
        return 'Agency';
      case UserRole.SUPER_ADMIN:
        return 'Super Admin';
      default:
        return role.replace('_', ' ');
    }
  };

  const filteredUsers = users;

  return (
    <div className="relative">
      <UniversalNav userRole="admin" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 style={{ color: '#535353' }}>User Management</h1>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#848484' }} />
              <Input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10 bg-white/50 border-white/50"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {['all', UserRole.SUPER_ADMIN, UserRole.MODERATOR, UserRole.AGENCY, UserRole.CAREGIVER, UserRole.GUARDIAN].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f as 'all' | UserRole);
                  setPage(1);
                }}
                className="flex-shrink-0 px-4 py-2 rounded-lg capitalize text-sm whitespace-nowrap"
                style={{
                  background: filter === f ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' : 'rgba(255, 255, 255, 0.5)',
                  color: filter === f ? 'white' : '#535353'
                }}
              >
                {f === 'all' ? 'All' : getRoleDisplayName(f as UserRole)}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="finance-card p-8 text-center">
              <p style={{ color: '#848484' }}>Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="finance-card p-8 text-center">
              <Users className="w-16 h-16 mx-auto mb-4" style={{ color: '#848484' }} />
              <p style={{ color: '#848484' }}>No users found</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {filteredUsers.map((user) => {
                  const roleStyle = getRoleColor(user.role);
                  const statusStyle = getStatusColor(user.is_active);
                  return (
                    <div key={user.id} className="finance-card p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                          style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)' }}>
                          {getRoleIcon(user.role)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h3 style={{ color: '#535353' }}>{user.name || 'No Name'}</h3>
                            <div className="flex gap-2">
                              <span className="text-xs px-3 py-1 rounded-full capitalize"
                                style={{ background: roleStyle.bg, color: roleStyle.text }}>
                                {getRoleDisplayName(user.role)}
                              </span>
                              <span className="text-xs px-3 py-1 rounded-full"
                                style={{ background: statusStyle.bg, color: statusStyle.text }}>
                                {user.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                          {user.email && (
                            <p className="text-sm mb-1" style={{ color: '#848484' }}>{user.email}</p>
                          )}
                          <p className="text-xs" style={{ color: '#848484' }}>{user.phone}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3 p-3 rounded-lg"
                        style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                        <div>
                          <p className="text-xs mb-1" style={{ color: '#848484' }}>Joined</p>
                          <p className="text-sm" style={{ color: '#535353' }}>
                            {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs mb-1" style={{ color: '#848484' }}>Last Login</p>
                          <p className="text-sm" style={{ color: '#535353' }}>
                            {user.last_login_at 
                              ? new Date(user.last_login_at).toLocaleDateString()
                              : 'Never'}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          onClick={() => {
                            // #region agent log
                            fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'users/page.tsx:215',message:'User detail navigation clicked',data:{userId:user.id,targetPath:`/admin/users/${user.id}`},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
                            // #endregion
                            router.push(`/admin/users/${user.id}`);
                          }}
                          size="sm" 
                          variant="outline"
                          className="flex-1 bg-white/50 border-white/50"
                        >
                          <Eye className="w-4 h-4 mr-2" />View
                        </Button>
                        {!user.is_active && (
                          <Button 
                            onClick={() => {}} 
                            size="sm" 
                            variant="outline"
                            className="bg-white/50 border-white/50"
                          >
                            <Ban className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    size="sm"
                    variant="outline"
                    className="bg-white/50 border-white/50"
                  >
                    Previous
                  </Button>
                  <span style={{ color: '#535353' }}>
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    size="sm"
                    variant="outline"
                    className="bg-white/50 border-white/50"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
