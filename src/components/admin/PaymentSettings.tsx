import { useState } from 'react';
import {
  CreditCard,
  Zap,
  Save,
  Eye,
  EyeOff,
  Copy,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../store';

export default function PaymentSettings() {
  const { state, dispatch } = useStore();
  const [localSettings, setLocalSettings] = useState(state.adminSettings.payments);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

  const toggleSecret = (key: string) => {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    dispatch({ type: 'SET_NOTIFICATION', notification: { message: 'Copied!', type: 'success' } });
  };

  const handleSave = () => {
    setSaving(true);
    dispatch({ type: 'UPDATE_ADMIN_SETTINGS', settings: { payments: localSettings } });
    setTimeout(() => setSaving(false), 500);
  };

  const updateRazorpay = (field: string, value: any) => {
    setLocalSettings((prev) => ({ ...prev, razorpay: { ...prev.razorpay, [field]: value } }));
  };

  const updateStripe = (field: string, value: any) => {
    setLocalSettings((prev) => ({ ...prev, stripe: { ...prev.stripe, [field]: value } }));
  };

  const InputField = ({ label, value, onChange, secret = false, secretKey = '', helper }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    secret?: boolean;
    secretKey?: string;
    helper?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={secret && !showSecrets[secretKey] ? 'password' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm pr-20"
        />
        {secret && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <button onClick={() => toggleSecret(secretKey)} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400">
              {showSecrets[secretKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button onClick={() => copyToClipboard(value)} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400">
              <Copy className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      {helper && <p className="text-xs text-gray-400 mt-1">{helper}</p>}
    </div>
  );

  const StatusBadge = ({ connected }: { connected: boolean }) => (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
      connected ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
    }`}>
      {connected ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
      {connected ? 'Connected' : 'Not configured'}
    </span>
  );

  return (
    <div className="space-y-6">
      {/* Razorpay */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Razorpay</h2>
              <p className="text-sm text-gray-500">India payments (UPI, Cards, Wallets)</p>
            </div>
          </div>
          <StatusBadge connected={!!localSettings.razorpay.keyId} />
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <button
                onClick={() => updateRazorpay('enabled', !localSettings.razorpay.enabled)}
                className={`relative w-11 h-6 rounded-full transition-colors ${localSettings.razorpay.enabled ? 'bg-primary-600' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${localSettings.razorpay.enabled ? 'translate-x-5' : ''}`} />
              </button>
              <span className="text-sm text-gray-700">Enable Razorpay</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <button
                onClick={() => updateRazorpay('testMode', !localSettings.razorpay.testMode)}
                className={`relative w-11 h-6 rounded-full transition-colors ${localSettings.razorpay.testMode ? 'bg-amber-500' : 'bg-green-500'}`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${localSettings.razorpay.testMode ? 'translate-x-5' : ''}`} />
              </button>
              <span className="text-sm text-gray-700">{localSettings.razorpay.testMode ? 'Test Mode' : 'Live Mode'}</span>
            </label>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <InputField
              label="Key ID"
              value={localSettings.razorpay.keyId}
              onChange={(v) => updateRazorpay('keyId', v)}
              secret
              secretKey="rzp-key"
            />
            <InputField
              label="Key Secret"
              value={localSettings.razorpay.keySecret}
              onChange={(v) => updateRazorpay('keySecret', v)}
              secret
              secretKey="rzp-secret"
            />
          </div>

          <InputField
            label="Webhook Secret"
            value={localSettings.razorpay.webhookSecret}
            onChange={(v) => updateRazorpay('webhookSecret', v)}
            secret
            secretKey="rzp-webhook"
            helper="Configure at: https://dashboard.razorpay.com/app/webhooks"
          />

          <a href="https://dashboard.razorpay.com" target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
            <ExternalLink className="w-4 h-4" /> Open Razorpay Dashboard
          </a>
        </div>
      </div>

      {/* Stripe */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Stripe</h2>
              <p className="text-sm text-gray-500">International payments</p>
            </div>
          </div>
          <StatusBadge connected={!!localSettings.stripe.publishableKey} />
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <button
                onClick={() => updateStripe('enabled', !localSettings.stripe.enabled)}
                className={`relative w-11 h-6 rounded-full transition-colors ${localSettings.stripe.enabled ? 'bg-primary-600' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${localSettings.stripe.enabled ? 'translate-x-5' : ''}`} />
              </button>
              <span className="text-sm text-gray-700">Enable Stripe</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <button
                onClick={() => updateStripe('testMode', !localSettings.stripe.testMode)}
                className={`relative w-11 h-6 rounded-full transition-colors ${localSettings.stripe.testMode ? 'bg-amber-500' : 'bg-green-500'}`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${localSettings.stripe.testMode ? 'translate-x-5' : ''}`} />
              </button>
              <span className="text-sm text-gray-700">{localSettings.stripe.testMode ? 'Test Mode' : 'Live Mode'}</span>
            </label>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <InputField
              label="Publishable Key"
              value={localSettings.stripe.publishableKey}
              onChange={(v) => updateStripe('publishableKey', v)}
              secret
              secretKey="stripe-pub"
            />
            <InputField
              label="Secret Key"
              value={localSettings.stripe.secretKey}
              onChange={(v) => updateStripe('secretKey', v)}
              secret
              secretKey="stripe-secret"
            />
          </div>

          <InputField
            label="Webhook Secret"
            value={localSettings.stripe.webhookSecret}
            onChange={(v) => updateStripe('webhookSecret', v)}
            secret
            secretKey="stripe-webhook"
            helper="Configure at: https://dashboard.stripe.com/webhooks"
          />

          <a href="https://dashboard.stripe.com" target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700">
            <ExternalLink className="w-4 h-4" /> Open Stripe Dashboard
          </a>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Payment Settings
        </button>
      </div>
    </div>
  );
}
