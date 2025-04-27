import React from "react";

const RouteInfo = ({ routeData }) => {
  if (!routeData) return <div>Loading route information...</div>;

  const { distance, duration, steps } = routeData;

  return (
    <div className="p-4 rounded-lg shadow-lg bg-white max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Route Details</h2>
      <div className="mb-4">
        <p>
          <strong>Distance:</strong> {distance}
        </p>
        <p>
          <strong>Duration:</strong> {duration}
        </p>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Steps:</h3>
        <ol className="list-decimal list-inside space-y-2">
          {steps.map((step, index) => (
            <li key={index} className="text-gray-700">
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RouteInfo;
