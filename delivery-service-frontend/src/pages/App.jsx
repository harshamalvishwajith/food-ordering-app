import "./App.css";
import RouteMap from "../components/RouteMap";
import RouteInfo from "../components/RouteInfo";
import OrderForm from "../components/OrderForm";
import DeliveryList from "../components/DeliveryList";
import { useState, useEffect, use } from "react";

// TODO: Replace with actual polyline string from the API not calling because i want to use kafka
// if not kafka need to call navigate api in map service at port 3001

const mockPolyline =
  "_}gi@w{lfNMbAYrAw@nCg@tAcA`C{AnDeAfBWZk@b@sBjAsE`Co@f@SZYfAMn@eAlGy@bE]xBUbCc@xFWjEAbBDtANnBJhANf@F`@JNCx@QZKTEJ]n@e@v@_@t@y@pBMLOHOBiDKkEa@eAMgAMSe@Me@g@kCQgA[mAMa@^Lv@Df@A";

const mockRouteData = {
  distance: "2.7 km",
  duration: "7 mins",
  polyline:
    "_}gi@w{lfNMbAYrAw@nCg@tAcA`C{AnDeAfBWZk@b@sBjAsE`Co@f@SZYfAMn@eAlGy@bE]xBUbCc@xFWjEAbBDtANnBJhANf@F`@JNCx@QZKTEJ]n@e@v@_@t@y@pBMLOHOBiDKkEa@eAMgAMSe@Me@g@kCQgA[mAMa@^Lv@Df@A",
  steps: [
    "Head west on McCallum Rd/AC6 toward Kovil Veediya",
    "Merge onto Colombo - Batticaloa Hwy/Colombo - Ratnapura - Wellawaya - Batticaloa Rd/Parsons Rd/Sir Chittampalam A Gardiner Mawath/A4",
    "Continue onto York St/A1",
    "Continue straight to stay on York St/A1",
    "Continue straight onto York St",
    "Turn right after Kamal Enterprises ( PVT ) LTD (on the right)",
    "Turn right onto Lotus RdDestination will be on the right",
  ],
};

function App() {
  //calling the route service to get the route data
  const [routeData, setRouteData] = useState({
    pickup: { lat: 6.927079, lng: 79.861244 },
    drop: { lat: 6.936063, lng: 79.846722 },
  });
  const [deliveryId, setDeliveryId] = useState("123456");
  const [routeInfo, setRouteInfo] = useState();
  const [deliveryDetails, setDeliveryDetails] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Fetch the delivery details when the form is submitted
    fetchDelivery(deliveryId);
  };
  useEffect(() => {
    // fetch the route info when the delivery details are fetched
    if (deliveryDetails) {
      setRouteData({
        pickup: {
          lat: deliveryDetails.pickupCoordinates.latitude,
          lng: deliveryDetails.pickupCoordinates.longitude,
        },
        drop: {
          lat: deliveryDetails.dropoffCoordinates.latitude,
          lng: deliveryDetails.dropoffCoordinates.longitude,
        },
      });
    }
  }, [deliveryDetails]);

  useEffect(() => {
    // Fetch the route data when the routeData state changes

    console.log("What i am gonna send:", JSON.stringify(routeData));
    fetchRouteData();
    console.log("Route data changed:", routeData);
    console.log("Route info changed:", routeInfo);
  }, [routeData]);
  const fetchDelivery = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/deliveries/${id}`);
      const delivery = await response.json();
      console.log("Delivery data:", delivery);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      if (!delivery) {
        throw new Error("Delivery not found");
      }
      setDeliveryDetails(delivery);
      console.log("Delivery details:", delivery);
    } catch (error) {
      console.error("Error fetching delivery details:", error);
    }
  };

  const fetchRouteData = async () => {
    try {
      const response = await fetch("http://localhost:3001/navigate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(routeData),
      });
      const data = await response.json();
      console.log("Route data:", data);
      setRouteInfo(data);
    } catch (error) {
      console.error("Error fetching route data:", error);
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold mb-4">
          Add this to the order placing from the resturant
        </h1>
        <OrderForm />
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-4">
          Show this to the delivery person
        </h1>
        <DeliveryList />
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Delivery ID</label>
            <input
              type="text"
              value={deliveryId}
              onChange={(e) => setDeliveryId(e.target.value)}
            />
          </div>
          <button type="submit">Fetch Delivery</button>
        </form>

        <h1 className="text-2xl font-bold mb-4">Route Information</h1>
        <RouteInfo routeData={routeInfo ? routeInfo : mockRouteData} />
      </div>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Route Map Food App</h1>
        <RouteMap
          polylineString={routeInfo ? routeInfo.polyline : mockPolyline}
        />
      </div>
    </div>
  );
}

export default App;
