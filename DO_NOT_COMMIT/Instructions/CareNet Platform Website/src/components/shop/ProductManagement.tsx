import { Package, Plus, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  image?: string;
}

interface ProductManagementProps {
  products: Product[];
  onAddProduct: () => void;
  onEditProduct: (id: string) => void;
  onDeleteProduct: (id: string) => void;
  onViewProduct: (id: string) => void;
}

export function ProductManagement({ products, onAddProduct, onEditProduct, onDeleteProduct, onViewProduct }: ProductManagementProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'out_of_stock'>('all');

  const filteredProducts = products.filter(p => filter === 'all' || p.status === filter);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return { bg: 'rgba(124, 229, 119, 0.2)', text: '#7CE577' };
      case 'inactive': return { bg: 'rgba(142, 197, 252, 0.2)', text: '#5B9FFF' };
      case 'out_of_stock': return { bg: 'rgba(255, 107, 122, 0.2)', text: '#FF6B7A' };
      default: return { bg: 'rgba(255, 255, 255, 0.2)', text: '#848484' };
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ color: '#535353' }}>Product Management</h1>
          <Button onClick={onAddProduct} size="sm"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
            <Plus className="w-4 h-4 mr-2" />Add Product
          </Button>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', 'active', 'inactive', 'out_of_stock'].map((f) => (
            <button key={f} onClick={() => setFilter(f as any)}
              className="px-4 py-2 rounded-lg capitalize text-sm whitespace-nowrap" style={{
                background: filter === f ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' : 'rgba(255, 255, 255, 0.5)',
                color: filter === f ? 'white' : '#535353'
              }}>
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="finance-card p-8 text-center">
            <Package className="w-16 h-16 mx-auto mb-4" style={{ color: '#848484' }} />
            <p style={{ color: '#848484' }}>No products found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product) => {
              const statusStyle = getStatusColor(product.status);
              return (
                <div key={product.id} className="finance-card p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-16 h-16 rounded-lg flex items-center justify-center"
                      style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Package className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h3 style={{ color: '#535353' }}>{product.name}</h3>
                          <p className="text-xs" style={{ color: '#848484' }}>{product.category}</p>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full capitalize"
                          style={{ background: statusStyle.bg, color: statusStyle.text }}>
                          {product.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <p style={{ color: '#7CE577' }}>৳{product.price.toLocaleString()}</p>
                        <p className="text-sm" style={{ color: '#848484' }}>Stock: {product.stock}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => onViewProduct(product.id)} size="sm" variant="outline"
                      className="flex-1 bg-white/50 border-white/50">
                      <Eye className="w-4 h-4 mr-2" />View
                    </Button>
                    <Button onClick={() => onEditProduct(product.id)} size="sm" variant="outline"
                      className="flex-1 bg-white/50 border-white/50">
                      <Edit className="w-4 h-4 mr-2" />Edit
                    </Button>
                    <Button onClick={() => onDeleteProduct(product.id)} size="sm" variant="outline"
                      className="bg-white/50 border-white/50">
                      <Trash2 className="w-4 h-4" />
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

