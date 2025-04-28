import React, { createContext, useState, useContext, ReactNode } from "react";

interface Coordinates {
  lat: number;
  lng: number;
}

interface RouteData {
  pickup: Coordinates;
  drop: Coordinates;
}

interface RouteInfo {
  distance: string;
  duration: string;
  polyline: string;
  steps: string[];
}

interface DeliveryDetails {
  id: string;
  orderId: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupCoordinates: {
    latitude: number;
    longitude: number;
  };
  dropoffCoordinates: {
    latitude: number;
    longitude: number;
  };
  status: string;
  customerName: string;
  createdAt: string;
  updatedAt: string;
}

interface MapContextType {
  routeData: RouteData;
  setRouteData: React.Dispatch<React.SetStateAction<RouteData>>;
  routeInfo: RouteInfo | null;
  setRouteInfo: React.Dispatch<React.SetStateAction<RouteInfo | null>>;
  deliveryDetails: DeliveryDetails | null;
  setDeliveryDetails: React.Dispatch<
    React.SetStateAction<DeliveryDetails | null>
  >;
  deliveryId: string;
  setDeliveryId: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  fetchDelivery: (id: string) => Promise<void>;
  fetchRouteData: () => Promise<void>;
}

const defaultRouteData = {
  pickup: { lat: 6.927079, lng: 79.861244 },
  drop: { lat: 6.936063, lng: 79.846722 },
};

export const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [routeData, setRouteData] = useState<RouteData>(defaultRouteData);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [deliveryDetails, setDeliveryDetails] =
    useState<DeliveryDetails | null>(null);
  const [deliveryId, setDeliveryId] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDelivery = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      // Fetch the delivery details from the backend
      const response = await fetch(`http://localhost:3000/deliveries/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch delivery details");
      }
      const data = await response.json();
      setDeliveryDetails(data);
      setRouteData({
        pickup: {
          lat: data.pickupCoordinates.latitude,
          lng: data.pickupCoordinates.longitude,
        },
        drop: {
          lat: data.dropoffCoordinates.latitude,
          lng: data.dropoffCoordinates.longitude,
        },
      });
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch delivery details");
      setLoading(false);
    }
  };

  // Function to fetch route data from the backend

  const fetchRouteData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Send a POST request to get the route data from the backend
      const response = await fetch("http://localhost:3001/navigate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(routeData),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch route data");
      }

      const data = await response.json();
      setRouteInfo(data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch route data");
      setLoading(false);
    }
  };

  return (
    <MapContext.Provider
      value={{
        routeData,
        setRouteData,
        routeInfo,
        setRouteInfo,
        deliveryDetails,
        setDeliveryDetails,
        deliveryId,
        setDeliveryId,
        loading,
        setLoading,
        error,
        setError,
        fetchDelivery,
        fetchRouteData,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return context;
};
