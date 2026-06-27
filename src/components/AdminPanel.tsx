import { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Bot,
  CreditCard,
  Database,
  Settings,
  LogOut,
  Home,
  Menu,
  X,
} from 'lucide-react';
import { useStore } from '../store';

// Import admin components
import AdminDashboard from './admin/AdminDashboard';
import ProductManager from './admin/ProductManager';
import OrderManager from './admin/OrderManager';
import UserManager from './admin/UserManager';
import CouponManager from './admin/CouponManager';
import ChatbotSettings from './admin/ChatbotSettings';
import PaymentSettings from './admin/PaymentSettings';
import IntegrationSettings from './admin/IntegrationSettings';

type AdminTab =
  | 'dashboard'
  | 'products'
  | 'orders'
  | 'users'
  | 'coupons'
  | 'chatbot'
  | 'payments'
  | 'integrations';

const tabs: { id: AdminTab; label: string; icon: any; group: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'main' },
  { id: 'products', label: 'Products', icon: Package, group: 'store' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, group: 'store' },
  { id: 'users', label: 'Customers', icon: Users, group: 'store' },
  { id: 'coupons', label: 'Coupons', icon: Tag, group: 'store' },
  { id: 'chatbot', label: 'AI Chatbot', icon: Bot, group: 'settings' },
  { id: 'payments', label: 'Payments', icon: CreditCard, group: 'settings' },
  { id: 'integrations', label: 'Integrations', icon: Database, group: 'settings' },
];

export default function AdminPanel() {
  const { dispatch } = useStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'products':
        return <ProductManager />;
      case 'orders':
        return <OrderManager />;
      case 'users':
        return <UserManager />;
      case 'coupons':
        return <CouponManager />;
      case 'chatbot':
        return <ChatbotSettings />;
      case 'payments':
        return <PaymentSettings />;
      case 'integrations':
        return <IntegrationSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  const groupedTabs = {
    main: tabs.filter((t) => t.group === 'main'),
    store: tabs.filter((t) => t.group === 'store'),
    settings: tabs.filter((t) => t.group === 'settings'),
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 lg:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">Admin</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            {Object.entries(groupedTabs).map(([group, groupTabs]) => (
              <div key={group} className="mb-6">
                <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {group === 'main' ? 'Overview' : group === 'store' ? 'Store Management' : 'Settings'}
                </p>
                <div className="space-y-1">
                  {groupTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          activeTab === tab.id
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={() => dispatch({ type: 'NAVIGATE', page: 'home' })}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 mb-2"
            >
              <Home className="w-5 h-5" />
              View Store
            </button>
            <button
              onClick={() => dispatch({ type: 'ADMIN_LOGOUT' })}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-lg font-bold text-gray-900">
                {tabs.find((t) => t.id === activeTab)?.label || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-green-700">Store Online</span>
              </div>
              <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">{renderContent()}</main>
      </div>
    </div>
  );
}
