import { useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Package,
  X,
  Save,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { useStore } from '../../store';
import type { Product, ProductCategory } from '../../types';
import { categoryLabels, categoryEmojis } from '../../data';

const emptyProduct: Omit<Product, 'id' | 'createdAt'> = {
  name: '',
  slug: '',
  shortDescription: '',
  description: '',
  price: 0,
  originalPrice: 0,
  currency: '₹',
  category: 'notion-templates',
  tags: [],
  images: [''],
  rating: 0,
  reviewCount: 0,
  salesCount: 0,
  featured: false,
  bestseller: false,
  newArrival: true,
  limitedOffer: false,
  stockLeft: undefined,
  whatsIncluded: [''],
  whoIsFor: [''],
  howToUse: [''],
  fileFormat: '',
  fileSize: '',
  instantDownload: true,
  downloadUrl: '',
  active: true,
};

export default function ProductManager() {
  const { state, dispatch } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<ProductCategory | 'all'>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'createdAt'>>(emptyProduct);
  const [saving, setSaving] = useState(false);

  const products = state.products || [];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const openCreateForm = () => {
    setFormData(emptyProduct);
    setIsCreating(true);
    setEditingProduct(null);
  };

  const openEditForm = (product: Product) => {
    setFormData({
      ...product,
      tags: product.tags || [],
      images: product.images.length > 0 ? product.images : [''],
      whatsIncluded: product.whatsIncluded.length > 0 ? product.whatsIncluded : [''],
      whoIsFor: product.whoIsFor.length > 0 ? product.whoIsFor : [''],
      howToUse: product.howToUse.length > 0 ? product.howToUse : [''],
    });
    setEditingProduct(product);
    setIsCreating(false);
  };

  const closeForm = () => {
    setEditingProduct(null);
    setIsCreating(false);
    setFormData(emptyProduct);
  };

  const updateFormField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field: string, index: number, value: string) => {
    setFormData((prev) => {
      const arr = [...(prev as any)[field]];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev as any)[field], ''],
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev as any)[field].filter((_: any, i: number) => i !== index),
    }));
  };

  const handleSave = async () => {
    setSaving(true);

    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const productData = {
      ...formData,
      slug,
      tags: formData.tags.filter((t) => t.trim()),
      images: formData.images.filter((i) => i.trim()),
      whatsIncluded: formData.whatsIncluded.filter((w) => w.trim()),
      whoIsFor: formData.whoIsFor.filter((w) => w.trim()),
      howToUse: formData.howToUse.filter((h) => h.trim()),
    };

    if (editingProduct) {
      dispatch({ type: 'UPDATE_PRODUCT', id: editingProduct.id, updates: productData });
    } else {
      dispatch({ type: 'CREATE_PRODUCT', product: productData as any });
    }

    setSaving(false);
    closeForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      dispatch({ type: 'DELETE_PRODUCT', id });
    }
  };

  const toggleActive = (product: Product) => {
    dispatch({ type: 'UPDATE_PRODUCT', id: product.id, updates: { active: !product.active } });
  };

  const categories: ProductCategory[] = [
    'notion-templates',
    'canva-templates',
    'ai-prompts',
    'course-bundles',
    'design-assets',
  ];

  const isFormOpen = isCreating || editingProduct !== null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500">{products.length} total products</p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-300 outline-none"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as ProductCategory | 'all')}
          className="px-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-300 outline-none"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {categoryLabels[cat]}
            </option>
          ))}
        </select>
      </div>

      {/* Product List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Sales
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{product.shortDescription}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {product.featured && (
                            <span className="text-[10px] font-medium text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full">
                              Featured
                            </span>
                          )}
                          {product.bestseller && (
                            <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                              Bestseller
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {categoryEmojis[product.category]} {categoryLabels[product.category]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {product.currency}{product.price.toLocaleString()}
                      </p>
                      {product.originalPrice > product.price && (
                        <p className="text-xs text-gray-400 line-through">
                          {product.currency}{product.originalPrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{product.salesCount}</span>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-xs text-gray-500">{product.rating}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(product)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        product.active
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {product.active ? (
                        <>
                          <Eye className="w-3.5 h-3.5" /> Active
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" /> Hidden
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditForm(product)}
                        className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl my-8 animate-bounce-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Create New Product'}
              </h3>
              <button
                onClick={closeForm}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormField('name', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-300 outline-none"
                    placeholder="e.g., Ultimate Notion Dashboard"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => updateFormField('slug', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-300 outline-none"
                    placeholder="auto-generated-from-name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Short Description *
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => updateFormField('shortDescription', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-300 outline-none"
                  placeholder="Brief one-liner about the product"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormField('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-300 outline-none resize-none"
                  placeholder="Detailed product description..."
                />
              </div>

              {/* Pricing */}
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Price *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => updateFormField('price', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Original Price</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => updateFormField('originalPrice', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => updateFormField('category', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-300 outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {categoryLabels[cat]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Left</label>
                  <input
                    type="number"
                    value={formData.stockLeft || ''}
                    onChange={(e) => updateFormField('stockLeft', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-300 outline-none"
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <ImageIcon className="w-4 h-4 inline mr-1" /> Image URLs
                </label>
                {formData.images.map((img, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      type="url"
                      value={img}
                      onChange={(e) => updateArrayField('images', i, e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-300 outline-none"
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('images', i)}
                        className="px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-xl"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('images')}
                  className="text-sm text-primary-600 font-medium hover:text-primary-700"
                >
                  + Add Image
                </button>
              </div>

              {/* Flags */}
              <div className="flex flex-wrap gap-4">
                {[
                  { key: 'featured', label: 'Featured' },
                  { key: 'bestseller', label: 'Bestseller' },
                  { key: 'newArrival', label: 'New Arrival' },
                  { key: 'limitedOffer', label: 'Limited Offer' },
                  { key: 'active', label: 'Active' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(formData as any)[key]}
                      onChange={(e) => updateFormField(key, e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>

              {/* What's Included */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">What's Included</label>
                {formData.whatsIncluded.map((item, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateArrayField('whatsIncluded', i, e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm"
                      placeholder="Feature or included item"
                    />
                    {formData.whatsIncluded.length > 1 && (
                      <button type="button" onClick={() => removeArrayItem('whatsIncluded', i)} className="px-3 py-2.5 text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem('whatsIncluded')} className="text-sm text-primary-600 font-medium">
                  + Add Item
                </button>
              </div>

              {/* File Info */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">File Format</label>
                  <input
                    type="text"
                    value={formData.fileFormat}
                    onChange={(e) => updateFormField('fileFormat', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm"
                    placeholder="e.g., Notion Template Link"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">File Size</label>
                  <input
                    type="text"
                    value={formData.fileSize}
                    onChange={(e) => updateFormField('fileSize', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm"
                    placeholder="e.g., 15 MB or Cloud-based"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Download URL</label>
                  <input
                    type="url"
                    value={formData.downloadUrl || ''}
                    onChange={(e) => updateFormField('downloadUrl', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm"
                    placeholder="Secure download link"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-gray-100">
              <button
                onClick={closeForm}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.name || !formData.shortDescription || !formData.price}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
