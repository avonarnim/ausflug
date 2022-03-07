import React, { Component, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Modal from "react-modal";
import axios from "axios";

export default class Home extends Component {
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
    const loggedInUser = localStorage.getItem("userInfo");
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

  savedTrips() {
    let savedTrips = [];
    for (const id of this.state.savedTripIDs) {
      axios
        .get(`http://localhost:3001/trips/${id}`)
        .then((resp) => {
          savedTrips.push(resp.data);
        })
        .catch((err) => {
          console.log("error attaining following profile", err);
        });
    }

    return savedTrips.slice(0, 5).map((trip) => (
      <li>
        <a href={"/trips/" + trip._id}>
          Trip from {trip.startingLocation} to {trip.finalLocation}
        </a>
      </li>
    ));
  }

  following() {
    let followingInfos = [];
    for (const username of this.state.following) {
      axios
        .get(`http://localhost:3001/users/${this.state.username}`)
        .then((resp) => {
          followingInfos.push(resp.data);
        })
        .catch((err) => {
          console.log("error attaining following profile", err);
        });
    }
    return followingInfos.slice(0, 5).map((user) => <li>{user.username}</li>);
  }

  loggedInProfile() {
    return (
      <div className="profile-info">
        <h2>Hello, {this.state.name}</h2>
        <p>Email: {this.state.email}</p>
        <h4>Saved Trips:</h4>
        {this.savedTrips()}
        <h4>Following:</h4>
        {this.following()}
      </div>
    );
  }

  loggedOutProfile() {
    return (
      <div className="profile-info">
        <h2>Please navigate to home to sign in</h2>
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
