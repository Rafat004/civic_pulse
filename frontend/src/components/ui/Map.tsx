"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getComplaints, Complaint } from "@/lib/api";

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Map() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [map, setMap] = useState<L.Map | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getComplaints().then(setComplaints).catch(console.error);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query || !map) return;
    
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        map.flyTo([parseFloat(lat), parseFloat(lon)], 15);
      } else {
        alert("Location not found");
      }
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Search Bar Overlay */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-surface-container-lowest p-2 rounded shadow-md border border-outline-variant flex gap-2">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search address or city..." 
            className="px-3 py-1.5 border border-outline-variant rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface bg-surface text-sm w-64 md:w-80 shadow-inner"
          />
          <button type="submit" className="bg-primary-container text-on-primary px-4 py-1.5 rounded font-label-caps uppercase text-[12px] shadow-sm hover:opacity-90 transition-opacity">
            Search
          </button>
        </form>
      </div>

      {/* Actual Map */}
      <MapContainer 
        center={[41.8781, -87.6298]} 
        zoom={13} 
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {complaints.map((c) => (
          <Marker key={c.id} position={[c.lat, c.lng]}>
            <Popup>
              <div className="min-w-[200px]">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-label-caps text-[10px] uppercase bg-primary-container text-on-primary px-2 py-0.5 rounded-sm">
                    {c.category}
                  </span>
                  <span className="text-[10px] text-outline">ID: {c.id}</span>
                </div>
                <p className="text-sm mt-1 mb-2 text-on-surface line-clamp-3">{c.description}</p>
                
                <div className="h-px bg-outline-variant w-full mb-2"></div>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant">Score: <strong className="text-primary">{Math.round(c.score || 0)}</strong></span>
                  <span className="text-on-surface-variant">Sev: <strong>{c.severity}/5</strong></span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
