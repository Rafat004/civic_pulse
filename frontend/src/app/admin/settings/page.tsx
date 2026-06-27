"use client";

import React, { useEffect, useState } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { getSettings, updateSettings, SystemSettings } from "@/lib/api";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = (key: keyof SystemSettings) => {
    if (!settings) return;
    setSettings((prev) => ({
      ...prev!,
      [key]: typeof prev![key] === "boolean" ? !prev![key] : prev![key],
    }));
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await updateSettings(settings);
      alert("Settings saved successfully!");
    } catch (e) {
      console.error(e);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="font-body-md text-body-md text-on-surface antialiased flex flex-col md:flex-row min-h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 flex flex-col w-full min-w-0 max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg overflow-y-auto">
          <div className="p-xl text-center text-on-surface-variant">Loading settings...</div>
        </main>
      </div>
    );
  }

  if (!settings) {
    return null;
  }

  return (
    <div className="font-body-md text-body-md text-on-surface antialiased flex flex-col md:flex-row min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 flex flex-col w-full min-w-0 max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg overflow-y-auto">
        <header className="mb-xl border-b border-outline-variant pb-6 flex justify-between items-end">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Platform Settings</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Configure automation, security, and notification preferences.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-on-primary font-label-caps text-sm uppercase px-6 py-2 rounded hover:shadow-lg transition-all shadow-sm disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* AI Automation Settings */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary text-[28px]">smart_toy</span>
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">AI & Automation</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-on-surface">Auto-assign Tickets</h4>
                  <p className="text-sm text-on-surface-variant mt-1">Automatically route verified reports to appropriate municipal departments based on AI category analysis.</p>
                </div>
                <button 
                  onClick={() => handleToggle('auto_assign')}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 flex-shrink-0 ${settings.auto_assign ? 'bg-primary' : 'bg-surface-variant'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${settings.auto_assign ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-on-surface">Smart Deduplication</h4>
                  <p className="text-sm text-on-surface-variant mt-1">Use semantic embeddings to automatically group incoming reports that describe the same physical issue.</p>
                </div>
                <button 
                  onClick={() => handleToggle('smart_deduplication')}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 flex-shrink-0 ${settings.smart_deduplication ? 'bg-primary' : 'bg-surface-variant'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${settings.smart_deduplication ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
              
              <div className="pt-4 border-t border-outline-variant/50">
                <label className="block font-semibold text-on-surface mb-2">AI Confidence Threshold</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" min="50" max="99" 
                    value={settings.ai_confidence_threshold}
                    onChange={(e) => setSettings({...settings, ai_confidence_threshold: Number(e.target.value)})}
                    className="flex-1 accent-primary" 
                  />
                  <span className="font-label-mono font-bold bg-surface-container-low px-2 py-1 rounded border border-outline-variant text-sm">{settings.ai_confidence_threshold}%</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-2">Minimum AI confidence required to auto-verify a report without human review.</p>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-tertiary text-[28px]">notifications_active</span>
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Notifications</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-on-surface">Critical Email Alerts</h4>
                  <p className="text-sm text-on-surface-variant mt-1">Send immediate email notifications to department heads when an issue is scored as Critical Severity (Score &gt; 90).</p>
                </div>
                <button 
                  onClick={() => handleToggle('email_alerts')}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 flex-shrink-0 ${settings.email_alerts ? 'bg-tertiary' : 'bg-surface-variant'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${settings.email_alerts ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-on-surface">SMS Dispatch Alerts</h4>
                  <p className="text-sm text-on-surface-variant mt-1">Send SMS alerts to field workers when a critical ticket is assigned to their queue.</p>
                </div>
                <button 
                  onClick={() => handleToggle('sms_alerts')}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 flex-shrink-0 ${settings.sms_alerts ? 'bg-tertiary' : 'bg-surface-variant'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${settings.sms_alerts ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          </section>

          {/* Security & Access */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-secondary text-[28px]">security</span>
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Security & Access</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-on-surface">Enforce 2-Factor Authentication</h4>
                  <p className="text-sm text-on-surface-variant mt-1">Require all administrative users to authenticate using 2FA via authenticator app.</p>
                </div>
                <button 
                  onClick={() => handleToggle('require_2fa')}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 flex-shrink-0 ${settings.require_2fa ? 'bg-secondary' : 'bg-surface-variant'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${settings.require_2fa ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-2">Admin Session Timeout (Minutes)</label>
                <select 
                  className="w-full bg-surface border border-outline-variant rounded p-3 text-on-surface focus:border-secondary focus:outline-none"
                  value={settings.session_timeout}
                  onChange={(e) => setSettings(prev => ({...prev!, session_timeout: Number(e.target.value)}))}
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={60}>1 Hour</option>
                  <option value={240}>4 Hours</option>
                </select>
                <p className="text-xs text-on-surface-variant mt-2">Administrators will be automatically logged out after this duration of inactivity.</p>
              </div>
            </div>
          </section>
        </div>

      </main>
    </div>
  );
}
