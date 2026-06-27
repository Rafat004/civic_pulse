"use client";

import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationMarker({ position, setPosition }: { position: [number, number] | null, setPosition: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
}

export default function LocationPicker({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [query, setQuery] = useState("");

  const handlePositionChange = (pos: [number, number]) => {
    setPosition(pos);
    onChange(pos[0], pos[1]);
  };

  const handleSearch = async (e: React.FormEvent | React.KeyboardEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!query || !map) return;
    
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        map.flyTo([parseFloat(lat), parseFloat(lon)], 16); // Zoom in closer for dropping a pin
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
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[1000] bg-surface-container-lowest p-1 rounded shadow-md border border-outline-variant flex gap-1">
        <div className="flex gap-1">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
            placeholder="Search city/address..." 
            className="px-2 py-1.5 border border-outline-variant rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface bg-surface text-sm w-48 shadow-inner"
          />
          <button type="button" onClick={handleSearch} className="bg-primary-container text-on-primary px-3 py-1.5 rounded font-label-caps uppercase text-[10px] shadow-sm hover:opacity-90 transition-opacity">
            Find
          </button>
        </div>
      </div>

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
        <LocationMarker position={position} setPosition={handlePositionChange} />
      </MapContainer>
    </div>
  );
}
