"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";

const MapComponent = dynamic(() => import("@/components/ui/Map"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-surface-container flex items-center justify-center animate-pulse text-primary font-label-caps">Loading Map...</div>
});

export default function MapDashboardPage() {
  return (
    <div className="bg-background text-on-background font-body-md h-screen overflow-hidden flex flex-col">
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 relative flex overflow-hidden">
        {/* Sidebar Filters */}
        <aside className="w-80 bg-surface-container-lowest border-r border-outline-variant flex flex-col shadow-sm z-40 hidden lg:flex">
          <div className="p-md border-b border-outline-variant">
            <h2 className="font-headline-md text-[20px] text-primary mb-1">Active Filters</h2>
            <p className="font-body-md text-[14px] text-on-surface-variant">Narrow down visible infrastructure issues.</p>
          </div>
          <div className="flex-1 overflow-y-auto p-md flex flex-col gap-lg">
            {/* Search */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline">search</span>
              <input className="w-full pl-10 pr-3 py-2 bg-surface border border-outline-variant rounded focus:outline-none focus:border-primary font-body-md text-body-md text-on-surface" placeholder="Search by ID or Location" type="text" />
            </div>

            {/* Priority */}
            <div>
              <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-3 uppercase">Priority Level</h3>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input defaultChecked className="w-4 h-4 rounded-sm border-outline-variant text-primary-container focus:ring-primary-container" type="checkbox" />
                  <span className="w-3 h-3 rounded-full bg-brand-signal"></span>
                  <span className="font-body-md text-body-md group-hover:text-primary transition-colors">High (Critical)</span>
                  <span className="ml-auto font-label-mono text-label-mono text-outline">142</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input defaultChecked className="w-4 h-4 rounded-sm border-outline-variant text-primary-container focus:ring-primary-container" type="checkbox" />
                  <span className="w-3 h-3 rounded-full bg-brand-signal opacity-70"></span>
                  <span className="font-body-md text-body-md group-hover:text-primary transition-colors">Medium (Elevated)</span>
                  <span className="ml-auto font-label-mono text-label-mono text-outline">356</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input defaultChecked className="w-4 h-4 rounded-sm border-outline-variant text-primary-container focus:ring-primary-container" type="checkbox" />
                  <span className="w-3 h-3 rounded-full bg-brand-signal opacity-40"></span>
                  <span className="font-body-md text-body-md group-hover:text-primary transition-colors">Low (Routine)</span>
                  <span className="ml-auto font-label-mono text-label-mono text-outline">890</span>
                </label>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-3 uppercase">Infrastructure Category</h3>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input defaultChecked className="w-4 h-4 rounded-sm border-outline-variant text-primary-container focus:ring-primary-container" type="checkbox" />
                  <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary">directions_car</span>
                  <span className="font-body-md text-body-md group-hover:text-primary transition-colors">Roads & Transit</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input defaultChecked className="w-4 h-4 rounded-sm border-outline-variant text-primary-container focus:ring-primary-container" type="checkbox" />
                  <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary">water_drop</span>
                  <span className="font-body-md text-body-md group-hover:text-primary transition-colors">Water & Sanitation</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input defaultChecked className="w-4 h-4 rounded-sm border-outline-variant text-primary-container focus:ring-primary-container" type="checkbox" />
                  <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary">bolt</span>
                  <span className="font-body-md text-body-md group-hover:text-primary transition-colors">Power & Utility</span>
                </label>
              </div>
            </div>
          </div>
          <div className="p-md border-t border-outline-variant">
            <button className="w-full border border-primary-container text-primary-container hover:bg-surface-container-low transition-colors py-2 rounded font-label-caps text-label-caps">
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Full Bleed Map Area */}
        <div className="flex-1 relative bg-surface-container">
          <MapComponent />
        </div>
      </main>
    </div>
  );
}
