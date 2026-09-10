import React from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const TYPE_COLOR = {
  SCA: "#6366f1",
  PSB: "#0ea5e9",
  RRB: "#10b981",
  "NBFC-MFI": "#f59e0b",
};

export default function PartnerMap({ partners, userLocation, selectedId, onSelect }) {
  const hasUser = userLocation != null;
  const center = hasUser ? [userLocation.lat, userLocation.lng] : [22.5937, 78.9629];

  return (
    <MapContainer center={center} zoom={hasUser ? 11 : 5} className="h-full w-full rounded-xl" style={{ minHeight: "400px" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {hasUser && (
        <CircleMarker
          center={[userLocation.lat, userLocation.lng]}
          radius={10}
          pathOptions={{ color: "#1e293b", fillColor: "#1e293b", fillOpacity: 0.9 }}
        >
          <Tooltip permanent>Your location</Tooltip>
        </CircleMarker>
      )}
      {partners.map((p) => {
        const isSelected = selectedId === p.id;
        const color = TYPE_COLOR[p.type] || "#64748b";
        return (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lng]}
            radius={isSelected ? 11 : 7}
            pathOptions={{
              color: isSelected ? "#0f172a" : color,
              fillColor: p.is_eligible ? color : "#cbd5e1",
              fillOpacity: p.is_eligible ? 0.85 : 0.4,
              weight: isSelected ? 3 : 1.5,
            }}
            eventHandlers={{ click: () => onSelect && onSelect(p.id) }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold text-slate-900">{p.name}</p>
                <p className="text-xs text-slate-500">{p.type} · {p.city}, {p.state}</p>
                <p className="text-xs mt-1">{p.is_eligible ? "✅ Eligible for new applications" : "⚠️ Currently not accepting"}</p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}