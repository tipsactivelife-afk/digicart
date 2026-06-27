import { useState } from 'react';
import {
  Search,
  User,
  Mail,
  Phone,
  MapPin,
  Ban,
  CheckCircle,
  Eye,
  X,
  Clock,
  IndianRupee,
} from 'lucide-react';
import { useStore } from '../../store';
import type { User as UserType } from '../../types';

export default function UserManager() {
  const { state, dispatch } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const users = state.users || [];
  const orders = state.orders || [];

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleBlock = (id: string, isBlocked: boolean) => {
    dispatch({ type: 'UPDATE_USER', id, updates: { isBlocked: !isBlocked } });
  };

  const getUserOrders = (email: string) => {
    return orders.filter((o) => o.customerEmail === email);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const totalCustomers = users.length;
  const activeCustomers = users.filter((u) => !u.isBlocked).length;
  const totalSpent = users.reduce((sum, u) => sum + u.totalSpent, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Customers', value: totalCustomers, icon: User, color: 'bg-blue-50 text-blue-700' },
          { label: 'Active', value: activeCustomers, icon: CheckCircle, color: 'bg-green-50 text-green-700' },
          { label: 'Total Spent', value: `₹${totalSpent.toLocaleString()}`, icon: IndianRupee, color: 'bg-purple-50 text-purple-700' },
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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-300 outline-none"
        />
      </div>

      {/* Users Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className={`bg-white rounded-2xl border p-5 hover:shadow-lg transition-all ${
              user.isBlocked ? 'border-red-200 bg-red-50/30' : 'border-gray-100'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-lg font-bold text-white">
                  {user.fullName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    {user.fullName}
                    {user.isBlocked && (
                      <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Blocked</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {user.country}
              </div>
              {user.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  {user.phone}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                Joined {formatDate(user.createdAt)}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <p className="text-lg font-bold text-gray-900">₹{user.totalSpent.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{user.totalOrders} orders</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedUser(user)}
                  className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleBlock(user.id, user.isBlocked)}
                  className={`p-2 rounded-lg transition-colors ${
                    user.isBlocked
                      ? 'text-green-600 hover:bg-green-50'
                      : 'text-red-400 hover:text-red-600 hover:bg-red-50'
                  }`}
                  title={user.isBlocked ? 'Unblock' : 'Block'}
                >
                  {user.isBlocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && (
          <div className="col-span-full text-center py-12 text-sm text-gray-500">
            No customers found
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-bounce-in">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-lg font-bold text-white">
                  {selectedUser.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedUser.fullName}</h3>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-2 rounded-xl hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{selectedUser.totalOrders}</p>
                  <p className="text-xs text-gray-500">Orders</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">₹{selectedUser.totalSpent.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Total Spent</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{selectedUser.lastOrderAt ? formatDate(selectedUser.lastOrderAt) : '-'}</p>
                  <p className="text-xs text-gray-500">Last Order</p>
                </div>
              </div>

              {/* Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Country</p>
                    <p className="text-sm font-medium text-gray-900">{selectedUser.country}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{selectedUser.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Orders History */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Order History</h4>
                <div className="space-y-2">
                  {getUserOrders(selectedUser.email).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                        <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{order.items.length} items</p>
                      </div>
                    </div>
                  ))}
                  {getUserOrders(selectedUser.email).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No orders yet</p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Admin Notes</label>
                <textarea
                  defaultValue={selectedUser.notes || ''}
                  placeholder="Add internal notes about this customer..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 py-2.5 px-4 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" /> Send Email
                </button>
                <button
                  onClick={() => toggleBlock(selectedUser.id, selectedUser.isBlocked)}
                  className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-xl flex items-center justify-center gap-2 ${
                    selectedUser.isBlocked
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {selectedUser.isBlocked ? (
                    <>
                      <CheckCircle className="w-4 h-4" /> Unblock User
                    </>
                  ) : (
                    <>
                      <Ban className="w-4 h-4" /> Block User
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
