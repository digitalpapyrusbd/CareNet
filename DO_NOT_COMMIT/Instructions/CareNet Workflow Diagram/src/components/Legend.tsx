import React from 'react';

export function Legend() {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 max-w-lg">
      <h3 className="text-gray-900 mb-4">Legend</h3>
      
      <div className="space-y-4">
        {/* Node Types */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Node Types</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-16 h-7 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs">
                Start/End
              </div>
              <span className="text-gray-600 text-xs">Start/End Point</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-16 h-10 bg-blue-200 border-2 border-blue-500 rounded flex items-center justify-center text-xs">
                Action
              </div>
              <span className="text-gray-600 text-xs">User Action</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-16 h-10 bg-green-200 border-2 border-green-600 rounded flex items-center justify-center text-xs">
                Process
              </div>
              <span className="text-gray-600 text-xs">System Process</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-200 border-2 border-orange-500 transform rotate-45 flex items-center justify-center">
                <span className="text-xs transform -rotate-45">?</span>
              </div>
              <span className="text-gray-600 text-xs">Decision Point</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-16 h-10 bg-purple-200 border-4 border-purple-600 border-double rounded flex items-center justify-center text-xs">
                External
              </div>
              <span className="text-gray-600 text-xs">External Service</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-12 h-10 bg-teal-100 border-2 border-teal-500" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                <div className="flex items-center justify-center h-full text-xs">🤖</div>
              </div>
              <span className="text-gray-600 text-xs">AI Agent</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-12 h-14 bg-gray-100 border-2 border-gray-500 rounded-3xl flex items-center justify-center text-xs">
                Data
              </div>
              <span className="text-gray-600 text-xs">Data Store</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-16 h-8 rounded-xl flex items-center justify-center text-xs" style={{ backgroundColor: '#FEF9E7', border: '2px solid #F1C40F' }}>
                🔔
              </div>
              <span className="text-gray-600 text-xs">Notification</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-16 h-8 rounded flex items-center justify-center text-xs" style={{ backgroundColor: '#FADBD8', border: '2px solid #E74C3C' }}>
                ⚠️ Error
              </div>
              <span className="text-gray-600 text-xs">Error State</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-10 h-6 rounded flex items-center justify-center text-xs" style={{ backgroundColor: '#F8F9FA', border: '1px solid #ADB5BD' }}>
                📋
              </div>
              <span className="text-gray-600 text-xs">Log Event</span>
            </div>
          </div>
        </div>

        {/* Connector Types */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Flow Types</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-12 h-0.5 bg-gray-800"></div>
              <span className="text-gray-600 text-xs">Normal Flow</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-12 h-0.5 border-t-2 border-dashed border-orange-500"></div>
              <span className="text-gray-600 text-xs">Conditional</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-12 h-0.5 border-t-2 border-dotted border-blue-500"></div>
              <span className="text-gray-600 text-xs">Data Flow</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-12 h-0.5 border-t-2 border-dashed border-red-500"></div>
              <span className="text-gray-600 text-xs">Error Path</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-12 h-0.5 bg-purple-600"></div>
              <span className="text-gray-600 text-xs">Cross-Swimlane</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-12 h-0.5 border-t border-dotted border-gray-500"></div>
              <span className="text-gray-600 text-xs">Logging</span>
            </div>
          </div>
        </div>

        {/* Color Key */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Swimlane Colors</h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#E8DAEF' }}></div>
              <span className="text-gray-600">🔐 Admin</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#F5EEF8' }}></div>
              <span className="text-gray-600">👮 Moderator</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#D4E6F1' }}></div>
              <span className="text-gray-600">🏢 Agency</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#EBF5FB' }}></div>
              <span className="text-gray-600">👔 Agency Mgr</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#D5F5E3' }}></div>
              <span className="text-gray-600">👨‍⚕️ Caregiver</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FDEBD0' }}></div>
              <span className="text-gray-600">👤 Guardian</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FEF9E7' }}></div>
              <span className="text-gray-600">🤒 Patient</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#D1F2EB' }}></div>
              <span className="text-gray-600">🏪 Shop</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#E8F8F5' }}></div>
              <span className="text-gray-600">📦 Shop Mgr</span>
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Quick Reference</h4>
          <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
            <span>🔐 Authentication/Security</span>
            <span>💰 Payment/Financial</span>
            <span>📱 Mobile-specific</span>
            <span>🤖 AI Integration</span>
            <span>⚠️ Error/Warning States</span>
            <span>🔒 Account Locked</span>
            <span>✅ Success/Approved</span>
            <span>❌ Rejected/Failed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
