import { useState } from 'react';
import {
  Search,
  Eye,
  Package,
  Mail,
  Download,
  ChevronDown,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  X,
  Send,
} from 'lucide-react';
import { useStore } from '../../store';
import type { Order, OrderStatus, PaymentStatus } from '../../types';

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pending', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: Clock },
  processing: { label: 'Processing', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Package },
  completed: { label: 'Completed', color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle },
  failed: { label: 'Failed', color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
  refunded: { label: 'Refunded', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: RotateCcw },
  cancelled: { label: 'Cancelled', color: 'bg-gray-50 text-gray-700 border-gray-200', icon: XCircle },
};

const paymentStatusConfig: Record<PaymentStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-800' },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-800' },
  refunded: { label: 'Refunded', color: 'bg-purple-100 text-purple-800' },
};

export default function OrderManager() {
  const { state, dispatch } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const orders = state.orders || [];

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    dispatch({ type: 'UPDATE_ORDER', id, updates: { status } });
  };

  const updatePaymentStatus = (id: string, paymentStatus: PaymentStatus) => {
    dispatch({ type: 'UPDATE_ORDER', id, updates: { paymentStatus } });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.totalAmount, 0);
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: orders.length, color: 'bg-blue-50 text-blue-700' },
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: 'bg-green-50 text-green-700' },
          { label: 'Completed', value: completedOrders, color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Pending', value: pendingOrders, color: 'bg-yellow-50 text-yellow-700' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} rounded-2xl p-5`}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order #, email, or name..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-300 outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as OrderStatus | 'all')}
          className="px-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-300 outline-none"
        >
          <option value="all">All Status</option>
          {Object.entries(statusConfig).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Order</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Items</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Payment</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon;
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">{order.orderNumber}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-xs text-gray-500">{order.customerEmail}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item, i) => (
                          <div key={i} className="w-8 h-8 rounded-lg overflow-hidden border-2 border-white bg-gray-100">
                            {item.productImage && (
                              <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                            )}
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-8 h-8 rounded-lg bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
                      {order.discountAmount > 0 && (
                        <p className="text-xs text-green-600">-₹{order.discountAmount} off</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className={`appearance-none pl-8 pr-8 py-1.5 rounded-full text-xs font-medium border cursor-pointer ${statusConfig[order.status].color}`}
                        >
                          {Object.entries(statusConfig).map(([key, { label }]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                        <StatusIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" />
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => updatePaymentStatus(order.id, e.target.value as PaymentStatus)}
                        className={`appearance-none px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer ${paymentStatusConfig[order.paymentStatus].color}`}
                      >
                        {Object.entries(paymentStatusConfig).map(([key, { label }]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-bounce-in">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Order {selectedOrder.orderNumber}</h3>
                <p className="text-sm text-gray-500">{formatDate(selectedOrder.createdAt)}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-xl hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Customer</h4>
                  <p className="text-sm font-medium text-gray-900">{selectedOrder.customerName}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customerEmail}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customerCountry}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Payment</h4>
                  <p className="text-sm text-gray-900">Provider: {selectedOrder.paymentProvider}</p>
                  {selectedOrder.paymentReference && (
                    <p className="text-sm text-gray-600">Ref: {selectedOrder.paymentReference}</p>
                  )}
                  <span className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-medium ${paymentStatusConfig[selectedOrder.paymentStatus].color}`}>
                    {paymentStatusConfig[selectedOrder.paymentStatus].label}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-200">
                        {item.productImage && (
                          <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                        <p className="text-xs text-gray-500">Downloads: {item.downloadCount}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900">₹{item.unitPrice.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                {selectedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount {selectedOrder.discountCode && `(${selectedOrder.discountCode})`}</span>
                    <span>-₹{selectedOrder.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                {selectedOrder.taxAmount > 0 && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax</span>
                    <span>₹{selectedOrder.taxAmount.toLocaleString()}</span>
                  </div>
                )}
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{selectedOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 py-2.5 px-4 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Resend Download Link
                </button>
                <button className="flex-1 py-2.5 px-4 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Download Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
