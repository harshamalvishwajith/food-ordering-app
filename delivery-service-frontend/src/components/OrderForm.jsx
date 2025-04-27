import React, { useState } from "react";

const OrderForm = () => {
  const [orderId, setOrderId] = useState("12346");
  const [dropoffLocation, setDropoffLocation] = useState(
    "111/A/9 Araliya Uyana Angunawala"
  );
  const [pickupLocation, setPickupLocation] = useState(
    "111/A/9 Araliya Uyana Angunawala"
  );
  const [customerName, setCustomerName] = useState("Alphonso");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      orderId,
      pickupLocation,
      dropoffLocation,
      customerName,
    };

    try {
      const response = await fetch("http://localhost:3000/deliveries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        console.log("Order submitted successfully", response.json());
      } else {
        console.error("Failed to submit the order");
      }
    } catch (error) {
      console.error("Error submitting the order:", error);
    }
  };

  return (
    <div>
      <h2>Place Order</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Order ID</label>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
        </div>
        <div>
          <label>Pickup Location</label>
          <input
            type="text"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
          />
        </div>
        <div>
          <label>Dropoff Location</label>
          <input
            type="text"
            value={dropoffLocation}
            onChange={(e) => setDropoffLocation(e.target.value)}
          />
        </div>

        <div>
          <label>Customer Name</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>
        <button type="submit">Submit Order</button>
      </form>
    </div>
  );
};

export default OrderForm;
