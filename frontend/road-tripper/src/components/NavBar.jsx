import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

class NavBar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/home" className="navbar-brand">
          Road Tripper
        </a>
        <div className="navbar-nav mr-auto">
          <a href="/trips" className="nav-item">
            Trips
          </a>
          <a href="/spots" className="nav-item">
            Spots
          </a>
          <a href="/profile" className="nav-item">
            Profile
          </a>
        </div>
      </nav>
    );
  }
}

export default NavBar;
