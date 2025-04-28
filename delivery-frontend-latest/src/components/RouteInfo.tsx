import React from "react";
import { Clock, Navigation, MoveRight } from "lucide-react";

interface RouteInfoProps {
  routeData: {
    distance: string;
    duration: string;
    steps: string[];
  };
}

const RouteInfo: React.FC<RouteInfoProps> = ({ routeData }) => {
  if (!routeData) return null;

  const { distance, duration, steps } = routeData;

  return (
    <div className="route-info card">
      <h3 className="card-title">Route Details</h3>

      <div className="route-summary">
        <div className="summary-item">
          <Clock size={20} className="summary-icon" />
          <div className="summary-content">
            <span className="summary-label">Estimated Time</span>
            <span className="summary-value">{duration}</span>
          </div>
        </div>

        <div className="summary-item">
          <Navigation size={20} className="summary-icon" />
          <div className="summary-content">
            <span className="summary-label">Distance</span>
            <span className="summary-value">{distance}</span>
          </div>
        </div>
      </div>

      <div className="route-steps">
        <h4 className="steps-title">Directions</h4>
        <ol className="steps-list">
          {steps.map((step, index) => (
            <li key={index} className="step-item">
              <div className="step-number">{index + 1}</div>
              <div className="step-content">
                <p className="step-text">{step}</p>
                {index < steps.length - 1 && (
                  <MoveRight size={16} className="step-icon" />
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RouteInfo;
