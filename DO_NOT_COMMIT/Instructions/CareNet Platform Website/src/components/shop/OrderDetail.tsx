import { ShoppingCart, MapPin, Phone, Package, CheckCircle, XCircle, Truck } from "lucide-react";
import { Button } from "../ui/button";

interface OrderDetailProps {
  order: {
    id: string;
    customer: {
      name: string;
      phone: string;
      email: string;
    };
    orderDate: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      price: number;
    }>;
    deliveryAddress: string;
    paymentMethod: string;
    subtotal: number;
    deliveryFee: number;
    total: number;
    trackingNumber?: string;
  };
  onUpdateStatus: (status: string) => void;
  onCancel: () => void;
}

export function OrderDetail({ order, onUpdateStatus, onCancel }: OrderDetailProps) {
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

  const statusStyle = getStatusColor(order.status);

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ color: '#535353' }}>Order #{order.id}</h1>
          <span className="text-sm px-4 py-2 rounded-full capitalize"
            style={{ background: statusStyle.bg, color: statusStyle.text }}>
            {order.status}
          </span>
        </div>

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}>
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 style={{ color: '#535353' }}>Customer Information</h3>
              <p className="text-sm" style={{ color: '#848484' }}>Order placed on {order.orderDate}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>Name:</span>
              <span style={{ color: '#535353' }}>{order.customer.name}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>Phone:</span>
              <span style={{ color: '#535353' }}>{order.customer.phone}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>Email:</span>
              <span style={{ color: '#535353' }}>{order.customer.email}</span>
            </div>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5" style={{ color: '#5B9FFF' }} />
            <h3 style={{ color: '#535353' }}>Delivery Address</h3>
          </div>
          <p className="text-sm" style={{ color: '#535353' }}>{order.deliveryAddress}</p>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Order Items</h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p style={{ color: '#535353' }}>{item.name}</p>
                    <p className="text-xs" style={{ color: '#848484' }}>Qty: {item.quantity}</p>
                  </div>
                </div>
                <p style={{ color: '#535353' }}>৳{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/50 space-y-2">
            <div className="flex justify-between text-sm">
              <span style={{ color: '#848484' }}>Subtotal:</span>
              <span style={{ color: '#535353' }}>৳{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: '#848484' }}>Delivery Fee:</span>
              <span style={{ color: '#535353' }}>৳{order.deliveryFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/50">
              <span style={{ color: '#535353' }}><strong>Total:</strong></span>
              <span className="text-xl" style={{ color: '#7CE577' }}>৳{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {order.trackingNumber && (
          <div className="finance-card p-4 mb-6" style={{ borderLeft: '4px solid #5B9FFF' }}>
            <div className="flex items-center gap-2 mb-2">
              <Truck className="w-5 h-5" style={{ color: '#5B9FFF' }} />
              <p style={{ color: '#535353' }}>Tracking Number</p>
            </div>
            <p className="text-sm" style={{ color: '#848484' }}>{order.trackingNumber}</p>
          </div>
        )}

        {order.status !== 'delivered' && order.status !== 'cancelled' && (
          <div className="finance-card p-6 mb-6">
            <h3 className="mb-4" style={{ color: '#535353' }}>Update Order Status</h3>
            <div className="grid grid-cols-2 gap-3">
              {order.status === 'pending' && (
                <>
                  <Button onClick={() => onUpdateStatus('processing')} className="w-full"
                    style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB347 100%)', color: 'white' }}>
                    Start Processing
                  </Button>
                  <Button onClick={() => onUpdateStatus('cancelled')} variant="outline"
                    className="w-full bg-white/50 border-white/50">
                    Cancel Order
                  </Button>
                </>
              )}
              {order.status === 'processing' && (
                <Button onClick={() => onUpdateStatus('shipped')} className="col-span-2"
                  style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)', color: 'white' }}>
                  <Truck className="w-4 h-4 mr-2" />Mark as Shipped
                </Button>
              )}
              {order.status === 'shipped' && (
                <Button onClick={() => onUpdateStatus('delivered')} className="col-span-2"
                  style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
                  <CheckCircle className="w-4 h-4 mr-2" />Mark as Delivered
                </Button>
              )}
            </div>
          </div>
        )}

        <Button onClick={onCancel} variant="outline" className="w-full bg-white/50 border-white/50">
          Back to Orders
        </Button>
      </div>
    </div>
  );
}

