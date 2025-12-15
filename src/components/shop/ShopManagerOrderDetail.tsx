import { Package, User, MapPin, Phone, Mail, Calendar } from "lucide-react";
import { Button } from "../ui/button";

interface ShopManagerOrderDetailProps {
  order: {
    id: string;
    date: string;
    status: string;
    customer: {
      name: string;
      phone: string;
      email: string;
      address: string;
    };
    items: {
      name: string;
      quantity: number;
      price: number;
    }[];
    total: number;
    notes?: string;
  };
  onUpdateStatus: () => void;
  onContactCustomer: () => void;
}

export function ShopManagerOrderDetail({ order, onUpdateStatus, onContactCustomer }: ShopManagerOrderDetailProps) {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 style={{ color: '#535353' }}>Order Details</h1>
          <p style={{ color: '#848484' }}>Order #{order.id}</p>
        </div>

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ color: '#535353' }}>Order Status</h3>
            <span className="px-3 py-1 rounded-full text-sm capitalize"
              style={{ background: 'rgba(142, 197, 252, 0.2)', color: '#5B9FFF' }}>
              {order.status}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: '#848484' }}>
            <Calendar className="w-4 h-4" />
            <span>{order.date}</span>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Customer Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5" style={{ color: '#5B9FFF' }} />
              <span style={{ color: '#535353' }}>{order.customer.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5" style={{ color: '#5B9FFF' }} />
              <span style={{ color: '#535353' }}>{order.customer.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5" style={{ color: '#5B9FFF' }} />
              <span style={{ color: '#535353' }}>{order.customer.email}</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 shrink-0" style={{ color: '#5B9FFF' }} />
              <span style={{ color: '#535353' }}>{order.customer.address}</span>
            </div>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Order Items</h3>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5" style={{ color: '#FFD180' }} />
                  <div>
                    <p style={{ color: '#535353' }}>{item.name}</p>
                    <p className="text-sm" style={{ color: '#848484' }}>Qty: {item.quantity}</p>
                  </div>
                </div>
                <p style={{ color: '#535353' }}>৳{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}>
            <div className="flex items-center justify-between">
              <span className="text-lg" style={{ color: '#535353' }}>Total:</span>
              <span className="text-2xl" style={{ color: '#535353' }}>৳{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {order.notes && (
          <div className="finance-card p-6 mb-6">
            <h3 className="mb-3" style={{ color: '#535353' }}>Order Notes</h3>
            <p style={{ color: '#535353' }}>{order.notes}</p>
          </div>
        )}

        <div className="flex gap-3">
          <Button onClick={onContactCustomer} variant="outline" className="flex-1 bg-white/50 border-white/50">
            Contact Customer
          </Button>
          <Button onClick={onUpdateStatus} className="flex-1"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)', color: 'white' }}>
            Update Status
          </Button>
        </div>
      </div>
    </div>
  );
}

