// import React from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Polyline,
//   Marker,
//   Popup,
// } from "react-leaflet";
// import L from "leaflet";
// import polyline from "@mapbox/polyline";
// import "leaflet/dist/leaflet.css";

// // Fix for missing marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
// });

// const RouteMap = ({ polylineString }) => {
//   if (!polylineString) return <div>Loading map...</div>;

//   // Decode polyline string into lat/lng array
//   const decodedPath = polyline.decode(polylineString);

//   // Optional: Center the map at the first point
//   const center = decodedPath[0] || [0, 0];

//   return (
//     <MapContainer
//       center={center}
//       zoom={14}
//       style={{ height: "600px", width: "100%" }}
//     >
//       <TileLayer
//         attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       <Polyline positions={decodedPath} color="blue" />
//       <Marker position={center}>
//         <Popup>Start Location</Popup>
//       </Marker>
//     </MapContainer>
//   );
// };

// export default RouteMap;

import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import polyline from "@mapbox/polyline";
import "leaflet/dist/leaflet.css";

// Fix for missing marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom Delivery Icon (Optional)
const deliveryIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png", // small delivery guy icon
  iconSize: [40, 40],
});

const RouteMap = ({ polylineString }) => {
  const [positionIndex, setPositionIndex] = useState(0);

  if (!polylineString) return <div>Loading map...</div>;

  const decodedPath = polyline.decode(polylineString);
  const center = decodedPath[0] || [0, 0];

  // Animate movement
  useEffect(() => {
    if (decodedPath.length === 0) return;
    const interval = setInterval(() => {
      setPositionIndex((prevIndex) => {
        if (prevIndex >= decodedPath.length - 1) {
          clearInterval(interval);
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, 700); // Move every 700ms

    return () => clearInterval(interval);
  }, [decodedPath]);

  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={decodedPath} color="blue" />

      {/* Moving Delivery Icon */}
      {decodedPath[positionIndex] && (
        <Marker position={decodedPath[positionIndex]} icon={deliveryIcon}>
          <Popup>Delivering...</Popup>
        </Marker>
      )}

      {/* Start and End markers */}
      <Marker position={decodedPath[0]}>
        <Popup>Start Point</Popup>
      </Marker>
      <Marker position={decodedPath[decodedPath.length - 1]}>
        <Popup>Destination</Popup>
      </Marker>
    </MapContainer>
  );
};

export default RouteMap;
