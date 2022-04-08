import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./styles/Home.css";
import "../../node_modules/bootstrap/dist/css/bootstrap.css";

export default class NavBar extends Component {
  constructor(props) {
    super(props);

    const loggedInUser = sessionStorage.getItem("userInfo");
    console.log("mounting");
    console.log(loggedInUser);

    this.state = {
      loggedIn: loggedInUser ? true : false,
      username: "",
      name: "",
      password: "",
      passwordHash: "",
      email: "",
      savedTripIDs: [],
      following: [],
    };
  }

  componentDidMount() {
    const loggedInUser = sessionStorage.getItem("userInfo");
    console.log("mounting");
    console.log(loggedInUser);
    if (loggedInUser) {
      const userInfo = JSON.parse(loggedInUser);

      this.setState({
        loggedIn: userInfo.loggedIn,
        username: userInfo.username,
        name: userInfo.name,
        passwordHash: userInfo.passwordHash,
        email: userInfo.email,
        savedTripIDs: userInfo.savedTripIDs,
        following: userInfo.following,
      });
    }
  }

  logOut() {
    sessionStorage.clear();
  }

  loggedOutProfile() {
    return (
      <a href="/home" className="nav-item">
        Log In
      </a>
    );
  }
  loggedInProfile() {
    return (
      <a href="/home" onClick={this.logOut} className="nav-item">
        Log Out
      </a>
    );
  }

  render() {
    const loggedIn = this.state.loggedIn
      ? this.loggedInProfile()
      : this.loggedOutProfile();
    console.log("rendering");
    console.log(this.state.loggedIn);
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
          {loggedIn}
        </div>
      </nav>
    );
  }
}
