"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getComplaints, updateComplaintStatus, Complaint } from "@/lib/api";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminQueuePage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [filterStatus, setFilterStatus] = useState("Pending AI Review");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      // Pass false to get all complaints, not just the admin's own
      const data = await getComplaints(false);
      setComplaints(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await updateComplaintStatus(id, status);
      // Update local state to reflect the new status instantly
      setComplaints(prev => 
        prev.map(c => c.id === id ? { ...c, status } : c)
      );
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case "pothole": return "add_road";
      case "streetlight": return "lightbulb";
      case "water": return "water_drop";
      case "garbage": return "delete";
      default: return "category";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "bg-error text-on-error"; // Red for high
    if (score >= 50) return "bg-signal-amber text-black"; // Yellow for medium
    return "bg-surface-variant text-on-surface-variant"; // Gray for low
  };

  // Filter logic
  const filteredComplaints = complaints.filter(c => {
    if (filterCategory !== "All Categories" && c.category.toLowerCase() !== filterCategory.toLowerCase()) {
      return false;
    }
    
    // Status filter matching
    if (filterStatus === "Pending AI Review" && c.status !== "pending") return false;
    if (filterStatus === "Flagged for Manual" && c.status !== "verified") return false; // assuming verified is manual here for demo
    if (filterStatus === "Processing" && c.status !== "assigned") return false;
    if (filterStatus === "Resolved" && c.status !== "resolved") return false;
    if (filterStatus === "Rejected" && c.status !== "rejected") return false;
    
    return true;
  });

  return (
    <div className="font-body-md text-body-md text-on-surface antialiased flex flex-col md:flex-row min-h-screen bg-background">
      <AdminSidebar />

      {/* Main Content Canvas */}
      <main className="flex-1 flex flex-col w-full min-w-0 max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg">
        {/* Header Section */}
        <header className="mb-xl">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Verification Queue</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Review and triage pending civic infrastructure reports.</p>
        </header>

        {/* Filter Bar */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-xs mb-lg">
          <div className="bg-surface-container-lowest border border-outline-variant rounded p-sm flex flex-col justify-center">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2 block">Category</label>
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary p-0 font-body-md text-body-md text-on-surface">
              <option>All Categories</option>
              <option value="pothole">Pothole / Road</option>
              <option value="streetlight">Streetlight</option>
              <option value="water">Water / Leak</option>
              <option value="garbage">Sanitation</option>
            </select>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded p-sm flex flex-col justify-center">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2 block">Status</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary p-0 font-body-md text-body-md text-on-surface">
              <option>Pending AI Review</option>
              <option>Processing</option>
              <option>Resolved</option>
              <option>Rejected</option>
            </select>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded p-sm flex flex-col justify-center">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2 block">AI Priority Score</label>
            <select className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary p-0 font-body-md text-body-md text-on-surface">
              <option>Any Score</option>
              <option>High (75-100)</option>
              <option>Medium (50-74)</option>
              <option>Low (0-49)</option>
            </select>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded p-sm flex flex-col justify-center relative">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2 block">Date Range</label>
            <div className="flex items-center border-b border-outline-variant pb-1">
              <span className="material-symbols-outlined text-on-surface-variant mr-2" style={{ fontSize: "18px" }}>calendar_today</span>
              <input className="bg-transparent border-0 p-0 focus:ring-0 w-full font-body-md text-body-md text-on-surface" placeholder="Last 7 Days" readOnly type="text" />
            </div>
          </div>
        </section>

        {/* Queue List */}
        <section className="flex flex-col gap-base">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-sm py-2 border-b border-outline-variant bg-surface text-on-surface-variant font-label-caps text-label-caps uppercase sticky top-0 z-0">
            <div className="col-span-1">Type</div>
            <div className="col-span-5">Report Details</div>
            <div className="col-span-2 flex items-center cursor-pointer hover:text-primary">
              AI Score
              <span className="material-symbols-outlined ml-1" style={{ fontSize: "16px" }}>arrow_downward</span>
            </div>
            <div className="col-span-4 text-right">Quick Actions</div>
          </div>

          {loading ? (
             <div className="p-xl text-center text-on-surface-variant">Loading queue...</div>
          ) : filteredComplaints.length === 0 ? (
             <div className="p-xl text-center bg-surface-container-lowest border border-outline-variant rounded text-on-surface-variant">
                No complaints found matching the current filters.
             </div>
          ) : (
            filteredComplaints.map(complaint => (
              <article key={complaint.id} className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-surface-container-lowest border border-outline-variant rounded p-sm hover:bg-[#F0EFEA] transition-colors group ${complaint.status !== 'pending' ? 'opacity-60' : ''}`}>
                {/* Icon */}
                <div className="col-span-1 flex justify-center md:justify-start">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getScoreColor(complaint.score || 0)}`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{getIcon(complaint.category)}</span>
                  </div>
                </div>
                {/* Details */}
                <div className="col-span-1 md:col-span-5">
                  <h3 className="font-headline-md text-headline-md text-on-surface line-clamp-1">{complaint.category.toUpperCase()}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant truncate">
                    {new Date(complaint.created_at).toLocaleString()} • {complaint.description.substring(0, 60)}...
                  </p>
                </div>
                {/* Score (Hover Target) */}
                <div className="col-span-1 md:col-span-2 relative score-hover-target cursor-help">
                  <div className="flex items-end">
                    <span className="font-label-mono text-label-mono text-primary mr-1" style={{ fontSize: "24px", lineHeight: "24px" }}>
                      {Math.round(complaint.score || 0)}
                    </span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">/100</span>
                  </div>
                  <div className="w-full bg-surface-variant h-1 mt-2 rounded flex overflow-hidden">
                    <div className="h-full bg-signal-amber" style={{ width: `${Math.min(100, Math.round(complaint.score || 0))}%` }}></div>
                  </div>
                  {/* Score Breakdown Tooltip */}
                  <div className="score-breakdown-tooltip absolute left-0 bottom-full mb-2 w-64 bg-surface-container-lowest border border-outline-variant rounded shadow-[0px_4px_12px_rgba(0,0,0,0.05)] p-4 opacity-0 invisible transform translate-y-2 transition-all duration-200 z-20">
                    <h4 className="font-label-caps text-label-caps text-on-surface uppercase mb-3 border-b border-outline-variant pb-2">AI Justification</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant italic text-sm">{complaint.ai_justification || "No justification provided."}</p>
                  </div>
                </div>
                {/* Actions */}
                <div className="col-span-1 md:col-span-4 flex flex-wrap justify-end gap-2">
                  <span className="px-3 py-2 text-sm uppercase font-label-caps text-on-surface-variant self-center border border-outline-variant rounded mr-2">
                    {complaint.status}
                  </span>
                  {complaint.status === "pending" && (
                    <>
                      <button 
                        onClick={() => handleStatusUpdate(complaint.id, "rejected")}
                        className="px-4 py-2 bg-brand-signal text-on-primary font-label-caps text-label-caps uppercase rounded hover:opacity-90 transition-opacity">
                        Reject
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(complaint.id, "verified")}
                        className="px-4 py-2 bg-primary-container text-on-primary font-label-caps text-label-caps uppercase rounded hover:bg-opacity-90 transition-colors">
                        Approve
                      </button>
                    </>
                  )}
                  {complaint.status === "verified" && (
                    <button 
                      onClick={() => handleStatusUpdate(complaint.id, "assigned")}
                      className="px-4 py-2 bg-primary text-on-primary font-label-caps text-label-caps uppercase rounded hover:bg-opacity-90 transition-colors">
                      Assign
                    </button>
                  )}
                  {complaint.status === "assigned" && (
                    <button 
                      onClick={() => handleStatusUpdate(complaint.id, "resolved")}
                      className="px-4 py-2 bg-primary text-on-primary font-label-caps text-label-caps uppercase rounded hover:bg-opacity-90 transition-colors">
                      Resolve
                    </button>
                  )}
                </div>
              </article>
            ))
          )}
        </section>

        {/* Footer */}
        <footer className="w-full py-lg mt-auto border-t border-outline-variant flex flex-col md:flex-row justify-between items-center text-on-surface-variant font-label-caps text-label-caps uppercase mt-10">
          <p>© 2024 CivicPulse. Digital Infrastructure for Public Good.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link className="hover:text-primary transition-colors" href="#">Privacy Policy</Link>
            <Link className="hover:text-primary transition-colors" href="#">Terms of Service</Link>
            <Link className="hover:text-primary transition-colors" href="#">API Documentation</Link>
            <Link className="hover:text-primary transition-colors" href="#">Contact Support</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
