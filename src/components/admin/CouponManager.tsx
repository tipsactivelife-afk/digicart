import { useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Tag,
  Percent,
  IndianRupee,
  Calendar,
  X,
  Save,
  Loader2,
  Copy,
  CheckCircle,
} from 'lucide-react';
import { useStore } from '../../store';
import type { Coupon, CouponType, ProductCategory } from '../../types';
import { categoryLabels } from '../../data';

const emptyCoupon: Omit<Coupon, 'id' | 'usedCount' | 'createdAt'> = {
  code: '',
  type: 'percentage',
  value: 10,
  minOrderAmount: undefined,
  maxDiscount: undefined,
  usageLimit: undefined,
  validFrom: new Date().toISOString().split('T')[0],
  validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  isActive: true,
  applicableProducts: [],
  applicableCategories: [],
  description: '',
};

export default function CouponManager() {
  const { state, dispatch } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Omit<Coupon, 'id' | 'usedCount' | 'createdAt'>>(emptyCoupon);
  const [saving, setSaving] = useState(false);

  const coupons = state.coupons || [];

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCreateForm = () => {
    setFormData({ ...emptyCoupon, code: generateCode() });
    setIsCreating(true);
    setEditingCoupon(null);
  };

  const openEditForm = (coupon: Coupon) => {
    setFormData({
      ...coupon,
      validFrom: coupon.validFrom.split('T')[0],
      validUntil: coupon.validUntil.split('T')[0],
    });
    setEditingCoupon(coupon);
    setIsCreating(false);
  };

  const closeForm = () => {
    setEditingCoupon(null);
    setIsCreating(false);
    setFormData(emptyCoupon);
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    dispatch({ type: 'SET_NOTIFICATION', notification: { message: 'Code copied!', type: 'success' } });
  };

  const handleSave = async () => {
    setSaving(true);

    const couponData = {
      ...formData,
      code: formData.code.toUpperCase(),
      validFrom: new Date(formData.validFrom).toISOString(),
      validUntil: new Date(formData.validUntil).toISOString(),
    };

    if (editingCoupon) {
      dispatch({ type: 'UPDATE_COUPON', id: editingCoupon.id, updates: couponData });
    } else {
      dispatch({ type: 'CREATE_COUPON', coupon: couponData });
    }

    setSaving(false);
    closeForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      dispatch({ type: 'DELETE_COUPON', id });
    }
  };

  const toggleActive = (coupon: Coupon) => {
    dispatch({ type: 'UPDATE_COUPON', id: coupon.id, updates: { isActive: !coupon.isActive } });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const isExpired = (date: string) => new Date(date) < new Date();

  const categories: ProductCategory[] = [
    'notion-templates',
    'canva-templates',
    'ai-prompts',
    'course-bundles',
    'design-assets',
  ];

  const isFormOpen = isCreating || editingCoupon !== null;

  const activeCoupons = coupons.filter((c) => c.isActive && !isExpired(c.validUntil)).length;
  const totalUsed = coupons.reduce((sum, c) => sum + c.usedCount, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Coupons', value: coupons.length, icon: Tag, color: 'bg-blue-50 text-blue-700' },
          { label: 'Active', value: activeCoupons, icon: CheckCircle, color: 'bg-green-50 text-green-700' },
          { label: 'Total Used', value: totalUsed, icon: Percent, color: 'bg-purple-50 text-purple-700' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} rounded-2xl p-5 flex items-center gap-4`}>
            <div className="w-12 h-12 bg-white/50 rounded-xl flex items-center justify-center">
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm opacity-80">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coupons..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm"
          />
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Coupon
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCoupons.map((coupon) => {
          const expired = isExpired(coupon.validUntil);
          return (
            <div
              key={coupon.id}
              className={`bg-white rounded-2xl border overflow-hidden ${
                expired ? 'border-gray-200 opacity-60' : coupon.isActive ? 'border-primary-200' : 'border-gray-200'
              }`}
            >
              {/* Header */}
              <div className={`p-4 ${coupon.type === 'percentage' ? 'bg-gradient-to-r from-primary-500 to-primary-600' : 'bg-gradient-to-r from-emerald-500 to-emerald-600'} text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {coupon.type === 'percentage' ? (
                      <Percent className="w-5 h-5" />
                    ) : (
                      <IndianRupee className="w-5 h-5" />
                    )}
                    <span className="text-2xl font-bold">
                      {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleActive(coupon)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      expired
                        ? 'bg-white/20 text-white/80'
                        : coupon.isActive
                        ? 'bg-white text-primary-700'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    {expired ? 'Expired' : coupon.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <code className="text-lg font-bold text-gray-900 tracking-wider">{coupon.code}</code>
                  <button
                    onClick={() => copyCode(coupon.code)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {coupon.description && (
                  <p className="text-sm text-gray-600 mb-3">{coupon.description}</p>
                )}

                <div className="space-y-2 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(coupon.validFrom)} - {formatDate(coupon.validUntil)}
                  </div>
                  {coupon.minOrderAmount && (
                    <div>Min order: ₹{coupon.minOrderAmount}</div>
                  )}
                  {coupon.usageLimit && (
                    <div>Used: {coupon.usedCount} / {coupon.usageLimit}</div>
                  )}
                  {coupon.applicableCategories.length > 0 && (
                    <div>Categories: {coupon.applicableCategories.map(c => categoryLabels[c]).join(', ')}</div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditForm(coupon)}
                    className="flex-1 py-2 px-3 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(coupon.id)}
                    className="py-2 px-3 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 flex items-center justify-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filteredCoupons.length === 0 && (
          <div className="col-span-full text-center py-12 text-sm text-gray-500">
            No coupons found
          </div>
        )}
      </div>

      {/* Coupon Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg animate-bounce-in">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h3>
              <button onClick={closeForm} className="p-2 rounded-xl hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Coupon Code *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="flex-1 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm font-mono uppercase"
                    placeholder="DISCOUNT20"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, code: generateCode() })}
                    className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50"
                  >
                    Generate
                  </button>
                </div>
              </div>

              {/* Type & Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as CouponType })}
                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Value {formData.type === 'percentage' ? '(%)' : '(₹)'}
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm"
                    min={0}
                    max={formData.type === 'percentage' ? 100 : undefined}
                  />
                </div>
              </div>

              {/* Limits */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Min Order Amount</label>
                  <input
                    type="number"
                    value={formData.minOrderAmount || ''}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {formData.type === 'percentage' ? 'Max Discount (₹)' : 'Usage Limit'}
                  </label>
                  <input
                    type="number"
                    value={formData.type === 'percentage' ? formData.maxDiscount || '' : formData.usageLimit || ''}
                    onChange={(e) => {
                      const val = e.target.value ? parseInt(e.target.value) : undefined;
                      if (formData.type === 'percentage') {
                        setFormData({ ...formData, maxDiscount: val });
                      } else {
                        setFormData({ ...formData, usageLimit: val });
                      }
                    }}
                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm"
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Valid From</label>
                  <input
                    type="date"
                    value={formData.validFrom.split('T')[0]}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Valid Until</label>
                  <input
                    type="date"
                    value={formData.validUntil.split('T')[0]}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Applicable Categories</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.applicableCategories.includes(cat)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, applicableCategories: [...formData.applicableCategories, cat] });
                          } else {
                            setFormData({ ...formData, applicableCategories: formData.applicableCategories.filter(c => c !== cat) });
                          }
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-primary-600"
                      />
                      <span className="text-sm text-gray-700">{categoryLabels[cat]}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">Leave empty to apply to all categories</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <input
                  type="text"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm"
                  placeholder="Internal note about this coupon"
                />
              </div>

              {/* Active */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-gray-100">
              <button onClick={closeForm} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.code || !formData.value}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
