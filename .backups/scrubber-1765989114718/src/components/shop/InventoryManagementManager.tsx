import { Package, Edit, AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  lowStockThreshold: number;
  category: string;
}

interface InventoryManagementManagerProps {
  items: InventoryItem[];
  onUpdateStock: (id: string) => void;
  onNotifyAdmin: (id: string) => void;
}

export function InventoryManagementManager({ items, onUpdateStock, onNotifyAdmin }: InventoryManagementManagerProps) {
  const isLowStock = (item: InventoryItem) => item.currentStock <= item.lowStockThreshold;

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Inventory Management</h1>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="finance-card p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{ 
                    background: isLowStock(item)
                      ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
                      : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                  }}>
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p style={{ color: '#535353' }}>{item.name}</p>
                    {isLowStock(item) && (
                      <AlertTriangle className="w-4 h-4" style={{ color: '#FFD180' }} />
                    )}
                  </div>
                  <p className="text-sm mb-2" style={{ color: '#848484' }}>SKU: {item.sku}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span style={{ color: '#848484' }}>Stock: </span>
                      <span style={{ 
                        color: isLowStock(item) ? '#FFD180' : '#7CE577',
                        fontWeight: 'bold'
                      }}>
                        {item.currentStock}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: '#848484' }}>Threshold: </span>
                      <span style={{ color: '#535353' }}>{item.lowStockThreshold}</span>
                    </div>
                  </div>
                  <p className="text-xs mt-1" style={{ color: '#848484' }}>{item.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => onUpdateStock(item.id)} variant="outline" className="bg-white/50 border-white/50">
                  <Edit className="w-4 h-4 mr-2" />Update Stock
                </Button>
                {isLowStock(item) && (
                  <Button onClick={() => onNotifyAdmin(item.id)}
                    style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)', color: 'white' }}>
                    Notify Admin
                  </Button>
                )}
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="finance-card p-8 text-center">
              <p style={{ color: '#848484' }}>No inventory items found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

