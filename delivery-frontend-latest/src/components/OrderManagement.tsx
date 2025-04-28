import React, { useState } from "react";
import { PlusCircle, CheckCircle } from "lucide-react";

const OrderManagement: React.FC = () => {
  const [formData, setFormData] = useState({
    orderId: "ORD-" + Math.floor(100000 + Math.random() * 900000),
    pickupLocation: "",
    dropoffLocation: "",
    customerName: "",
    items: [
      {
        name: "",
        quantity: 1,
        price: "",
      },
    ],
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [name]: name === "quantity" ? parseInt(value) || 0 : value,
    };

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", quantity: 1, price: "" }],
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length === 1) return;

    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.pickupLocation ||
      !formData.dropoffLocation ||
      !formData.customerName
    ) {
      setErrorMessage("Please fill in all required fields");
      setSuccessMessage("");
      return;
    }

    // Check if all items have name and price
    const validItems = formData.items.every((item) => item.name && item.price);
    if (!validItems) {
      setErrorMessage("Please complete all item details");
      setSuccessMessage("");
      return;
    }

    const orderData = {
      orderId: formData.orderId,
      pickupLocation: formData.pickupLocation,
      dropoffLocation: formData.dropoffLocation,
      customerName: formData.customerName,
      items: formData.items,
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
        await response.json();
        setSuccessMessage(
          "Order successfully created! Order ID: " + formData.orderId
        );
        setErrorMessage("");

        // Reset form with a new order ID
        setFormData({
          orderId: "ORD-" + Math.floor(100000 + Math.random() * 900000),
          pickupLocation: "",
          dropoffLocation: "",
          customerName: "",
          items: [
            {
              name: "",
              quantity: 1,
              price: "",
            },
          ],
        });
      } else {
        setErrorMessage("Failed to submit the order");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Error submitting the order:", error);
      setErrorMessage("Error submitting the order. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="order-management slide-up">
      <h2 className="section-title">Create New Delivery Order</h2>
      <p className="section-description">
        Create a new food delivery order for customers
      </p>

      {successMessage && (
        <div className="success-message">
          <CheckCircle size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="error-message">
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="order-form-container card">
        <form onSubmit={handleSubmit} className="order-form">
          <div className="form-group">
            <label htmlFor="orderId">Order ID</label>
            <input
              type="text"
              id="orderId"
              name="orderId"
              className="form-control"
              value={formData.orderId}
              disabled
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="customerName">Customer Name</label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                className="form-control"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="Enter customer name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pickupLocation">Pickup Location</label>
              <input
                type="text"
                id="pickupLocation"
                name="pickupLocation"
                className="form-control"
                value={formData.pickupLocation}
                onChange={handleInputChange}
                placeholder="Restaurant address"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dropoffLocation">Delivery Location</label>
              <input
                type="text"
                id="dropoffLocation"
                name="dropoffLocation"
                className="form-control"
                value={formData.dropoffLocation}
                onChange={handleInputChange}
                placeholder="Customer address"
              />
            </div>
          </div>

          <div className="order-items">
            <div className="order-items-header">
              <h3>Order Items</h3>
              <button
                type="button"
                className="btn btn-outline add-item-btn"
                onClick={addItem}
              >
                <PlusCircle size={18} />
                <span>Add Item</span>
              </button>
            </div>

            {formData.items.map((item, index) => (
              <div key={index} className="item-row">
                <div className="form-group item-name">
                  <label htmlFor={`item-name-${index}`}>Item</label>
                  <input
                    type="text"
                    id={`item-name-${index}`}
                    name="name"
                    className="form-control"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, e)}
                    placeholder="Food item name"
                  />
                </div>

                <div className="form-group item-quantity">
                  <label htmlFor={`item-quantity-${index}`}>Qty</label>
                  <input
                    type="number"
                    id={`item-quantity-${index}`}
                    name="quantity"
                    className="form-control"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    min="1"
                  />
                </div>

                <div className="form-group item-price">
                  <label htmlFor={`item-price-${index}`}>Price</label>
                  <input
                    type="text"
                    id={`item-price-${index}`}
                    name="price"
                    className="form-control"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, e)}
                    placeholder="$0.00"
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-outline remove-item-btn"
                  onClick={() => removeItem(index)}
                  disabled={formData.items.length === 1}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderManagement;
