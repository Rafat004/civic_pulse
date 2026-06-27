"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getStats, StatsResponse } from "@/lib/api";

export default function StatsPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then((data) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Compute category rollups for the chart
  const road = stats ? ((stats.by_category['pothole'] || 0)) : 0;
  const water = stats ? ((stats.by_category['water'] || 0) + (stats.by_category['garbage'] || 0)) : 0;
  const power = stats ? ((stats.by_category['streetlight'] || 0)) : 0;
  const misc = stats ? ((stats.by_category['other'] || 0)) : 0;

  const maxCat = Math.max(road, water, power, misc, 1); // Avoid division by zero
  const roadPct = Math.round((road / maxCat) * 80); // 80 is max height %
  const waterPct = Math.round((water / maxCat) * 80);
  const powerPct = Math.round((power / maxCat) * 80);
  const miscPct = Math.round((misc / maxCat) * 80);

  // Compute progress bars
  const total = stats ? Math.max(stats.total, 1) : 1;
  const resolvedPct = stats ? (stats.resolved / total) * 100 : 0;
  const pendingPct = stats ? (stats.pending / total) * 100 : 0;
  const criticalPct = stats ? (stats.critical / total) * 100 : 0;

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg">
        <header className="mb-lg">
          <h1 className="font-headline-lg text-headline-lg text-primary mb-2">System Stats</h1>
          <p className="font-body-md text-on-surface-variant">Real-time resolution metrics and overall city health.</p>
        </header>

        {loading ? (
          <div className="p-xl text-center text-on-surface-variant">Loading city statistics...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
            {/* Overall City Health */}
            <div className="bg-surface-container-lowest p-md rounded-lg border border-outline-variant shadow-sm">
              <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4 uppercase">Overall City Health</h3>
              <div className="flex items-end gap-3 mb-4">
                <span className="font-display-lg text-display-lg font-label-mono text-primary">{stats?.health_score || 0}</span>
                <span className="font-body-md text-body-md text-on-surface-variant mb-2">/100</span>
              </div>
              {/* Progress Bar */}
              <div className="w-full h-4 bg-surface-variant rounded-full overflow-hidden flex mb-3">
                <div className="h-full bg-tertiary-container transition-all duration-1000" style={{ width: `${resolvedPct}%` }} title={`Resolved: ${stats?.resolved}`}></div>
                <div className="h-full bg-brand-signal transition-all duration-1000" style={{ width: `${pendingPct}%` }} title={`Pending: ${stats?.pending}`}></div>
                <div className="h-full bg-error transition-all duration-1000" style={{ width: `${criticalPct}%` }} title={`Critical: ${stats?.critical}`}></div>
              </div>
              <div className="flex justify-between font-label-mono text-[14px] text-outline px-1">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tertiary-container"></span> {stats?.resolved || 0} Resolved</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-signal"></span> {stats?.pending || 0} Pending</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-error"></span> {stats?.critical || 0} Critical</span>
              </div>
            </div>

            {/* Active Status */}
            <div className="bg-surface-container-lowest p-md rounded-lg border border-outline-variant flex items-center justify-between shadow-sm">
              <div>
                <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase">Status Overview</h3>
                <div className="font-label-mono text-[48px] leading-tight text-primary font-bold">{stats?.active || 0}</div>
                <div className="font-body-md text-[16px] text-on-surface-variant mt-1">Total Active Issues</div>
              </div>
              <div className="relative w-32 h-32 flex items-center justify-center">
                 <div className={`absolute inset-0 rounded-full border-8 transition-transform duration-1000 ${(stats?.active || 0) > 0 ? 'border-surface-variant border-t-brand-signal border-r-primary-container border-b-primary-container rotate-45' : 'border-surface-variant'}`}></div>
                 <span className="font-label-mono text-primary-container font-bold">{stats?.total || 0} Total</span>
              </div>
            </div>

            {/* Issues by Category */}
            <div className="bg-surface-container-lowest p-md rounded-lg border border-outline-variant shadow-sm lg:col-span-3">
              <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-6 uppercase">Active & Resolved Issues by Category</h3>
              <div className="h-64 flex items-end gap-4 border-b border-l border-outline-variant p-4 pb-0 relative">
                {/* Y-axis markers */}
                <div className="absolute left-[-30px] top-0 bottom-0 flex flex-col justify-between text-[12px] text-outline font-label-mono">
                   <span>{maxCat}</span>
                   <span>{Math.round(maxCat * 0.75)}</span>
                   <span>{Math.round(maxCat * 0.5)}</span>
                   <span>{Math.round(maxCat * 0.25)}</span>
                   <span>0</span>
                </div>
                
                <div className="w-1/4 bg-primary-container hover:bg-surface-tint transition-all relative group rounded-t-sm cursor-pointer" style={{ height: `${Math.max(1, roadPct)}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-label-mono text-[14px] font-bold opacity-0 group-hover:opacity-100 bg-surface px-2 py-1 border border-outline-variant rounded shadow-sm z-10 transition-opacity">{road}</div>
                </div>
                <div className="w-1/4 bg-primary-container hover:bg-surface-tint transition-all relative group rounded-t-sm cursor-pointer" style={{ height: `${Math.max(1, waterPct)}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-label-mono text-[14px] font-bold opacity-0 group-hover:opacity-100 bg-surface px-2 py-1 border border-outline-variant rounded shadow-sm z-10 transition-opacity">{water}</div>
                </div>
                <div className="w-1/4 bg-primary-container hover:bg-surface-tint transition-all relative group rounded-t-sm cursor-pointer" style={{ height: `${Math.max(1, powerPct)}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-label-mono text-[14px] font-bold opacity-0 group-hover:opacity-100 bg-surface px-2 py-1 border border-outline-variant rounded shadow-sm z-10 transition-opacity">{power}</div>
                </div>
                <div className="w-1/4 bg-primary-container hover:bg-surface-tint transition-all relative group rounded-t-sm cursor-pointer" style={{ height: `${Math.max(1, miscPct)}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-label-mono text-[14px] font-bold opacity-0 group-hover:opacity-100 bg-surface px-2 py-1 border border-outline-variant rounded shadow-sm z-10 transition-opacity">{misc}</div>
                </div>
              </div>
              <div className="flex justify-between mt-3 font-label-caps text-[12px] text-outline px-4">
                <span className="truncate w-1/4 text-center">Road & Transit</span>
                <span className="truncate w-1/4 text-center">Water & San.</span>
                <span className="truncate w-1/4 text-center">Power</span>
                <span className="truncate w-1/4 text-center">Miscellaneous</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
