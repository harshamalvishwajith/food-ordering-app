"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { DeliveryItem } from "@/types/schema";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default markers not showing
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

interface DeliveryMapProps {
  delivery: DeliveryItem;
}

export default function DeliveryMap({ delivery }: DeliveryMapProps) {
  const { pickupCoords, dropoffCoords } = delivery;

  if (!pickupCoords || !dropoffCoords) {
    return <div>Loading map...</div>;
  }

  const bounds = L.latLngBounds([pickupCoords, dropoffCoords]);

  return (
    <MapContainer
      bounds={bounds}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={pickupCoords} icon={icon}>
        <Popup>
          <div className="p-2">
            <p className="font-semibold">Pickup Location</p>
            <p className="text-sm">{delivery.pickupLocation}</p>
          </div>
        </Popup>
      </Marker>

      <Marker position={dropoffCoords} icon={icon}>
        <Popup>
          <div className="p-2">
            <p className="font-semibold">Drop-off Location</p>
            <p className="text-sm">{delivery.dropoffLocation}</p>
          </div>
        </Popup>
      </Marker>

      <Polyline
        positions={[pickupCoords, dropoffCoords]}
        color="#FF6B6B"
        weight={3}
        opacity={0.7}
      />
    </MapContainer>
  );
}
