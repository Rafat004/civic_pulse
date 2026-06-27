"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { getComplaints, Complaint } from "@/lib/api";

export default function MyReportsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getComplaints(true)
      .then((data) => setComplaints(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getIcon = (category: string) => {
    switch (category) {
      case "pothole": return "add_road";
      case "streetlight": return "lightbulb";
      case "water": return "water_drop";
      case "garbage": return "delete";
      default: return "category";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved": return "bg-surface-variant border-outline text-on-surface";
      case "in progress": return "bg-tertiary-fixed border-tertiary text-on-tertiary-fixed-variant";
      default: return "bg-surface-container-high border-outline-variant text-on-surface-variant";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved": return "check_circle";
      case "in progress": return "engineering";
      default: return "hourglass_empty";
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col font-body-md antialiased">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-margin-mobile md:px-0 py-lg md:py-xl">
        <header className="mb-lg flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-2">
              My Reports
            </h1>
            <p className="text-on-surface-variant font-body-md text-body-md max-w-2xl">
              Track the progress of infrastructure issues you've reported to the city.
            </p>
          </div>
          <Link href="/report" className="bg-primary-container text-on-primary font-label-caps text-label-caps uppercase px-6 py-3 rounded hover:opacity-90 transition-opacity flex items-center justify-center gap-2 w-full md:w-auto">
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Report
          </Link>
        </header>

        {/* Reports List */}
        <section className="flex flex-col gap-base">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-sm py-2 border-b border-outline-variant bg-surface text-on-surface-variant font-label-caps text-label-caps uppercase sticky top-0 z-0">
            <div className="col-span-1">Type</div>
            <div className="col-span-6">Report Details</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-2 text-right">Date</div>
          </div>

          {loading ? (
            <div className="p-xl text-center text-on-surface-variant">Loading reports...</div>
          ) : complaints.length === 0 ? (
            <div className="p-xl text-center bg-surface-container-lowest border border-outline-variant rounded">
              <p className="text-on-surface-variant mb-4">You haven't submitted any reports yet.</p>
              <Link href="/report" className="text-primary hover:underline">Submit your first report</Link>
            </div>
          ) : (
            complaints.map((c) => (
              <article key={c.id} className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-surface-container-lowest border border-outline-variant rounded p-md hover:bg-surface-container transition-colors group ${c.status.toLowerCase() === 'resolved' ? 'opacity-70' : ''}`}>
                {/* Icon */}
                <div className="col-span-1 flex justify-start">
                  <div className="w-12 h-12 rounded-full bg-surface-variant text-on-surface flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {getIcon(c.category)}
                    </span>
                  </div>
                </div>
                {/* Details */}
                <div className="col-span-1 md:col-span-6">
                  <h3 className={`font-headline-md text-headline-md text-on-surface mb-1 ${c.status.toLowerCase() === 'resolved' ? 'line-through' : ''}`}>
                    {c.category.toUpperCase()}
                  </h3>
                  <p className="font-label-mono text-label-mono text-outline mb-1">ID: RPT-{new Date(c.created_at).getFullYear()}-{c.id}</p>
                  <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">{c.description}</p>
                </div>
                {/* Status */}
                <div className="col-span-1 md:col-span-3">
                   <div className={`inline-flex items-center gap-2 border px-3 py-1 rounded-full ${getStatusColor(c.status)}`}>
                    <span className="material-symbols-outlined text-[16px]">{getStatusIcon(c.status)}</span>
                    <span className="font-label-caps text-label-caps uppercase">{c.status}</span>
                  </div>
                </div>
                {/* Date */}
                <div className="col-span-1 md:col-span-2 text-left md:text-right">
                  <p className="font-label-mono text-label-mono text-on-surface">
                    {new Date(c.created_at).toLocaleDateString()}
                  </p>
                </div>
              </article>
            ))
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
