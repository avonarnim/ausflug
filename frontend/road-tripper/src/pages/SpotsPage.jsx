import React, { Component, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Modal from "react-modal";
import axios from "axios";

export default class Spots extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      username: "",
      name: false,
      passHash: "",
      email: "",
      savedTripIDs: [],
      following: [],
    };
  }

  // upon starting, should maintain logged-in view if logged in; else, present sign-in view
  componentDidMount() {
    if (this.props.loggedIn) {
      this.setState({
        loggedIn: this.props.loggedIn,
        username: this.props.username,
        name: this.props.name,
        passHash: this.props.passHash,
        email: this.props.email,
        savedTripIDs: this.props.savedTripIDs,
        following: this.props.following,
      });
    }
  }

  loggedInProfile() {
    return (
      <div className="profile-info">
        <h2>Hello, {this.state.name}</h2>
        <p>I will place spot search information here</p>
      </div>
    );
  }

  loggedOutProfile() {
    return (
      <div className="profile-info">
        <h2>Redirect to home?</h2>
      </div>
    );
  }

  render() {
    const loggedIn = this.state.loggedIn
      ? this.loggedInProfile()
      : this.loggedOutProfile();
    return (
      <div className="home">
        <div className="home-welcome">Hi! Welcome to Road Tripper!</div>
        {loggedIn}
      </div>
    );
  }
}
