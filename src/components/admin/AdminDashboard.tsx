import {
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from 'lucide-react';
import { useStore } from '../../store';

export default function AdminDashboard() {
  const { state } = useStore();

  const orders = state.orders || [];
  const users = state.users || [];
  const products = state.products || [];

  // Calculate stats
  const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders = orders.length;
  const totalCustomers = users.length;
  const totalProducts = products.filter(p => p.active).length;

  // Today's stats
  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(o => o.createdAt.startsWith(today));
  const todayRevenue = todayOrders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.totalAmount, 0);

  // Recent orders
  const recentOrders = orders.slice(0, 5);

  // Top products
  const topProducts = [...products]
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 5);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const stats = [
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      up: true,
      icon: IndianRupee,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      label: 'Total Orders',
      value: totalOrders,
      change: '+8.2%',
      up: true,
      icon: ShoppingCart,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Customers',
      value: totalCustomers,
      change: '+15.3%',
      up: true,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'Active Products',
      value: totalProducts,
      change: '+2',
      up: true,
      icon: Package,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, Admin! 👋</h2>
        <p className="text-primary-100">Here's what's happening with your store today.</p>
        <div className="mt-4 flex gap-6">
          <div>
            <p className="text-3xl font-bold">₹{todayRevenue.toLocaleString()}</p>
            <p className="text-sm text-primary-200">Today's Revenue</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{todayOrders.length}</p>
            <p className="text-sm text-primary-200">Orders Today</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                  stat.up ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}
              >
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                    {order.customerName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                    <p className="text-xs text-gray-500">{order.orderNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No orders yet</p>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Top Products</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {topProducts.map((product, i) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                    {i + 1}
                  </span>
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200">
                    {product.images[0] && (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.salesCount} sales</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-900">₹{(product.salesCount * product.price).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Add Product', icon: Package, color: 'bg-blue-600' },
            { label: 'Create Coupon', icon: TrendingUp, color: 'bg-purple-600' },
            { label: 'View Orders', icon: ShoppingCart, color: 'bg-emerald-600' },
            { label: 'Export Data', icon: ArrowUpRight, color: 'bg-orange-600' },
          ].map((action) => (
            <button
              key={action.label}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
