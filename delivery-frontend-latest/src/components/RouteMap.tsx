import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import polyline from "@mapbox/polyline";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface RouteMapProps {
  polylineString: string;
}

// Fix for missing marker icons in Leaflet
L.Icon.Default.prototype.options.iconRetinaUrl =
  "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png";
L.Icon.Default.prototype.options.iconUrl =
  "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";
L.Icon.Default.prototype.options.shadowUrl =
  "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png";

// Custom delivery icon
const deliveryIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Custom restaurant icon
const restaurantIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/562/562678.png",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

// Custom home icon
const homeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1946/1946488.png",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

// Component to update the map view when props change
const MapUpdater: React.FC<{ decodedPath: [number, number][] }> = ({
  decodedPath,
}) => {
  const map = useMap();

  useEffect(() => {
    if (decodedPath.length > 0) {
      map.fitBounds(decodedPath, { padding: [50, 50] });
    }
  }, [decodedPath, map]);

  return null;
};

// Courier marker that moves along the route
const MovingCourier: React.FC<{ positions: [number, number][] }> = ({
  positions,
}) => {
  const [positionIndex, setPositionIndex] = useState(0);
  const animationRef = useRef<number | null>(null);
  const map = useMap();

  useEffect(() => {
    if (positions.length < 2) return;

    let startTime: number;
    const duration = 15000; // 15 seconds to move through the entire route
    const totalDistance = positions.length - 1;

    const moveMarker = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const index = Math.min(
        Math.floor(progress * totalDistance),
        totalDistance
      );

      if (index !== positionIndex) {
        setPositionIndex(index);
        map.panTo(positions[index], { animate: true, duration: 0.5 });
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(moveMarker);
      }
    };

    animationRef.current = requestAnimationFrame(moveMarker);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [positions, map]);

  if (positions.length === 0 || !positions[positionIndex]) return null;

  return (
    <Marker
      position={positions[positionIndex]}
      icon={deliveryIcon}
      zIndexOffset={1000}
    >
      <Popup>
        <div className="courier-popup">
          <h3>Your Order is on the Way!</h3>
          <p>
            Estimated arrival in{" "}
            {Math.floor(
              ((positions.length - positionIndex) / positions.length) * 15
            )}{" "}
            minutes
          </p>
        </div>
      </Popup>
    </Marker>
  );
};

const RouteMap: React.FC<RouteMapProps> = ({ polylineString }) => {
  if (!polylineString) {
    return (
      <div className="empty-map">
        <p>Enter a delivery ID to see the route map</p>
      </div>
    );
  }

  const decodedPath = polyline.decode(polylineString);
  const startPoint = decodedPath[0];
  const endPoint = decodedPath[decodedPath.length - 1];

  return (
    <div className="map-wrapper">
      <MapContainer
        center={[0, 0]}
        zoom={13}
        style={{
          height: "500px",
          width: "100%",
          borderRadius: "var(--radius-lg)",
        }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Polyline
          positions={decodedPath}
          pathOptions={{
            color: "var(--color-primary)",
            weight: 5,
            opacity: 0.7,
            lineCap: "round",
            lineJoin: "round",
            dashArray: "1, 10",
          }}
        />

        {startPoint && (
          <Marker position={startPoint} icon={restaurantIcon}>
            <Popup>
              <div className="marker-popup">
                <h3>Pickup Location</h3>
                <p>Restaurant</p>
              </div>
            </Popup>
          </Marker>
        )}

        {endPoint && (
          <Marker position={endPoint} icon={homeIcon}>
            <Popup>
              <div className="marker-popup">
                <h3>Delivery Location</h3>
                <p>Customer Address</p>
              </div>
            </Popup>
          </Marker>
        )}

        <MovingCourier positions={decodedPath} />
        <MapUpdater decodedPath={decodedPath} />
      </MapContainer>
    </div>
  );
};

export default RouteMap;
