import { useState } from "react";
import Header from "./components/Header";
import RouteTracker from "./components/RouteTracker";
import OrderManagement from "./components/OrderManagement";
import DeliveryManagement from "./components/DeliveryManagement";
import { MapProvider } from "./context/MapContext";
import { Pizza, Route, Navigation } from "lucide-react";

function App() {
  const [activeTab, setActiveTab] = useState("track");

  return (
    <MapProvider>
      <div className="app-container">
        <Header />

        <main className="app-content container">
          <div className="tab-navigation">
            <button
              className={`tab-button ${activeTab === "track" ? "active" : ""}`}
              onClick={() => setActiveTab("track")}
            >
              <Route size={20} />
              <span>Track Delivery</span>
            </button>
            <button
              className={`tab-button ${activeTab === "order" ? "active" : ""}`}
              onClick={() => setActiveTab("order")}
            >
              <Pizza size={20} />
              <span>Restaurant Orders</span>
            </button>
            <button
              className={`tab-button ${
                activeTab === "delivery" ? "active" : ""
              }`}
              onClick={() => setActiveTab("delivery")}
            >
              <Navigation size={20} />
              <span>Delivery Management</span>
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "track" && <RouteTracker />}
            {activeTab === "order" && <OrderManagement />}
            {activeTab === "delivery" && <DeliveryManagement />}
          </div>
        </main>

        <footer className="app-footer">
          <div className="container">
            <p className="text-tertiary text-center py-4">
              © 2025 FoodTrack | Real-time Food Delivery Tracking
            </p>
          </div>
        </footer>
      </div>
    </MapProvider>
  );
}

export default App;
