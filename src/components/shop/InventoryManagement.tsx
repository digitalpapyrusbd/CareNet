import { Package, AlertTriangle, TrendingUp, Download } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  lastRestocked: string;
}

interface InventoryManagementProps {
  inventory: InventoryItem[];
  onUpdateStock: (id: string, newStock: number) => void;
  onExport: () => void;
}

export function InventoryManagement({ inventory, onUpdateStock, onExport }: InventoryManagementProps) {
  const [filter, setFilter] = useState<'all' | 'low' | 'ok' | 'overstocked'>('all');

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minStock) return 'low';
    if (item.currentStock >= item.maxStock) return 'overstocked';
    return 'ok';
  };

  const filteredInventory = inventory.filter(item => {
    if (filter === 'all') return true;
    return getStockStatus(item) === filter;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'low': return { bg: 'rgba(255, 107, 122, 0.2)', text: '#FF6B7A' };
      case 'overstocked': return { bg: 'rgba(255, 209, 128, 0.2)', text: '#FFD180' };
      case 'ok': return { bg: 'rgba(124, 229, 119, 0.2)', text: '#7CE577' };
      default: return { bg: 'rgba(255, 255, 255, 0.2)', text: '#848484' };
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ color: '#535353' }}>Inventory Management</h1>
          <Button onClick={onExport} size="sm" variant="outline" className="bg-white/50 border-white/50">
            <Download className="w-4 h-4 mr-2" />Export
          </Button>
        </div>

        <div className="flex gap-2 mb-6">
          {['all', 'low', 'ok', 'overstocked'].map((f) => (
            <button key={f} onClick={() => setFilter(f as any)}
              className="flex-1 px-4 py-2 rounded-lg capitalize text-sm" style={{
                background: filter === f ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' : 'rgba(255, 255, 255, 0.5)',
                color: filter === f ? 'white' : '#535353'
              }}>
              {f}
            </button>
          ))}
        </div>

        {filteredInventory.length === 0 ? (
          <div className="finance-card p-8 text-center">
            <Package className="w-16 h-16 mx-auto mb-4" style={{ color: '#848484' }} />
            <p style={{ color: '#848484' }}>No inventory items found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredInventory.map((item) => {
              const status = getStockStatus(item);
              const statusStyle = getStatusColor(status);
              return (
                <div key={item.id} className="finance-card p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: statusStyle.bg }}>
                      {status === 'low' ? (
                        <AlertTriangle className="w-6 h-6" style={{ color: statusStyle.text }} />
                      ) : (
                        <Package className="w-6 h-6" style={{ color: statusStyle.text }} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h3 style={{ color: '#535353' }}>{item.name}</h3>
                          <p className="text-xs" style={{ color: '#848484' }}>SKU: {item.sku}</p>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full capitalize"
                          style={{ background: statusStyle.bg, color: statusStyle.text }}>
                          {status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                    <div className="p-2 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                      <p className="text-xs mb-1" style={{ color: '#848484' }}>Current</p>
                      <p style={{ color: '#535353' }}>{item.currentStock}</p>
                    </div>
                    <div className="p-2 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                      <p className="text-xs mb-1" style={{ color: '#848484' }}>Min</p>
                      <p style={{ color: '#535353' }}>{item.minStock}</p>
                    </div>
                    <div className="p-2 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                      <p className="text-xs mb-1" style={{ color: '#848484' }}>Max</p>
                      <p style={{ color: '#535353' }}>{item.maxStock}</p>
                    </div>
                  </div>

                  <p className="text-xs mb-2" style={{ color: '#848484' }}>
                    Last restocked: {item.lastRestocked}
                  </p>

                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Update stock"
                      className="flex-1 bg-white/50 border-white/50"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const newStock = parseInt((e.target as HTMLInputElement).value);
                          if (!isNaN(newStock)) {
                            onUpdateStock(item.id, newStock);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                    />
                    <Button size="sm"
                      style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
                      <TrendingUp className="w-4 h-4" />
                    </Button>
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

