import { Package, CheckCircle, Truck, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

interface UpdateOrderStatusProps {
  orderId: string;
  currentStatus: string;
  customerName: string;
  items: { name: string; quantity: number }[];
  onUpdateStatus: (status: string, notes: string) => void;
}

export function UpdateOrderStatus({
  orderId,
  currentStatus,
  customerName,
  items,
  onUpdateStatus
}: UpdateOrderStatusProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [notes, setNotes] = useState("");

  const statuses = [
    { value: 'confirmed', label: 'Confirmed', icon: CheckCircle, color: '#7CE577' },
    { value: 'preparing', label: 'Preparing', icon: Package, color: '#FFD180' },
    { value: 'ready', label: 'Ready for Pickup', icon: Package, color: '#5B9FFF' },
    { value: 'shipped', label: 'Shipped', icon: Truck, color: '#8EC5FC' },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: '#A8E063' },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: '#FF8FA3' }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="mb-2" style={{ color: '#535353' }}>Update Order Status</h1>
        <p className="mb-6" style={{ color: '#848484' }}>Order #{orderId}</p>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Order Details</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>Customer:</span>
              <span style={{ color: '#535353' }}>{customerName}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>Current Status:</span>
              <span className="px-2 py-1 rounded-full text-xs capitalize"
                style={{ background: 'rgba(142, 197, 252, 0.2)', color: '#5B9FFF' }}>
                {currentStatus}
              </span>
            </div>
          </div>

          <div className="border-t pt-4" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}>
            <h4 className="mb-2" style={{ color: '#535353' }}>Items:</h4>
            <ul className="space-y-1">
              {items.map((item, index) => (
                <li key={index} className="text-sm" style={{ color: '#848484' }}>
                  {item.name} × {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Select New Status</h3>
          <div className="grid grid-cols-2 gap-3">
            {statuses.map((status) => {
              const Icon = status.icon;
              return (
                <button
                  key={status.value}
                  onClick={() => setSelectedStatus(status.value)}
                  className="p-4 rounded-lg transition-all text-left"
                  style={{
                    background: selectedStatus === status.value
                      ? `${status.color}33`
                      : 'rgba(255, 255, 255, 0.5)',
                    borderLeft: selectedStatus === status.value ? `4px solid ${status.color}` : 'none'
                  }}
                >
                  <Icon className="w-5 h-5 mb-2" style={{ color: status.color }} />
                  <p className="text-sm" style={{ color: '#535353' }}>{status.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Notes (Optional)</h3>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about this status update..."
            className="bg-white/50 border-white/50"
            style={{ color: '#535353' }}
          />
        </div>

        <Button
          onClick={() => onUpdateStatus(selectedStatus, notes)}
          disabled={selectedStatus === currentStatus}
          className="w-full"
          style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
            color: 'white',
            opacity: selectedStatus === currentStatus ? 0.5 : 1
          }}
        >
          <CheckCircle className="w-4 h-4 mr-2" />Update Status
        </Button>
      </div>
    </div>
  );
}

