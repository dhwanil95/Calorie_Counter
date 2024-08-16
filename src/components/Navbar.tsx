import React from "react";
import "../styles/Navbar.css"; // Importing the CSS

const Navbar: React.FC = () => {
  return (
    <nav className="navbar-custom">
      <div className="navbar-wrapper">
        <div className="navbar-logo-section">
          {/* Logo Image */}
          <img
            src="/calorie-logo.svg"
            alt="Calorie Counter Logo"
            className="navbar-logo"
          />
          <span className="navbar-title">CALORIE COUNTER</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
