import React, { useState, useEffect } from "react";
import {
  Check,
  ArrowRight,
  Package,
  User,
  MapPin,
  Calendar,
  Clock,
} from "lucide-react";
import { useMapContext } from "../context/MapContext";

interface DeliveryItem {
  id: string;
  orderId: string;
  pickupLocation: string;
  dropoffLocation: string;
  customerName: string;
  status: string;
  createdAt: string;
  items: { name: string; quantity: number; price: string }[];
  totalAmount: string;
}

const DeliveryManagement: React.FC = () => {
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([]);
  const [acceptedDeliveries, setAcceptedDeliveries] = useState<DeliveryItem[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const { setDeliveryId } = useMapContext(); // Assuming you need to set deliveryId for navigation

  // Fetch deliveries when component mounts
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true); // Start loading
        const response = await fetch("http://localhost:3000/deliveries"); // Adjust URL if needed
        const data = await response.json();

        console.log("Fetched deliveries:", data); // Debugging line
        const mappedDeliveries: DeliveryItem[] = (data ?? []).map(
          (item: any) => ({
            id: item.id,
            orderId: item.orderId,
            pickupLocation: item.pickupLocation,
            dropoffLocation: item.dropoffLocation,
            customerName: item.customerName, // Assuming customerName exists
            status: item.status,
            createdAt: item.createdAt,
            items:
              item.items?.map((i: any) => ({
                name: i.name,
                quantity: i.quantity,
                price: i.price,
              })) || [], // Empty array if no items
            totalAmount: item.totalAmount || "0.00", // Assuming totalAmount might be missing too
          })
        );
        setDeliveries(
          mappedDeliveries.filter((delivery) => delivery.status === "PENDING")
        );
        setAcceptedDeliveries(
          mappedDeliveries.filter((delivery) => delivery.status == "ASSIGNED")
        );
      } catch (error) {
        console.error("Error fetching deliveries:", error);
      } finally {
        setLoading(false); // Always stop loading
      }
    };

    fetchDeliveries();
  }, []);

  const handleNavigate = (id: string) => {
    // Navigate to the delivery details page (or map view) using the delivery ID
    console.log("Navigating to delivery:", id);
    setDeliveryId(id);
    //useNavigate(`/delivery/${id}`); // Assuming you have a route for delivery details
  };

  const handleAcceptDelivery = (id: string) => {
    // Find the delivery by ID
    const deliveryToAccept = deliveries.find((delivery) => delivery.id === id);
    if (!deliveryToAccept) return;

    // Send the PATCH request to the backend to accept the delivery
    fetch(`http://localhost:3000/deliveries/${id}/accept`, {
      method: "PATCH",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Delivery accepted:", data);

        // Update local state: move the accepted delivery from 'deliveries' to 'acceptedDeliveries'
        const updatedDelivery = { ...deliveryToAccept, status: "ASSIGNED" };
        setAcceptedDeliveries((prev) => [...prev, updatedDelivery]);
        setDeliveries((prev) => prev.filter((delivery) => delivery.id !== id));
      })
      .catch((error) => console.error("Error accepting delivery:", error));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="delivery-management slide-up">
      <h2 className="section-title">Delivery Management</h2>
      <p className="section-description">
        View and manage your delivery assignments
      </p>

      {loading ? (
        <div className="loading-container">
          <div className="loading-animation"></div>
          <p>Loading deliveries...</p>
        </div>
      ) : (
        <>
          <div className="delivery-section">
            <h3 className="subsection-title">
              <Package size={20} />
              <span>Available Deliveries</span>
              <span className="count-badge">{deliveries.length}</span>
            </h3>

            {deliveries.length === 0 ? (
              <div className="empty-state card">
                <p>No pending deliveries available at the moment.</p>
              </div>
            ) : (
              <div className="delivery-list">
                {deliveries.map((delivery) => (
                  <div key={delivery.id} className="delivery-card card">
                    <div className="delivery-header">
                      <h4 className="delivery-id">{delivery.orderId}</h4>
                      <span
                        className={`status-badge status-${delivery.status}`}
                      >
                        {delivery.status}
                      </span>
                    </div>

                    <div className="delivery-content">
                      <div className="delivery-detail">
                        <User size={16} className="detail-icon" />
                        <span className="detail-label">Customer:</span>
                        <span className="detail-value">
                          {delivery.customerName}
                        </span>
                      </div>

                      <div className="delivery-detail">
                        <MapPin size={16} className="detail-icon" />
                        <span className="detail-label">Pickup:</span>
                        <span className="detail-value">
                          {delivery.pickupLocation}
                        </span>
                      </div>

                      <div className="delivery-detail">
                        <MapPin size={16} className="detail-icon" />
                        <span className="detail-label">Dropoff:</span>
                        <span className="detail-value">
                          {delivery.dropoffLocation}
                        </span>
                      </div>

                      <div className="delivery-detail">
                        <Calendar size={16} className="detail-icon" />
                        <span className="detail-label">Created:</span>
                        <span className="detail-value">
                          {formatDate(delivery.createdAt)}
                        </span>
                      </div>

                      <div className="delivery-items">
                        <span className="items-title">Order Items:</span>
                        <ul className="items-list">
                          {delivery.items.map((item, index) => (
                            <li key={index} className="item-detail">
                              <span className="item-name">{item.name}</span>
                              <span className="item-quantity">
                                ×{item.quantity}
                              </span>
                              <span className="item-price">{item.price}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="total-amount">
                          <span>Total:</span>
                          <span className="amount">{delivery.totalAmount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="delivery-actions">
                      <button
                        className="btn btn-primary accept-btn"
                        onClick={() => handleAcceptDelivery(delivery.id)}
                      >
                        <Check size={18} />
                        <span>Accept Delivery</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="delivery-section">
            <h3 className="subsection-title">
              <Clock size={20} />
              <span>Your Active Deliveries</span>
              <span className="count-badge">{acceptedDeliveries.length}</span>
            </h3>

            {acceptedDeliveries.length === 0 ? (
              <div className="empty-state card">
                <p>You haven't accepted any deliveries yet.</p>
              </div>
            ) : (
              <div className="delivery-list">
                {acceptedDeliveries.map((delivery) => (
                  <div
                    key={delivery.id}
                    className="delivery-card card active-delivery"
                  >
                    <div className="delivery-header">
                      <h4 className="delivery-id">{delivery.orderId}</h4>
                      <span
                        className={`status-badge status-${delivery.status}`}
                      >
                        {delivery.status}
                      </span>
                    </div>

                    <div className="delivery-route">
                      <div className="route-point">
                        <div className="point-marker pickup-marker"></div>
                        <div className="point-details">
                          <span className="point-label">Pickup</span>
                          <span className="point-value">
                            {delivery.pickupLocation}
                          </span>
                        </div>
                      </div>

                      <div className="route-line">
                        <ArrowRight size={16} className="route-arrow" />
                      </div>

                      <div className="route-point">
                        <div className="point-marker dropoff-marker"></div>
                        <div className="point-details">
                          <span className="point-label">Dropoff</span>
                          <span className="point-value">
                            {delivery.dropoffLocation}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="delivery-footer">
                      <div className="customer-info">
                        <User size={16} className="customer-icon" />
                        <span className="customer-name">
                          {delivery.customerName}
                        </span>
                      </div>

                      <button
                        className="btn btn-accent"
                        onClick={() => handleNavigate(delivery.id)}
                      >
                        <span>Navigate</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DeliveryManagement;
