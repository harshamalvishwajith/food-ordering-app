import React, { useEffect } from "react";
import RouteMap from "./RouteMap";
import RouteInfo from "./RouteInfo";
import { Search } from "lucide-react";
import { useMapContext } from "../context/MapContext";

const RouteTracker: React.FC = () => {
  const {
    deliveryId,
    setDeliveryId,
    fetchDelivery,
    fetchRouteData,
    routeInfo,
    deliveryDetails,
    loading,
    error,
  } = useMapContext();

  useEffect(() => {
    if (deliveryDetails) {
      fetchRouteData();
    }
  }, [deliveryDetails]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDelivery(deliveryId);
  };

  return (
    <div className="route-tracker-container slide-up">
      <div className="tracker-header">
        <h2 className="section-title">Track Your Delivery</h2>
        <p className="section-description">
          Enter your delivery ID to see real-time location updates
        </p>
      </div>

      <div className="search-form-container card">
        <form onSubmit={handleSubmit} className="search-form">
          <div className="form-group">
            <label htmlFor="deliveryId">Delivery ID</label>
            <div className="search-input-group">
              <input
                type="text"
                id="deliveryId"
                className="form-control"
                value={deliveryId}
                onChange={(e) => setDeliveryId(e.target.value)}
                placeholder="Enter delivery ID (e.g., 123456)"
              />
              <button type="submit" className="btn btn-primary search-btn">
                <Search size={20} />
                <span>Track</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-animation"></div>
          <p>Loading delivery information...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <p className="error-message">{error}</p>
        </div>
      )}

      {deliveryDetails && !loading && (
        <div className="delivery-details card">
          <h3 className="card-title">Delivery Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Order ID:</span>
              <span className="detail-value">{deliveryDetails.orderId}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Customer:</span>
              <span className="detail-value">
                {deliveryDetails.customerName}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Pickup:</span>
              <span className="detail-value">
                {deliveryDetails.pickupLocation}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Dropoff:</span>
              <span className="detail-value">
                {deliveryDetails.dropoffLocation}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status:</span>
              <span className="detail-value">
                <span
                  className={`status-badge status-${deliveryDetails.status}`}
                >
                  {deliveryDetails.status}
                </span>
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="map-container card">
        <RouteMap polylineString={routeInfo?.polyline || ""} />
      </div>

      {routeInfo && (
        <div className="route-info-container">
          <RouteInfo routeData={routeInfo} />
        </div>
      )}
    </div>
  );
};

export default RouteTracker;
