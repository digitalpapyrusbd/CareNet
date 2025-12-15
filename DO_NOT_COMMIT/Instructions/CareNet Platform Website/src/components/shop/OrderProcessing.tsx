import { ShoppingCart, CheckCircle, Package, Truck } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface Order {
  id: string;
  customer: string;
  items: Array<{ name: string; quantity: number }>;
  status: 'pending' | 'processing' | 'ready';
  orderTime: string;
}

interface OrderProcessingProps {
  orders: Order[];
  onStartProcessing: (id: string) => void;
  onMarkReady: (id: string) => void;
}

export function OrderProcessing({ orders, onStartProcessing, onMarkReady }: OrderProcessingProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'ready'>('all');

  const filteredOrders = orders.filter(o => filter === 'all' || o.status === filter);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ready': return { bg: 'rgba(124, 229, 119, 0.2)', text: '#7CE577' };
      case 'processing': return { bg: 'rgba(255, 209, 128, 0.2)', text: '#FFD180' };
      case 'pending': return { bg: 'rgba(255, 143, 163, 0.2)', text: '#FF8FA3' };
      default: return { bg: 'rgba(255, 255, 255, 0.2)', text: '#848484' };
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Order Processing</h1>

        <div className="flex gap-2 mb-6">
          {['all', 'pending', 'processing', 'ready'].map((f) => (
            <button key={f} onClick={() => setFilter(f as any)}
              className="flex-1 px-4 py-2 rounded-lg capitalize text-sm" style={{
                background: filter === f ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' : 'rgba(255, 255, 255, 0.5)',
                color: filter === f ? 'white' : '#535353'
              }}>
              {f}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="finance-card p-8 text-center">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4" style={{ color: '#848484' }} />
            <p style={{ color: '#848484' }}>No orders to process</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const statusStyle = getStatusColor(order.status);
              return (
                <div key={order.id} className="finance-card p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: statusStyle.bg }}>
                      <Package className="w-6 h-6" style={{ color: statusStyle.text }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h3 style={{ color: '#535353' }}>Order #{order.id}</h3>
                          <p className="text-sm" style={{ color: '#848484' }}>{order.customer}</p>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full capitalize"
                          style={{ background: statusStyle.bg, color: statusStyle.text }}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg mb-3" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                    <p className="text-xs mb-2" style={{ color: '#848484' }}>Items:</p>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <p key={index} className="text-sm" style={{ color: '#535353' }}>
                          {item.quantity}x {item.name}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs" style={{ color: '#848484' }}>Ordered: {order.orderTime}</p>
                    {order.status === 'pending' && (
                      <Button onClick={() => onStartProcessing(order.id)} size="sm"
                        style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB347 100%)', color: 'white' }}>
                        Start Processing
                      </Button>
                    )}
                    {order.status === 'processing' && (
                      <Button onClick={() => onMarkReady(order.id)} size="sm"
                        style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
                        <CheckCircle className="w-4 h-4 mr-2" />Mark Ready
                      </Button>
                    )}
                    {order.status === 'ready' && (
                      <span className="text-sm flex items-center gap-2" style={{ color: '#7CE577' }}>
                        <Truck className="w-4 h-4" />Ready for Shipping
                      </span>
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

