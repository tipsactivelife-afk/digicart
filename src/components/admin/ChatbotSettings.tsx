import { useState } from 'react';
import {
  Bot,
  Save,
  Eye,
  EyeOff,
  Copy,
  Palette,
  MessageSquare,
  TestTube,
  Loader2,
} from 'lucide-react';
import { useStore } from '../../store';
import type { AIProvider } from '../../types';

const aiModels: Record<AIProvider, { name: string; models: string[] }> = {
  openai: { name: 'OpenAI', models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'] },
  gemini: { name: 'Google Gemini', models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.0-pro'] },
  claude: { name: 'Anthropic Claude', models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'] },
  custom: { name: 'Custom API', models: [] },
};

export default function ChatbotSettings() {
  const { state, dispatch } = useStore();
  const [localSettings, setLocalSettings] = useState(state.adminSettings.chatbot);
  const [showApiKey, setShowApiKey] = useState(false);
  const [saving, setSaving] = useState(false);

  const updateField = (field: string, value: any) => {
    setLocalSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setSaving(true);
    dispatch({ type: 'UPDATE_ADMIN_SETTINGS', settings: { chatbot: localSettings } });
    setTimeout(() => setSaving(false), 500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    dispatch({ type: 'SET_NOTIFICATION', notification: { message: 'Copied!', type: 'success' } });
  };

  return (
    <div className="space-y-6">
      {/* Main Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">AI Chatbot Settings</h2>
              <p className="text-sm text-gray-500">Configure your AI assistant</p>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm text-gray-600">Enable Chatbot</span>
            <button
              onClick={() => updateField('enabled', !localSettings.enabled)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                localSettings.enabled ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${
                  localSettings.enabled ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </label>
        </div>

        <div className="space-y-6">
          {/* Provider & Model */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">AI Provider</label>
              <select
                value={localSettings.provider}
                onChange={(e) => updateField('provider', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm"
              >
                {Object.entries(aiModels).map(([key, { name }]) => (
                  <option key={key} value={key}>{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Model</label>
              <select
                value={localSettings.model}
                onChange={(e) => updateField('model', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm"
              >
                {aiModels[localSettings.provider].models.map((model) => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">API Key</label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={localSettings.apiKey}
                onChange={(e) => updateField('apiKey', e.target.value)}
                placeholder="sk-..."
                className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm pr-20"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <button onClick={() => setShowApiKey(!showApiKey)} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400">
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={() => copyToClipboard(localSettings.apiKey)} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Get from {aiModels[localSettings.provider].name} dashboard</p>
          </div>

          {/* System Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">System Prompt</label>
            <textarea
              value={localSettings.systemPrompt}
              onChange={(e) => updateField('systemPrompt', e.target.value)}
              rows={5}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm resize-none"
              placeholder="Instructions for AI behavior..."
            />
          </div>

          {/* Messages */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Welcome Message</label>
              <input
                type="text"
                value={localSettings.welcomeMessage}
                onChange={(e) => updateField('welcomeMessage', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Placeholder Text</label>
              <input
                type="text"
                value={localSettings.placeholderText}
                onChange={(e) => updateField('placeholderText', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm"
              />
            </div>
          </div>

          {/* Parameters */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Tokens</label>
              <input
                type="number"
                value={localSettings.maxTokens}
                onChange={(e) => updateField('maxTokens', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Temperature</label>
              <input
                type="number"
                value={localSettings.temperature}
                onChange={(e) => updateField('temperature', parseFloat(e.target.value))}
                step={0.1}
                min={0}
                max={2}
                className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Position</label>
              <select
                value={localSettings.position}
                onChange={(e) => updateField('position', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm"
              >
                <option value="right">Bottom Right</option>
                <option value="left">Bottom Left</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-5 h-5 text-gray-400" />
          <h3 className="text-base font-bold text-gray-900">Appearance</h3>
        </div>
        <div className="flex items-center gap-4">
          <label className="block text-sm font-medium text-gray-700">Primary Color</label>
          <input
            type="color"
            value={localSettings.primaryColor}
            onChange={(e) => updateField('primaryColor', e.target.value)}
            className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer"
          />
          <input
            type="text"
            value={localSettings.primaryColor}
            onChange={(e) => updateField('primaryColor', e.target.value)}
            className="w-32 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm"
          />
        </div>
      </div>

      {/* Quick Replies */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="w-5 h-5 text-gray-400" />
          <h3 className="text-base font-bold text-gray-900">Quick Replies</h3>
        </div>
        <div className="space-y-3">
          {localSettings.quickReplies.map((reply, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={reply}
                onChange={(e) => {
                  const newReplies = [...localSettings.quickReplies];
                  newReplies[i] = e.target.value;
                  updateField('quickReplies', newReplies);
                }}
                className="flex-1 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm"
              />
              <button
                onClick={() => updateField('quickReplies', localSettings.quickReplies.filter((_, idx) => idx !== i))}
                className="px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-xl"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={() => updateField('quickReplies', [...localSettings.quickReplies, ''])}
            className="text-sm text-primary-600 font-medium"
          >
            + Add Quick Reply
          </button>
        </div>
      </div>

      {/* Test & Save */}
      <div className="flex items-center justify-between bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-6 border border-primary-100">
        <div className="flex items-center gap-3">
          <TestTube className="w-5 h-5 text-primary-600" />
          <div>
            <h3 className="font-bold text-gray-900">Test Your Chatbot</h3>
            <p className="text-sm text-gray-600">Save settings and test the chat widget</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_CHAT' })}
            className="px-5 py-2.5 border border-primary-200 text-primary-700 text-sm font-medium rounded-xl hover:bg-primary-50"
          >
            Open Test Chat
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
