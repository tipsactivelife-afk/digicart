import { useState } from 'react';
import {
  Database,
  Mail,
  BarChart3,
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

export default function IntegrationSettings() {
  const { state, dispatch } = useStore();
  const [supabase, setSupabase] = useState(state.adminSettings.supabase);
  const [email, setEmail] = useState(state.adminSettings.email);
  const [analytics, setAnalytics] = useState(state.adminSettings.analytics);
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
    dispatch({ type: 'UPDATE_ADMIN_SETTINGS', settings: { supabase, email, analytics } });
    setTimeout(() => setSaving(false), 500);
  };

  const InputField = ({ label, value, onChange, secret = false, secretKey = '', helper, placeholder }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    secret?: boolean;
    secretKey?: string;
    helper?: string;
    placeholder?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={secret && !showSecrets[secretKey] ? 'password' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
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
      {/* Supabase */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Database className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Supabase</h2>
              <p className="text-sm text-gray-500">Database & Authentication</p>
            </div>
          </div>
          <StatusBadge connected={!!supabase.projectUrl && !!supabase.anonKey} />
        </div>

        <div className="space-y-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <button
              onClick={() => setSupabase((prev) => ({ ...prev, enabled: !prev.enabled }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${supabase.enabled ? 'bg-primary-600' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${supabase.enabled ? 'translate-x-5' : ''}`} />
            </button>
            <span className="text-sm text-gray-700">Enable Supabase</span>
          </label>

          <InputField
            label="Project URL"
            value={supabase.projectUrl}
            onChange={(v) => setSupabase((prev) => ({ ...prev, projectUrl: v }))}
            placeholder="https://xxxxx.supabase.co"
            helper="Find in Supabase project settings"
          />

          <InputField
            label="Anon Key (Public)"
            value={supabase.anonKey}
            onChange={(v) => setSupabase((prev) => ({ ...prev, anonKey: v }))}
            secret
            secretKey="supabase-anon"
            helper="Safe to use in frontend"
          />

          <InputField
            label="Service Role Key (Secret)"
            value={supabase.serviceRoleKey}
            onChange={(v) => setSupabase((prev) => ({ ...prev, serviceRoleKey: v }))}
            secret
            secretKey="supabase-service"
            helper="⚠️ Never expose in frontend - use in serverless functions only"
          />

          <a href="https://app.supabase.com" target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700">
            <ExternalLink className="w-4 h-4" /> Open Supabase Dashboard
          </a>
        </div>
      </div>

      {/* Email */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Email Settings</h2>
              <p className="text-sm text-gray-500">Transactional emails</p>
            </div>
          </div>
          <StatusBadge connected={!!email.apiKey} />
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Provider</label>
            <select
              value={email.provider}
              onChange={(e) => setEmail((prev) => ({ ...prev, provider: e.target.value as any }))}
              className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm"
            >
              <option value="resend">Resend</option>
              <option value="loops">Loops.so</option>
              <option value="smtp">Custom SMTP</option>
            </select>
          </div>

          <InputField
            label="API Key"
            value={email.apiKey}
            onChange={(v) => setEmail((prev) => ({ ...prev, apiKey: v }))}
            secret
            secretKey="email-api"
          />

          <div className="grid md:grid-cols-2 gap-6">
            <InputField
              label="From Email"
              value={email.fromEmail}
              onChange={(v) => setEmail((prev) => ({ ...prev, fromEmail: v }))}
              placeholder="no-reply@yourdomain.com"
            />
            <InputField
              label="From Name"
              value={email.fromName}
              onChange={(v) => setEmail((prev) => ({ ...prev, fromName: v }))}
              placeholder="DigiCraft Store"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Email Templates</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {Object.entries(email.templates).map(([key, enabled]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setEmail((prev) => ({
                      ...prev,
                      templates: { ...prev.templates, [key]: e.target.checked },
                    }))}
                    className="w-4 h-4 rounded border-gray-300 text-primary-600"
                  />
                  <span className="text-sm text-gray-700">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Analytics</h2>
            <p className="text-sm text-gray-500">Track visitors and conversions</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Plausible Analytics</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <button
                  onClick={() => setAnalytics((prev) => ({ ...prev, plausible: { ...prev.plausible, enabled: !prev.plausible.enabled } }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${analytics.plausible.enabled ? 'bg-primary-600' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${analytics.plausible.enabled ? 'translate-x-5' : ''}`} />
                </button>
              </label>
            </div>
            <input
              type="text"
              value={analytics.plausible.domain}
              onChange={(e) => setAnalytics((prev) => ({ ...prev, plausible: { ...prev.plausible, domain: e.target.value } }))}
              placeholder="yourdomain.com"
              className="w-full px-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm"
            />
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Google Analytics 4</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <button
                  onClick={() => setAnalytics((prev) => ({ ...prev, ga4: { ...prev.ga4, enabled: !prev.ga4.enabled } }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${analytics.ga4.enabled ? 'bg-primary-600' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${analytics.ga4.enabled ? 'translate-x-5' : ''}`} />
                </button>
              </label>
            </div>
            <input
              type="text"
              value={analytics.ga4.measurementId}
              onChange={(e) => setAnalytics((prev) => ({ ...prev, ga4: { ...prev.ga4, measurementId: e.target.value } }))}
              placeholder="G-XXXXXXXXXX"
              className="w-full px-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm"
            />
          </div>
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
          Save All Settings
        </button>
      </div>
    </div>
  );
}
