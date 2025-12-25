import { Package, Save, Upload, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { useTranslationContext } from '@/components/providers/TranslationProvider';

interface AddEditProductProps {
  product?: {
    id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    stock: number;
    minStock: number;
    sku: string;
    images: string[];
  };
  onSave: (product: any) => void;
  onCancel: () => void;
}

export function AddEditProduct({ product, onSave, onCancel }: AddEditProductProps) {
  const { t } = useTranslationContext();
  const [formData, setFormData] = useState(product || {
    name: '',
    category: '',
    description: '',
    price: 0,
    stock: 0,
    minStock: 0,
    sku: '',
    images: []
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="mb-6" style={{ color: '#535353' }}>
          {product ? 'Edit Product' : 'Add New Product'}
        </h1>

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 style={{ color: '#535353' }}>{t('addeditproduct.heading.productinformation')}</h3>
              <p className="text-sm" style={{ color: '#848484' }}>{t('addeditproduct.text.basicproductdetails')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Product Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder={t('addeditproduct.placeholder.enterproductname')}
                className="mt-2 bg-white/50 border-white/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category *</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder={t('addeditproduct.placeholder.egmedicalequipment')}
                  className="mt-2 bg-white/50 border-white/50"
                />
              </div>
              <div>
                <Label>SKU *</Label>
                <Input
                  value={formData.sku}
                  onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                  placeholder={t('addeditproduct.placeholder.productsku')}
                  className="mt-2 bg-white/50 border-white/50"
                />
              </div>
            </div>

            <div>
              <Label>Description *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder={t('addeditproduct.placeholder.productdescription')}
                className="mt-2 bg-white/50 border-white/50"
                rows={4}
              />
            </div>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>{t('addeditproduct.heading.pricinginventory')}</h3>

          <div className="space-y-4">
            <div>
              <Label>Price (৳) *</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                placeholder="0"
                className="mt-2 bg-white/50 border-white/50"
                min="0"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Current Stock *</Label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: Number(e.target.value) }))}
                  placeholder="0"
                  className="mt-2 bg-white/50 border-white/50"
                  min="0"
                />
              </div>
              <div>
                <Label>Minimum Stock *</Label>
                <Input
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => setFormData(prev => ({ ...prev, minStock: Number(e.target.value) }))}
                  placeholder="0"
                  className="mt-2 bg-white/50 border-white/50"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>{t('addeditproduct.heading.productimages')}</h3>

          <div className="border-2 border-dashed rounded-lg p-8 text-center mb-4"
            style={{ borderColor: 'rgba(255, 255, 255, 0.5)', background: 'rgba(255, 255, 255, 0.3)' }}>
            <Upload className="w-12 h-12 mx-auto mb-3" style={{ color: '#848484' }} />
            <p className="mb-2" style={{ color: '#535353' }}>{t('addeditproduct.text.dropimageshereorclic')}</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button type="button" variant="outline" className="bg-white/50 border-white/50"
                onClick={() => document.getElementById('image-upload')?.click()}>
                Select Images
              </Button>
            </label>
          </div>

          {imageFiles.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {imageFiles.map((file, index) => (
                <div key={index} className="relative p-2 rounded-lg"
                  style={{ background: 'rgba(124, 229, 119, 0.1)' }}>
                  <p className="text-xs truncate" style={{ color: '#535353' }}>{file.name}</p>
                  <button
                    onClick={() => setImageFiles(prev => prev.filter((_, i) => i !== index))}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255, 107, 122, 0.2)' }}>
                    <X className="w-3 h-3" style={{ color: '#FF6B7A' }} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button onClick={onCancel} variant="outline" className="flex-1 bg-white/50 border-white/50">
            Cancel
          </Button>
          <Button onClick={() => onSave({ ...formData, images: imageFiles })} className="flex-1"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
            <Save className="w-4 h-4 mr-2" />
            {product ? 'Update Product' : 'Add Product'}
          </Button>
        </div>
      </div>
    </div>
  );
}

