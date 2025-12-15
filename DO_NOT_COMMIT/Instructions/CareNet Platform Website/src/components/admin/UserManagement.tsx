import { Users, Search, Eye, Ban, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: 'guardian' | 'caregiver' | 'agency' | 'shop' | 'moderator';
  status: 'active' | 'suspended' | 'pending';
  joinedDate: string;
  lastActive: string;
}

interface UserManagementProps {
  users: User[];
  onViewUser: (id: string) => void;
  onSuspendUser: (id: string) => void;
  onActivateUser: (id: string) => void;
}

export function UserManagement({ users, onViewUser, onSuspendUser, onActivateUser }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<'all' | 'guardian' | 'caregiver' | 'agency' | 'shop'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'pending'>('all');

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.phone.includes(searchTerm);
    const matchesType = typeFilter === 'all' || u.userType === typeFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return { bg: 'rgba(124, 229, 119, 0.2)', text: '#7CE577' };
      case 'suspended': return { bg: 'rgba(255, 107, 122, 0.2)', text: '#FF6B7A' };
      case 'pending': return { bg: 'rgba(255, 209, 128, 0.2)', text: '#FFD180' };
      default: return { bg: 'rgba(255, 255, 255, 0.2)', text: '#848484' };
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>User Management</h1>

        <div className="finance-card p-4 mb-6">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#848484' }} />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="pl-10 bg-white/50 border-white/50"
            />
          </div>

          <div className="flex gap-2 mb-2 overflow-x-auto">
            {['all', 'guardian', 'caregiver', 'agency', 'shop'].map((type) => (
              <button key={type} onClick={() => setTypeFilter(type as any)}
                className="px-3 py-1 rounded-lg capitalize text-xs whitespace-nowrap" style={{
                  background: typeFilter === type ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' : 'rgba(255, 255, 255, 0.5)',
                  color: typeFilter === type ? 'white' : '#535353'
                }}>
                {type}
              </button>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {['all', 'active', 'suspended', 'pending'].map((status) => (
              <button key={status} onClick={() => setStatusFilter(status as any)}
                className="px-3 py-1 rounded-lg capitalize text-xs whitespace-nowrap" style={{
                  background: statusFilter === status ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' : 'rgba(255, 255, 255, 0.5)',
                  color: statusFilter === status ? 'white' : '#535353'
                }}>
                {status}
              </button>
            ))}
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="finance-card p-8 text-center">
            <Users className="w-16 h-16 mx-auto mb-4" style={{ color: '#848484' }} />
            <p style={{ color: '#848484' }}>No users found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => {
              const statusStyle = getStatusColor(user.status);
              return (
                <div key={user.id} className="finance-card p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h3 style={{ color: '#535353' }}>{user.name}</h3>
                          <p className="text-sm" style={{ color: '#848484' }}>{user.email}</p>
                          <p className="text-xs" style={{ color: '#848484' }}>{user.phone}</p>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                          <span className="text-xs px-3 py-1 rounded-full capitalize"
                            style={{ background: statusStyle.bg, color: statusStyle.text }}>
                            {user.status}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full capitalize"
                            style={{ background: 'rgba(142, 197, 252, 0.1)', color: '#5B9FFF' }}>
                            {user.userType}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs mb-3" style={{ color: '#848484' }}>
                    <span>Joined: {user.joinedDate}</span>
                    <span>Last active: {user.lastActive}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => onViewUser(user.id)} size="sm" variant="outline"
                      className="flex-1 bg-white/50 border-white/50">
                      <Eye className="w-4 h-4 mr-2" />View
                    </Button>
                    {user.status === 'active' && (
                      <Button onClick={() => onSuspendUser(user.id)} size="sm" variant="outline"
                        className="bg-white/50 border-white/50">
                        <Ban className="w-4 h-4" />
                      </Button>
                    )}
                    {user.status === 'suspended' && (
                      <Button onClick={() => onActivateUser(user.id)} size="sm"
                        style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
                        <CheckCircle className="w-4 h-4 mr-2" />Activate
                      </Button>
                    )}
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

