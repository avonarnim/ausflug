import React, { Component, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Modal from "react-modal";
import { FormControl, Form, Button, Col, Row } from "react-bootstrap";
import axios from "axios";
import sha256 from "crypto-js/sha256";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onSubmitLogIn = this.onSubmitLogIn.bind(this);
    this.onSubmitCreateProfile = this.onSubmitCreateProfile.bind(this);

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

  onChangeUsername(e) {
    this.setState({
      username: e.target.value,
    });
  }
  onChangeName(e) {
    this.setState({
      name: e.target.value,
    });
  }
  onChangeEmail(e) {
    this.setState({
      email: e.target.value,
    });
  }
  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }
  onChangePasswordHash(e) {
    this.setState({
      passwordHash: e.target.value,
    });
  }
  onChangeSavedTripIDs(e) {
    this.setState({
      savedTripIDs: e.target.value,
    });
  }
  onChangeFollowing(e) {
    this.setState({
      following: e.target.value,
    });
  }

  // logging in
  onSubmitLogIn(e) {
    e.preventDefault();
    const user = {
      username: this.state.username,
      password: this.state.password,
    };
    console.log(user);
    console.log(sha256(user.password));
    user.passHash = sha256(user.password);
    console.log(user.passHash);

    axios
      .get("http://localhost:3001/users", {
        params: {
          username: user.username,
        },
      })
      .then((response) => {
        console.log(response);
        // if response was received (i.e. got a user entry) & passHash matches with generated passHash, then go to logged-in view
        // else, wipe password & re-prompt for password
      })
      .catch((err) => {
        console.log("error - grabbing profile", err);
      });
  }

  // creating new account
  onSubmitCreateProfile(e) {
    e.preventDefault();
    const user = {
      username: this.state.username,
      passHash: sha256(this.state.password),
      email: this.state.email,
      name: this.state.name,
    };
    console.log(user);
    axios
      .get("http://localhost:3001/users", {
        params: {
          username: user.username,
        },
      })
      .then((response) => {
        console.log(response);
        // // if already exists, wipe entries and re-prompt for username
        // // else, perform add to database
        // axios
        //   .post("http://localhost:3001/users", {
        //     body: {
        //       username: user.username,
        //       passHash: user.passHash,
        //       email: user.email,
        //       name: user.name,
        //     },
        //   })
        //   .then((response) => {
        //     console.log(response);
        //     // automatically go to logged in view (set loggedIn to true)
        //   })
        //   .catch((err) => {
        //     console.log("error - posting profile", err);
        //   });
      })
      .catch((err) => {
        console.log("error - grabbing profile", err);
      });
  }

  loggedInProfile() {
    return (
      <div className="profile-info">
        <h2>Hello, {this.state.name}</h2>
        <p>I will place personal trip info here</p>
      </div>
    );
  }

  logIn() {
    return (
      <form onSubmit={this.onSubmitLogIn}>
        <div className="form-group">
          <label>Username: </label>
          <input
            type="text"
            required
            className="form-control"
            value={this.state.username}
            onChange={this.onChangeUsername}
          />
        </div>
        <div className="form-group">
          <label>Password: </label>
          <input
            type="text"
            required
            className="form-control"
            value={this.state.password}
            onChange={this.onChangePassword}
          />
        </div>
        <div className="form-group">
          <input type="submit" value="Log In" className="btn btn-primary" />
        </div>
      </form>
    );
  }

  signUp() {
    return (
      <form onSubmit={this.onSubmitCreateProfile}>
        <div className="form-group">
          <label>Username: </label>
          <input
            type="text"
            required
            className="form-control"
            value={this.state.username}
            onChange={this.onChangeUsername}
          />
        </div>
        <div className="form-group">
          <label>Name: </label>
          <input
            type="text"
            required
            className="form-control"
            value={this.state.name}
            onChange={this.onChangeName}
          />
        </div>
        <div className="form-group">
          <label>Email: </label>
          <input
            type="text"
            required
            className="form-control"
            value={this.state.email}
            onChange={this.onChangeEmail}
          />
        </div>
        <div className="form-group">
          <label>Password: </label>
          <input
            type="text"
            required
            className="form-control"
            value={this.state.password}
            onChange={this.onChangePassword}
          />
        </div>
        <div className="form-group">
          <input type="submit" value="Sign Up" className="btn btn-primary" />
        </div>
      </form>
    );
  }

  loggedOutProfile() {
    return (
      <div className="profile-info">
        <h2>Please sign up for an account or log in</h2>
        {this.logIn()}
        {this.signUp()}
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
