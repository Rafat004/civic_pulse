"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const getLinkClasses = (path: string) => {
    if (pathname === path) {
      return "flex items-center px-4 py-3 bg-secondary-container text-on-secondary-container rounded-full scale-95 duration-100";
    }
    return "flex items-center px-4 py-3 text-on-surface-variant hover:bg-surface-container-high transition-all rounded";
  };

  return (
    <nav className="hidden md:flex flex-col h-screen p-md space-y-4 bg-surface-container-low border-r border-outline-variant w-64 flex-shrink-0 sticky top-0 z-10">
      <div className="mb-8 px-4">
        <Link href="/" className="font-headline-md text-headline-md font-bold text-primary block">
          CivicPulse
        </Link>
        <p className="font-label-caps text-label-caps text-on-surface-variant mt-2 uppercase">
          Infrastructure Oversight
        </p>
      </div>
      <div className="flex-1 space-y-2">
        <Link href="/admin/dashboard" className={getLinkClasses("/admin/dashboard")}>
          <span className="material-symbols-outlined mr-3">dashboard</span>
          <span className="font-label-caps text-label-caps uppercase">Dashboard</span>
        </Link>
        <Link href="/admin/queue" className={getLinkClasses("/admin/queue")}>
          <span className="material-symbols-outlined mr-3">fact_check</span>
          <span className="font-label-caps text-label-caps uppercase">Verification Queue</span>
        </Link>
        <Link href="/admin/overrides" className={getLinkClasses("/admin/overrides")}>
          <span className="material-symbols-outlined mr-3">history_edu</span>
          <span className="font-label-caps text-label-caps uppercase">Overrides Log</span>
        </Link>
        <Link href="/map" className={getLinkClasses("/map")}>
          <span className="material-symbols-outlined mr-3">map</span>
          <span className="font-label-caps text-label-caps uppercase">Civic Map</span>
        </Link>
        <Link href="/admin/settings" className={getLinkClasses("/admin/settings")}>
          <span className="material-symbols-outlined mr-3">settings</span>
          <span className="font-label-caps text-label-caps uppercase">Settings</span>
        </Link>
      </div>
      <div className="mt-auto space-y-4">
        <button className="w-full bg-primary-container text-on-primary py-3 rounded text-center font-label-caps text-label-caps uppercase hover:opacity-90 transition-opacity">
          System Export
        </button>
        <Link href="#" className="flex items-center justify-center px-4 py-3 text-on-surface-variant hover:bg-surface-container-high transition-all rounded">
          <span className="material-symbols-outlined mr-2">help</span>
          <span className="font-label-caps text-label-caps uppercase">Help Center</span>
        </Link>
        <div className="flex items-center px-4 pt-4 border-t border-outline-variant">
          <div className="w-8 h-8 rounded-full bg-surface-variant mr-3 flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface-variant">person</span>
          </div>
          <div>
            <p className="font-label-caps text-label-caps text-on-surface uppercase">Admin Portal</p>
            <p className="text-xs text-on-surface-variant">Admin User Profile</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
