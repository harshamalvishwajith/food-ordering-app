import "./App.css";
import RouteMap from "../components/RouteMap";
import RouteInfo from "../components/RouteInfo";
import OrderForm from "../components/OrderForm";
import DeliveryList from "../components/DeliveryList";

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
        <h1 className="text-2xl font-bold mb-4">Route Information</h1>
        <RouteInfo routeData={mockRouteData} />
      </div>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Route Map Food App</h1>
        <RouteMap polylineString={mockPolyline} />
      </div>
    </div>
  );
}

export default App;
