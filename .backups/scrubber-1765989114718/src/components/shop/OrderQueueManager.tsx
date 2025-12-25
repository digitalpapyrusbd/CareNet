import { Package, Check, Truck } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  items: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  timestamp: string;
}

interface OrderQueueManagerProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: string) => void;
  onViewDetails: (id: string) => void;
}

export function OrderQueueManager({ orders, onUpdateStatus, onViewDetails }: OrderQueueManagerProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'shipped'>('all');

  const filteredOrders = orders.filter(o => filter === 'all' || o.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FFD180';
      case 'processing': return '#5B9FFF';
      case 'shipped': return '#A8E063';
      case 'delivered': return '#7CE577';
      default: return '#848484';
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Order Queue</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', 'pending', 'processing', 'shipped'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className="px-4 py-2 rounded-lg capitalize text-sm whitespace-nowrap"
              style={{
                background: filter === f 
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                  : 'rgba(255, 255, 255, 0.5)',
                color: filter === f ? 'white' : '#535353'
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div key={order.id} className="finance-card p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p style={{ color: '#535353' }}>#{order.orderNumber}</p>
                    <span className="text-xs px-2 py-1 rounded-full capitalize"
                      style={{
                        background: `${getStatusColor(order.status)}33`,
                        color: getStatusColor(order.status)
                      }}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm mb-1" style={{ color: '#848484' }}>{order.customer}</p>
                  <div className="flex items-center gap-3 text-sm" style={{ color: '#848484' }}>
                    <span>{order.items} items</span>
                    <span>•</span>
                    <span>৳{order.total.toLocaleString()}</span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: '#848484' }}>{order.timestamp}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => onViewDetails(order.id)} variant="outline" className="bg-white/50 border-white/50">
                  View Details
                </Button>
                {order.status === 'pending' && (
                  <Button onClick={() => onUpdateStatus(order.id, 'processing')}
                    style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)', color: 'white' }}>
                    <Check className="w-4 h-4 mr-2" />Confirm
                  </Button>
                )}
                {order.status === 'processing' && (
                  <Button onClick={() => onUpdateStatus(order.id, 'shipped')}
                    style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
                    <Truck className="w-4 h-4 mr-2" />Ship
                  </Button>
                )}
              </div>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="finance-card p-8 text-center">
              <p style={{ color: '#848484' }}>No orders in this category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

