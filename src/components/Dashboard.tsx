import { Download, Package, Settings, Clock, ShoppingBag } from 'lucide-react';
import { useStore } from '../store';
import { products } from '../data';

export default function Dashboard() {
  const { dispatch } = useStore();
  // Demo purchased products
  const purchased = products.slice(0, 3);

  return (
    <section className="py-8 sm:py-12 bg-surface min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your purchases and profile.</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-lg font-bold text-white">
            U
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Package, label: 'Products Owned', value: '3' },
            { icon: Download, label: 'Total Downloads', value: '12' },
            { icon: ShoppingBag, label: 'Total Spent', value: '₹2,597' },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-gray-100 p-5 text-center"
            >
              <Icon className="w-6 h-6 text-primary-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 w-fit">
          {['My Purchases', 'Order History', 'Settings'].map((tab, i) => (
            <button
              key={tab}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                i === 0
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Purchases */}
        <div className="space-y-4">
          {purchased.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col sm:flex-row gap-5 hover:border-primary-200 transition-colors"
            >
              <div className="w-full sm:w-32 h-24 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{product.shortDescription}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Purchased on Mar 15, 2024
                      </span>
                      <span>{product.fileFormat}</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-primary-700 flex-shrink-0">
                    {product.currency}{product.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-3 mt-4">
                  <button className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={() =>
                      dispatch({
                        type: 'NAVIGATE',
                        page: 'product-detail',
                        productId: product.id,
                      })
                    }
                    className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:border-primary-300 hover:text-primary-600 transition-all"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Profile Settings Preview */}
        <div className="mt-12 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <Settings className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-bold text-gray-900">Profile Settings</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
              <input
                type="text"
                defaultValue="Demo User"
                className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-300 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                defaultValue="user@example.com"
                className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-300 outline-none"
              />
            </div>
          </div>
          <button className="mt-4 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </section>
  );
}
