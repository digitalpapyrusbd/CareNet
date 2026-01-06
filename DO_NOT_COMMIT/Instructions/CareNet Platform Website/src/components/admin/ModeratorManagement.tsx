import { Shield, Plus, Search, Edit, Trash2, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface Moderator {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  lastActive: string;
  workload: number;
}

interface ModeratorManagementProps {
  onAddModerator?: () => void;
  onEditModerator?: (id: string) => void;
  onNavigate?: (page: string) => void;
}

export function ModeratorManagement({
  onAddModerator,
  onEditModerator,
  onNavigate
}: ModeratorManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const moderators: Moderator[] = [
    {
      id: "1",
      name: "Fatima Khan",
      email: "fatima.khan@carenet.com",
      phone: "+880 1712-345678",
      status: 'active',
      lastActive: "2 hours ago",
      workload: 12
    },
    {
      id: "2",
      name: "Rahim Ahmed",
      email: "rahim.ahmed@carenet.com",
      phone: "+880 1712-345679",
      status: 'active',
      lastActive: "5 minutes ago",
      workload: 8
    },
    {
      id: "3",
      name: "Ayesha Begum",
      email: "ayesha.begum@carenet.com",
      phone: "+880 1712-345680",
      status: 'inactive',
      lastActive: "3 days ago",
      workload: 0
    }
  ];

  const filteredModerators = moderators.filter(mod =>
    mod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mod.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 style={{ color: '#535353' }}>Moderator Management</h1>
            <p style={{ color: '#848484' }}>{moderators.length} total moderators</p>
          </div>
          <Button
            onClick={onAddModerator}
            className="rounded-full text-white px-4 py-2"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#848484' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search moderators..."
            className="w-full pl-12 pr-4 py-3 rounded-xl outline-none"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              color: '#535353',
              border: '1px solid rgba(255, 255, 255, 0.8)'
            }}
          />
        </div>

        {/* Moderators List */}
        <div className="space-y-3">
          {filteredModerators.map((moderator) => (
            <div key={moderator.id} className="finance-card p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      background: moderator.status === 'active' 
                        ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                        : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #9E9E9E 0%, #757575 100%)'
                    }}>
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p style={{ color: '#535353' }}>{moderator.name}</p>
                    <p className="text-sm" style={{ color: '#848484' }}>{moderator.email}</p>
                    <p className="text-xs mt-1" style={{ color: '#848484' }}>{moderator.phone}</p>
                  </div>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-xs text-white ${moderator.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`}>
                  {moderator.status === 'active' ? <CheckCircle className="w-3 h-3 inline mr-1" /> : <XCircle className="w-3 h-3 inline mr-1" />}
                  {moderator.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs" style={{ color: '#848484' }}>Last Active</p>
                  <p className="text-sm" style={{ color: '#535353' }}>{moderator.lastActive}</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: '#848484' }}>Workload</p>
                  <p className="text-sm" style={{ color: '#535353' }}>{moderator.workload} items</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => onEditModerator?.(moderator.id)}
                  className="flex-1 py-2 rounded-lg"
                  style={{
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    color: '#667eea'
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
