import React from "react";
import { MapPin } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="container">
        <div className="flex justify-between items-center">
          <div className="logo flex items-center gap-2">
            <MapPin
              size={28}
              color="var(--color-primary)"
              strokeWidth={2}
              className="tracking-pulse"
            />
            <h1 className="text-xl font-bold">
              <span className="text-primary">Food</span>
              <span className="text-accent">Track</span>
            </h1>
          </div>

          <nav className="main-nav">
            <ul className="flex gap-4">
              <li>
                <a href="#" className="nav-link">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="nav-link">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="nav-link">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="nav-link">
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          <div className="user-actions">
            <button className="btn btn-outline">Sign In</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
