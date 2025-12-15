import { ShoppingCart, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface Order {
  id: string;
  customer: string;
  phone: string;
  orderDate: string;
  items: number;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  deliveryAddress: string;
}

interface OrderQueueProps {
  orders: Order[];
  onViewOrder: (id: string) => void;
}

export function OrderQueue({ orders, onViewOrder }: OrderQueueProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');

  const filteredOrders = orders.filter(o => filter === 'all' || o.status === filter);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'delivered': return { bg: 'rgba(124, 229, 119, 0.2)', text: '#7CE577' };
      case 'shipped': return { bg: 'rgba(142, 197, 252, 0.2)', text: '#5B9FFF' };
      case 'processing': return { bg: 'rgba(255, 209, 128, 0.2)', text: '#FFD180' };
      case 'pending': return { bg: 'rgba(255, 143, 163, 0.2)', text: '#FF8FA3' };
      case 'cancelled': return { bg: 'rgba(255, 107, 122, 0.2)', text: '#FF6B7A' };
      default: return { bg: 'rgba(255, 255, 255, 0.2)', text: '#848484' };
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'delivered') return <CheckCircle className="w-4 h-4" style={{ color: '#7CE577' }} />;
    if (status === 'cancelled') return <XCircle className="w-4 h-4" style={{ color: '#FF6B7A' }} />;
    return <Clock className="w-4 h-4" style={{ color: '#FFD180' }} />;
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Order Queue</h1>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((f) => (
            <button key={f} onClick={() => setFilter(f as any)}
              className="px-4 py-2 rounded-lg capitalize text-sm whitespace-nowrap" style={{
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
            <p style={{ color: '#848484' }}>No orders found</p>
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
                      <ShoppingCart className="w-6 h-6" style={{ color: statusStyle.text }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h3 style={{ color: '#535353' }}>Order #{order.id}</h3>
                          <p className="text-sm" style={{ color: '#848484' }}>{order.customer}</p>
                          <p className="text-xs" style={{ color: '#848484' }}>{order.phone}</p>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full capitalize flex items-center gap-1"
                          style={{ background: statusStyle.bg, color: statusStyle.text }}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg mb-3" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm" style={{ color: '#848484' }}>{order.items} items</span>
                      <span className="text-lg" style={{ color: '#7CE577' }}>৳{order.totalAmount.toLocaleString()}</span>
                    </div>
                    <p className="text-xs" style={{ color: '#848484' }}>
                      📍 {order.deliveryAddress}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs" style={{ color: '#848484' }}>Ordered: {order.orderDate}</p>
                    <Button onClick={() => onViewOrder(order.id)} size="sm"
                      style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
                      <Eye className="w-4 h-4 mr-2" />View
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

