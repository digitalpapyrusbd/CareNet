import { Package, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
  productCount: number;
  icon?: string;
}

interface ProductCategoriesProps {
  categories: Category[];
  onAddCategory: (name: string) => void;
  onEditCategory: (id: string, name: string) => void;
  onDeleteCategory: (id: string) => void;
}

export function ProductCategories({ categories, onAddCategory, onEditCategory, onDeleteCategory }: ProductCategoriesProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleAdd = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName);
      setNewCategoryName("");
      setShowAddForm(false);
    }
  };

  const handleEdit = (id: string) => {
    if (editName.trim()) {
      onEditCategory(id, editName);
      setEditingId(null);
      setEditName("");
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ color: '#535353' }}>Product Categories</h1>
          <Button onClick={() => setShowAddForm(true)} size="sm"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
            <Plus className="w-4 h-4 mr-2" />Add Category
          </Button>
        </div>

        {showAddForm && (
          <div className="finance-card p-6 mb-6">
            <h3 className="mb-4" style={{ color: '#535353' }}>New Category</h3>
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name..."
              className="mb-4 bg-white/50 border-white/50"
            />
            <div className="flex gap-3">
              <Button onClick={() => setShowAddForm(false)} variant="outline" className="flex-1 bg-white/50 border-white/50">
                Cancel
              </Button>
              <Button onClick={handleAdd} disabled={!newCategoryName.trim()} className="flex-1"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
                Add Category
              </Button>
            </div>
          </div>
        )}

        {categories.length === 0 ? (
          <div className="finance-card p-8 text-center">
            <Package className="w-16 h-16 mx-auto mb-4" style={{ color: '#848484' }} />
            <p style={{ color: '#848484' }}>No categories yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="finance-card p-4">
                {editingId === category.id ? (
                  <div className="space-y-3">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Category name..."
                      className="bg-white/50 border-white/50"
                    />
                    <div className="flex gap-2">
                      <Button onClick={() => setEditingId(null)} size="sm" variant="outline"
                        className="flex-1 bg-white/50 border-white/50">
                        Cancel
                      </Button>
                      <Button onClick={() => handleEdit(category.id)} size="sm" className="flex-1"
                        style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 style={{ color: '#535353' }}>{category.name}</h3>
                      <p className="text-sm" style={{ color: '#848484' }}>{category.productCount} products</p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => { setEditingId(category.id); setEditName(category.name); }}
                        size="sm" variant="outline" className="bg-white/50 border-white/50">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button onClick={() => onDeleteCategory(category.id)} size="sm" variant="outline"
                        className="bg-white/50 border-white/50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

