"use client";

import React, { useEffect, useState } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { getOverrides, ScoreOverride } from "@/lib/api";

export default function AdminOverridesPage() {
  const [overrides, setOverrides] = useState<ScoreOverride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOverrides()
      .then(setOverrides)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="font-body-md text-body-md text-on-surface antialiased flex flex-col md:flex-row min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 flex flex-col w-full min-w-0 max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg overflow-y-auto">
        <header className="mb-xl flex justify-between items-end border-b border-outline-variant pb-6">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Overrides Log</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Review historical AI score overrides made by administrators.</p>
          </div>
          <button className="bg-surface-container-low border border-outline-variant hover:bg-surface-container transition-colors text-on-surface px-4 py-2 rounded flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            <span className="font-label-caps text-sm uppercase">Filter Logs</span>
          </button>
        </header>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-xl text-center text-on-surface-variant">Loading overrides...</div>
          ) : overrides.length === 0 ? (
            <div className="p-xl text-center text-on-surface-variant">No overrides found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant font-label-caps text-xs text-on-surface-variant uppercase tracking-wider">
                  <th className="p-4 font-semibold">Override ID</th>
                  <th className="p-4 font-semibold">Report Info</th>
                  <th className="p-4 font-semibold">Score Adjustment</th>
                  <th className="p-4 font-semibold">Admin / Reason</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {overrides.map((override) => (
                  <tr key={override.id} className="hover:bg-surface-container-lowest/50 transition-colors group">
                    <td className="p-4 align-top">
                      <div className="font-label-mono text-primary font-bold">OVR-{override.id}</div>
                      <div className="text-xs text-outline mt-1">{new Date(override.created_at).toLocaleString()}</div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="font-semibold text-on-surface">Report #{override.complaint_id}</div>
                      <div className="text-sm text-on-surface-variant flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-[14px]">category</span>
                        {override.complaint_category}
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-outline uppercase font-label-caps">AI</span>
                          <span className="font-label-mono font-bold text-on-surface-variant">{override.old_score}</span>
                        </div>
                        <span className="material-symbols-outlined text-outline text-[16px]">arrow_forward</span>
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-outline uppercase font-label-caps">Manual</span>
                          <span className={`font-label-mono font-bold ${
                            override.new_score > override.old_score ? 'text-brand-signal' : 
                            override.new_score < override.old_score ? 'text-tertiary' : 'text-on-surface'
                          }`}>
                            {override.new_score}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-top max-w-[250px]">
                      <div className="font-semibold text-on-surface flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary">
                          {override.admin_name.charAt(0)}
                        </div>
                        {override.admin_name}
                      </div>
                      <div className="text-sm text-on-surface-variant mt-2 italic border-l-2 border-outline-variant pl-2">
                        "{override.reason}"
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      <span className="inline-flex items-center gap-1 bg-secondary/10 text-secondary border border-secondary/20 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        Applied
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          <div className="p-4 border-t border-outline-variant flex items-center justify-between bg-surface-container-low/50">
            <span className="text-sm text-on-surface-variant">Showing {overrides.length} records</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container disabled:opacity-50 text-sm" disabled>Previous</button>
              <button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container disabled:opacity-50 text-sm" disabled>Next</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
