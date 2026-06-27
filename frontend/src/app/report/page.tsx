"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScoreBreakdown from "@/components/ui/ScoreBreakdown";

import { submitComplaint, Complaint } from "@/lib/api";
import dynamic from "next/dynamic";

const LocationPicker = dynamic(() => import("@/components/ui/LocationPicker"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-surface-container flex items-center justify-center animate-pulse text-primary font-label-caps">Loading Map...</div>
});

export default function ReportIssuePage() {
  const [viewState, setViewState] = useState<"form" | "loading" | "result">("form");
  const [resultData, setResultData] = useState<Complaint | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setViewState("loading");
    
    try {
      const formData = new FormData(e.currentTarget);
      
      if (!location) {
        alert("Please click on the map to set the issue location.");
        setViewState("form");
        return;
      }
      
      formData.append("lat", location.lat.toString());
      formData.append("lng", location.lng.toString());
      
      const data = await submitComplaint(formData);
      setResultData(data);
      setViewState("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error(error);
      alert("Failed to submit report. Please try again.");
      setViewState("form");
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full max-w-4xl mx-auto px-margin-mobile md:px-0 py-lg md:py-xl">
        <header className="mb-lg text-center md:text-left">
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-2">
            Report a Civic Issue
          </h1>
          <p className="text-on-surface-variant font-body-md text-body-md max-w-2xl">
            Help us maintain digital infrastructure. Provide details below to dispatch municipal services.
          </p>
        </header>

        {/* Form View */}
        {viewState === "form" && (
          <div className="bg-surface-container-lowest border border-outline-variant rounded p-margin-mobile md:p-md shadow-sm transition-opacity duration-300">
            <form className="flex flex-col gap-lg" onSubmit={handleSubmit}>
              {/* Step 1: Category Selector */}
              <section>
                <h2 className="font-label-caps text-label-caps text-primary uppercase mb-4 tracking-wider">
                  1. Select Category
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-sm">
                  {[
                    { id: "pothole", icon: "add_road", label: "Pothole" },
                    { id: "streetlight", icon: "lightbulb", label: "Streetlight" },
                    { id: "water", icon: "water_drop", label: "Water Leak" },
                    { id: "garbage", icon: "delete", label: "Garbage" },
                    { id: "other", icon: "category", label: "Other" },
                  ].map((cat) => (
                    <label key={cat.id} className="cursor-pointer group">
                      <input className="sr-only peer" name="category" required type="radio" value={cat.id} />
                      <div className="border border-outline-variant rounded p-4 flex flex-col items-center justify-center gap-2 h-24 hover:bg-surface-container-low transition-colors text-on-surface-variant peer-checked:bg-surface-container-high peer-checked:border-primary-container peer-focus:ring-2 peer-focus:ring-primary-container">
                        <span className="material-symbols-outlined text-headline-md">{cat.icon}</span>
                        <span className="font-label-caps text-label-caps uppercase text-center">{cat.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              <div className="h-px bg-outline-variant w-full"></div>

              {/* Step 2: Description */}
              <section>
                <h2 className="font-label-caps text-label-caps text-primary uppercase mb-4 tracking-wider flex items-center justify-between">
                  <span>2. Description</span>
                  <span className="text-on-surface-variant font-body-md text-[12px] normal-case tracking-normal italic flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                    Our system will read your description and assign a priority automatically.
                  </span>
                </h2>
                <textarea
                  name="description"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded p-sm font-body-md text-body-md text-on-surface placeholder-on-surface-variant resize-y min-h-[120px] focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                  placeholder="Please describe the issue in detail. Example: 'Deep pothole in the right lane going north, right after the intersection.'"
                  required
                ></textarea>
              </section>

              <div className="h-px bg-outline-variant w-full"></div>

              {/* Bento Grid Layout for Steps 3 & 4 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                {/* Step 3: Evidence */}
                <section className="flex flex-col h-full">
                  <h2 className="font-label-caps text-label-caps text-primary uppercase mb-4 tracking-wider">
                    3. Evidence
                  </h2>
                  <div className="flex-1 border border-dashed border-outline rounded bg-surface flex flex-col items-center justify-center p-md text-center hover:bg-surface-container-low transition-colors cursor-pointer min-h-[200px] relative overflow-hidden group">
                    <input accept="image/*" name="photo" onChange={handlePhotoChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" type="file" />
                    
                    {photoPreview ? (
                      <div className="absolute inset-0 z-10 w-full h-full bg-surface">
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-contain" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white">
                          <span className="material-symbols-outlined text-display-sm mb-1">refresh</span>
                          <span className="font-label-caps text-[12px] uppercase">Change Photo</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-display-lg text-outline mb-2 group-hover:text-primary transition-colors">
                          add_a_photo
                        </span>
                        <span className="font-label-caps text-label-caps text-primary uppercase">Upload Photo</span>
                        <span className="font-body-md text-[12px] text-on-surface-variant mt-1">JPG, PNG up to 5MB</span>
                      </>
                    )}
                  </div>
                </section>

                {/* Step 4: Location */}
                <section className="flex flex-col h-full">
                  <h2 className="font-label-caps text-label-caps text-primary uppercase mb-4 tracking-wider">
                    4. Location
                  </h2>
                  <div className="flex-1 border border-outline-variant rounded overflow-hidden relative min-h-[200px] bg-surface-container-high group cursor-pointer">
                    {/* Location Picker */}
                    <div className="w-full h-full absolute inset-0">
                      <LocationPicker onChange={(lat, lng) => setLocation({lat, lng})} />
                    </div>
                    {/* Overlay UI */}
                    <div className="absolute bottom-sm left-sm right-sm bg-surface-container-lowest border border-outline-variant p-2 rounded shadow-sm flex items-center justify-between z-[1000] pointer-events-none">
                      <div className="flex items-center gap-2 text-on-surface">
                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                        <span className="font-label-mono text-[12px]">
                          {location ? `${location.lat.toFixed(4)}° N, ${Math.abs(location.lng).toFixed(4)}° W` : "Click map to set pin"}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Submit Action */}
              <div className="mt-md flex justify-end">
                <button
                  className="bg-primary-container text-on-primary font-label-caps text-label-caps uppercase px-xl py-3 rounded hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
                  type="submit"
                >
                  Submit Report
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading State */}
        {viewState === "loading" && (
          <div className="flex flex-col items-center justify-center py-xl my-xl space-y-4">
            <span className="material-symbols-outlined text-display-lg text-primary-container animate-spin-slow">
              autorenew
            </span>
            <p className="font-label-caps text-label-caps text-primary uppercase tracking-widest animate-pulse">
              Analyzing Submission via AI...
            </p>
          </div>
        )}

        {/* Post-Submission State: Signature ScoreBreakdown */}
        {viewState === "result" && (
          <div className="bg-surface-container-lowest border border-outline-variant rounded p-md md:p-lg shadow-sm">
            <div className="flex items-center gap-3 mb-md">
              <span className="material-symbols-outlined text-tertiary-container bg-tertiary-fixed-dim rounded-full p-2">
                check_circle
              </span>
              <div>
                <h2 className="font-headline-md text-headline-md text-primary">Report Logged Successfully</h2>
                <p className="font-label-mono text-label-mono text-on-surface-variant">ID: RPT-2024-{resultData?.id || "N/A"}</p>
              </div>
            </div>
            
            <div className="h-px bg-outline-variant w-full mb-md"></div>
            
            <ScoreBreakdown 
              score={Math.round(resultData?.score || 0)} 
              severityScore={(resultData?.severity || 0) * (45/5)} 
              urgencyScore={(resultData?.urgency || 0) * (35/5)} 
              evidenceScore={(resultData?.evidence_score || 0) * 10} 
              justification={resultData?.ai_justification || "Issue logged."} 
            />

            <div className="mt-lg flex justify-center">
              <button
                className="border border-primary-container text-primary-container font-label-caps text-label-caps uppercase px-6 py-2 rounded hover:bg-surface-container-low transition-colors"
                onClick={() => setViewState("form")}
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
