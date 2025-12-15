import { Shield, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface ViewRestrictionsSummaryProps {
  restrictions: {
    canProcessOrders: boolean;
    canAddProducts: boolean;
    canUpdateInventory: boolean;
    canViewOrders: boolean;
    canViewReports: boolean;
    canContactCustomers: boolean;
  };
  reason?: string;
}

export function ViewRestrictionsSummary({ restrictions, reason }: ViewRestrictionsSummaryProps) {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)' }}>
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="mb-2" style={{ color: '#535353' }}>Access Restrictions</h1>
          <p style={{ color: '#848484' }}>Current permissions and limitations</p>
        </div>

        {reason && (
          <div className="finance-card p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" style={{ color: '#FFB74D' }} />
              <div>
                <h3 className="mb-1" style={{ color: '#535353' }}>Restriction Reason</h3>
                <p className="text-sm" style={{ color: '#848484' }}>{reason}</p>
              </div>
            </div>
          </div>
        )}

        <div className="finance-card p-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Permissions Overview</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg"
              style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <div className="flex items-center gap-3">
                {restrictions.canProcessOrders ? (
                  <CheckCircle className="w-5 h-5" style={{ color: '#7CE577' }} />
                ) : (
                  <XCircle className="w-5 h-5" style={{ color: '#FF6B7A' }} />
                )}
                <span style={{ color: '#535353' }}>Process Orders</span>
              </div>
              <span className="text-xs px-2 py-1 rounded-full"
                style={{
                  background: restrictions.canProcessOrders ? 'rgba(124, 229, 119, 0.2)' : 'rgba(255, 107, 122, 0.2)',
                  color: restrictions.canProcessOrders ? '#7CE577' : '#FF6B7A'
                }}>
                {restrictions.canProcessOrders ? 'Allowed' : 'Restricted'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg"
              style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <div className="flex items-center gap-3">
                {restrictions.canAddProducts ? (
                  <CheckCircle className="w-5 h-5" style={{ color: '#7CE577' }} />
                ) : (
                  <XCircle className="w-5 h-5" style={{ color: '#FF6B7A' }} />
                )}
                <span style={{ color: '#535353' }}>Add Products</span>
              </div>
              <span className="text-xs px-2 py-1 rounded-full"
                style={{
                  background: restrictions.canAddProducts ? 'rgba(124, 229, 119, 0.2)' : 'rgba(255, 107, 122, 0.2)',
                  color: restrictions.canAddProducts ? '#7CE577' : '#FF6B7A'
                }}>
                {restrictions.canAddProducts ? 'Allowed' : 'Restricted'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg"
              style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <div className="flex items-center gap-3">
                {restrictions.canUpdateInventory ? (
                  <CheckCircle className="w-5 h-5" style={{ color: '#7CE577' }} />
                ) : (
                  <XCircle className="w-5 h-5" style={{ color: '#FF6B7A' }} />
                )}
                <span style={{ color: '#535353' }}>Update Inventory</span>
              </div>
              <span className="text-xs px-2 py-1 rounded-full"
                style={{
                  background: restrictions.canUpdateInventory ? 'rgba(124, 229, 119, 0.2)' : 'rgba(255, 107, 122, 0.2)',
                  color: restrictions.canUpdateInventory ? '#7CE577' : '#FF6B7A'
                }}>
                {restrictions.canUpdateInventory ? 'Allowed' : 'Restricted'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg"
              style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <div className="flex items-center gap-3">
                {restrictions.canViewOrders ? (
                  <CheckCircle className="w-5 h-5" style={{ color: '#7CE577' }} />
                ) : (
                  <XCircle className="w-5 h-5" style={{ color: '#FF6B7A' }} />
                )}
                <span style={{ color: '#535353' }}>View Orders</span>
              </div>
              <span className="text-xs px-2 py-1 rounded-full"
                style={{
                  background: restrictions.canViewOrders ? 'rgba(124, 229, 119, 0.2)' : 'rgba(255, 107, 122, 0.2)',
                  color: restrictions.canViewOrders ? '#7CE577' : '#FF6B7A'
                }}>
                {restrictions.canViewOrders ? 'Allowed' : 'Restricted'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg"
              style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <div className="flex items-center gap-3">
                {restrictions.canViewReports ? (
                  <CheckCircle className="w-5 h-5" style={{ color: '#7CE577' }} />
                ) : (
                  <XCircle className="w-5 h-5" style={{ color: '#FF6B7A' }} />
                )}
                <span style={{ color: '#535353' }}>View Reports</span>
              </div>
              <span className="text-xs px-2 py-1 rounded-full"
                style={{
                  background: restrictions.canViewReports ? 'rgba(124, 229, 119, 0.2)' : 'rgba(255, 107, 122, 0.2)',
                  color: restrictions.canViewReports ? '#7CE577' : '#FF6B7A'
                }}>
                {restrictions.canViewReports ? 'Allowed' : 'Restricted'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg"
              style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <div className="flex items-center gap-3">
                {restrictions.canContactCustomers ? (
                  <CheckCircle className="w-5 h-5" style={{ color: '#7CE577' }} />
                ) : (
                  <XCircle className="w-5 h-5" style={{ color: '#FF6B7A' }} />
                )}
                <span style={{ color: '#535353' }}>Contact Customers</span>
              </div>
              <span className="text-xs px-2 py-1 rounded-full"
                style={{
                  background: restrictions.canContactCustomers ? 'rgba(124, 229, 119, 0.2)' : 'rgba(255, 107, 122, 0.2)',
                  color: restrictions.canContactCustomers ? '#7CE577' : '#FF6B7A'
                }}>
                {restrictions.canContactCustomers ? 'Allowed' : 'Restricted'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

