import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./styles/Home.css";

export function NavBar(): JSX.Element {
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
        {<p>Login stuff</p>}
      </div>
    </nav>
  );
}
