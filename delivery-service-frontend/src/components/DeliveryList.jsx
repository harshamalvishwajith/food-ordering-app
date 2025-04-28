import React, { useState, useEffect } from "react";

const DeliveryList = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [acceptedDeliveries, setAcceptedDeliveries] = useState([]);

  // Fetch the deliveries when the component mounts
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true); // Start loading
        const response = await fetch("http://localhost:3000/deliveries"); // Adjust URL if needed
        const data = await response.json();
        setDeliveries(data);
      } catch (error) {
        console.error("Error fetching deliveries:", error);
      } finally {
        setLoading(false); // Always stop loading
      }
    };

    fetchDeliveries();
  }, []);

  const handleAcceptDelivery = (id) => {
    // Find the delivery to accept
    const deliveryToAccept = deliveries.find((delivery) => delivery.id === id);

    // Move the delivery to the accepted list and remove from the pending list
    if (deliveryToAccept) {
      setAcceptedDeliveries((prevAccepted) => [
        ...prevAccepted,
        deliveryToAccept,
      ]);
      setDeliveries((prevDeliveries) =>
        prevDeliveries.filter((delivery) => delivery.id !== id)
      );

      // Optionally, make a PATCH request to update the status on the backend
      fetch(`http://localhost:3000/deliveries/${id}/accept`, {
        method: "PATCH",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Delivery accepted:", data);
        })
        .catch((error) => console.error("Error accepting delivery:", error));
    }
  };

  return (
    <div>
      <h2>Deliveries</h2>
      {deliveries.length === 0 ? (
        <p>No pending deliveries available.</p>
      ) : (
        <div>
          <h3>Pending Deliveries</h3>
          <ul>
            {deliveries.map((delivery) => (
              <li key={delivery.id} style={{ marginBottom: "20px" }}>
                <div>
                  <strong>Order ID:</strong> {delivery.orderId}
                </div>
                <div>
                  <strong>Delivery ID:</strong> {delivery.id}
                </div>
                <div>
                  <strong>Status:</strong> {delivery.status}
                </div>
                <div>
                  <strong>Pickup Location : </strong> {delivery.pickupLocation}{" "}
                  {delivery.pickupCoordinates &&
                    `(${delivery.pickupCoordinates.latitude}, ${delivery.pickupCoordinates.longitude})`}
                </div>
                <div>
                  <strong>Dropoff Location :</strong> {delivery.dropoffLocation}{" "}
                  {delivery.dropoffCoordinates &&
                    `(${delivery.dropoffCoordinates.latitude}, ${delivery.dropoffCoordinates.longitude})`}
                </div>
                <div>
                  <strong>Created At:</strong>{" "}
                  {new Date(delivery.createdAt).toLocaleString()}
                </div>
                <div>
                  <strong>Updated At:</strong>{" "}
                  {new Date(delivery.updatedAt).toLocaleString()}
                </div>
                <button onClick={() => handleAcceptDelivery(delivery.id)}>
                  Accept Delivery
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {acceptedDeliveries.length > 0 && (
        <div>
          <h3>Accepted Deliveries</h3>
          <ul>
            {acceptedDeliveries.map((delivery) => (
              <li key={delivery.id} style={{ marginBottom: "20px" }}>
                <div>
                  <strong>Order ID:</strong> {delivery.orderId}
                </div>
                <div>
                  <strong>Status:</strong> {delivery.status}
                </div>
                <div>
                  <strong>Pickup Location:</strong> {delivery.pickupLocation}
                </div>
                <div>
                  <strong>Dropoff Location:</strong> {delivery.dropoffLocation}
                </div>
                <div>
                  <strong>Created At:</strong>{" "}
                  {new Date(delivery.createdAt).toLocaleString()}
                </div>
                <div>
                  <strong>Updated At:</strong>{" "}
                  {new Date(delivery.updatedAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DeliveryList;
