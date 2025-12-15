import { Lock, User, Building, Store, Unlock, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface LockedAccountsProps {
  accounts: {
    id: string;
    name: string;
    type: 'caregiver' | 'agency' | 'shop' | 'guardian';
    reason: string;
    lockedDate: string;
    daysLocked: number;
    outstandingAmount?: number;
  }[];
  onUnlock: (accountId: string) => void;
  onViewDetails: (accountId: string) => void;
}

export function LockedAccounts({ accounts, onUnlock, onViewDetails }: LockedAccountsProps) {
  const [filter, setFilter] = useState<string>('all');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'agency': return Building;
      case 'shop': return Store;
      default: return User;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'caregiver': return '#8EC5FC';
      case 'agency': return '#A8E063';
      case 'shop': return '#FFD180';
      default: return '#FFB3C1';
    }
  };

  const filteredAccounts = accounts.filter(acc => filter === 'all' || acc.type === filter);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="mb-6" style={{ color: '#535353' }}>Locked Accounts</h1>

        {/* Filter */}
        <div className="finance-card p-6 mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full p-3 rounded-lg border"
            style={{
              borderColor: 'rgba(255, 255, 255, 0.5)',
              background: 'rgba(255, 255, 255, 0.5)',
              color: '#535353'
            }}
          >
            <option value="all">All Account Types</option>
            <option value="caregiver">Caregivers</option>
            <option value="agency">Agencies</option>
            <option value="shop">Shops</option>
            <option value="guardian">Guardians</option>
          </select>
        </div>

        {/* Accounts List */}
        <div className="space-y-4">
          {filteredAccounts.map((account) => {
            const Icon = getTypeIcon(account.type);
            return (
              <div key={account.id} className="finance-card p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: `${getTypeColor(account.type)}33` }}>
                      <Icon className="w-6 h-6" style={{ color: getTypeColor(account.type) }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 style={{ color: '#535353' }}>{account.name}</h3>
                        <span className="px-2 py-1 rounded-full text-xs capitalize"
                          style={{
                            background: `${getTypeColor(account.type)}33`,
                            color: getTypeColor(account.type)
                          }}>
                          {account.type}
                        </span>
                      </div>

                      <div className="p-3 rounded-lg mb-3" style={{ background: 'rgba(255, 179, 193, 0.1)' }}>
                        <p className="text-sm" style={{ color: '#FF8FA3' }}>{account.reason}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm" style={{ color: '#848484' }}>Locked Date</p>
                          <p style={{ color: '#535353' }}>{account.lockedDate}</p>
                        </div>
                        <div>
                          <p className="text-sm" style={{ color: '#848484' }}>Days Locked</p>
                          <p style={{ color: '#535353' }}>{account.daysLocked} days</p>
                        </div>
                        {account.outstandingAmount && (
                          <div>
                            <p className="text-sm" style={{ color: '#848484' }}>Outstanding</p>
                            <p style={{ color: '#FF8FA3' }}>৳{account.outstandingAmount.toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => onViewDetails(account.id)}
                      variant="outline"
                      className="bg-white/50 border-white/50"
                    >
                      <Eye className="w-4 h-4 mr-2" />Details
                    </Button>
                    <Button
                      onClick={() => onUnlock(account.id)}
                      style={{
                        background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                        color: 'white'
                      }}
                    >
                      <Unlock className="w-4 h-4 mr-2" />Unlock
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredAccounts.length === 0 && (
            <div className="finance-card p-12 text-center">
              <Lock className="w-12 h-12 mx-auto mb-4" style={{ color: '#848484' }} />
              <p style={{ color: '#848484' }}>No locked accounts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

