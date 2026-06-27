"use client";

import React, { useEffect, useState } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { getStats, StatsResponse } from "@/lib/api";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="font-body-md text-body-md text-on-surface antialiased flex flex-col md:flex-row min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 flex flex-col w-full min-w-0 max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg overflow-y-auto">
        <header className="mb-xl">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-2">System Dashboard</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Live overview of civic infrastructure health.</p>
        </header>

        {loading ? (
          <div className="p-xl text-center text-on-surface-variant">Loading dashboard stats...</div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-xl">
            <div className="bg-surface-container-lowest border border-outline-variant rounded p-lg flex flex-col">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2">Health Score</span>
              <span className={`font-display-md text-display-md ${stats.health_score > 70 ? 'text-primary' : 'text-brand-signal'}`}>{stats.health_score}/100</span>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded p-lg flex flex-col">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2">Total Reports</span>
              <span className="font-display-md text-display-md text-on-surface">{stats.total}</span>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded p-lg flex flex-col">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2">Active Issues</span>
              <span className="font-display-md text-display-md text-on-surface">{stats.active}</span>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded p-lg flex flex-col">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2">Critical Severity</span>
              <span className="font-display-md text-display-md text-brand-signal">{stats.critical}</span>
            </div>
          </div>
        ) : (
          <div className="p-xl text-center text-on-surface-variant">Failed to load stats.</div>
        )}

        <div className="bg-surface-container-lowest border border-outline-variant rounded p-lg min-h-[300px] flex items-center justify-center">
          <p className="text-on-surface-variant italic">Interactive Charts & Metrics coming soon.</p>
        </div>
      </main>
    </div>
  );
}
