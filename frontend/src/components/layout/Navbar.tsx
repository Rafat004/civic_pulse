"use client";

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { user, loading, logout } = useAuth();

  return (
    <nav className="bg-surface border-b border-outline-variant flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-16 sticky top-0 z-50 flex-shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary" data-icon="policy" style={{ fontVariationSettings: "'FILL' 1" }}>
          policy
        </span>
        <Link href="/" className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed flex items-center gap-2">
          CivicPulse
        </Link>
      </div>

      {/* Nav Links (Desktop) */}
      <div className="hidden md:flex items-center gap-gutter">
        {user && (
          <>
            <Link href="/map" className="font-label-caps text-label-caps text-on-surface-variant dark:text-on-primary-container hover:bg-surface-container-low dark:hover:bg-surface-variant transition-colors px-3 py-2 rounded">
              Map
            </Link>
            <Link href="/stats" className="font-label-caps text-label-caps text-on-surface-variant dark:text-on-primary-container hover:bg-surface-container-low dark:hover:bg-surface-variant transition-colors px-3 py-2 rounded">
              Stats
            </Link>
          </>
        )}
        {user && (
          <Link href="/my-reports" className="font-label-caps text-label-caps text-on-surface-variant dark:text-on-primary-container hover:bg-surface-container-low dark:hover:bg-surface-variant transition-colors px-3 py-2 rounded">
            My Reports
          </Link>
        )}
        {user && user.role === 'admin' && (
          <Link href="/admin/queue" className="font-label-caps text-label-caps text-primary hover:bg-surface-container-low transition-colors px-3 py-2 rounded">
            Admin Dashboard
          </Link>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-sm">
        {!loading && !user && (
          <div className="hidden md:flex items-center gap-4 text-on-surface-variant mr-2">
            <Link href="/login" className="font-label-caps text-label-caps uppercase hover:text-primary transition-colors">
              Log In
            </Link>
            <Link href="/signup" className="bg-surface-container-high border border-outline-variant text-on-surface font-label-caps text-label-caps uppercase px-4 py-2 rounded hover:bg-surface-variant transition-colors">
              Sign Up
            </Link>
          </div>
        )}

        {!loading && user && (
          <div className="hidden md:flex items-center gap-4 text-on-surface-variant mr-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-surface-container-low rounded-full">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="avatar" className="w-6 h-6 rounded-full" />
              ) : (
                <span className="material-symbols-outlined text-sm">person</span>
              )}
              <span className="font-label-caps text-sm">{user.name || user.email}</span>
            </div>
            <button onClick={logout} className="font-label-caps text-label-caps uppercase hover:text-error transition-colors">
              Log Out
            </button>
          </div>
        )}

        {user && (
          <Link href="/report" className="bg-primary-container text-on-primary font-label-caps text-label-caps uppercase px-4 py-2 rounded hover:bg-surface-tint transition-colors">
            Report Issue
          </Link>
        )}
        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2 text-on-surface-variant">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </nav>
  );
}
