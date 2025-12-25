import { Package, Save } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { useState } from "react";

interface UpdateStockProps {
  item: {
    id: string;
    name: string;
    sku: string;
    currentStock: number;
  };
  onSave: (data: { quantity: number; note: string }) => void;
  onCancel: () => void;
}

export function UpdateStock({ item, onSave, onCancel }: UpdateStockProps) {
  const [quantity, setQuantity] = useState(item.currentStock.toString());
  const [note, setNote] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md finance-card p-8">
        <h2 className="mb-6 text-center" style={{ color: '#535353' }}>Update Stock</h2>

        <div className="finance-card p-4 mb-6 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
            <Package className="w-8 h-8 text-white" />
          </div>
          <p className="mb-1" style={{ color: '#535353' }}>{item.name}</p>
          <p className="text-sm" style={{ color: '#848484' }}>SKU: {item.sku}</p>
          <p className="text-sm mt-2" style={{ color: '#848484' }}>
            Current Stock: <span style={{ color: '#535353' }}>{item.currentStock}</span>
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label style={{ color: '#535353' }}>New Quantity *</Label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter new quantity"
              className="mt-2 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
          </div>

          <div>
            <Label style={{ color: '#535353' }}>Note (Optional)</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note about this stock update..."
              className="mt-2 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={onCancel} variant="outline" className="flex-1 bg-white/50 border-white/50">
            Cancel
          </Button>
          <Button 
            onClick={() => onSave({ quantity: Number(quantity), note })}
            disabled={!quantity || Number(quantity) < 0}
            className="flex-1"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
              color: 'white',
              opacity: (!quantity || Number(quantity) < 0) ? 0.5 : 1
            }}
          >
            <Save className="w-4 h-4 mr-2" />Save
          </Button>
        </div>
      </div>
    </div>
  );
}

