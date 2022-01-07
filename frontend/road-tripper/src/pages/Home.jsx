import React, { Component, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Modal from "react-modal";
import { FormControl, Form, Button, Col, Row } from "react-bootstrap";
import axios from "axios";
var bcrypt = require("bcryptjs");
const saltRounds = 10;

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangePasswordHash = this.onChangePasswordHash.bind(this);
    this.onChangeFollowing = this.onChangeFollowing.bind(this);
    this.onChangeSavedTripIDs = this.onChangeSavedTripIDs.bind(this);
    this.onSubmitLogIn = this.onSubmitLogIn.bind(this);
    this.onSubmitCreateProfile = this.onSubmitCreateProfile.bind(this);

    this.state = {
      loggedIn: false,
      username: "",
      name: "",
      password: "",
      passwordHash: "",
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
    let user = {
      username: this.state.username,
      password: this.state.password,
    };

    axios
      .get(`http://localhost:3001/users/${user.username}`)
      .then((response) => {
        // if response was received (i.e. got a user entry) & passwordHash matches with generated passwordHash, then go to logged-in view
        // else, wipe password & re-prompt for password
        if (
          bcrypt.compareSync(this.state.password, response.data.passwordHash)
        ) {
          console.log("correct password");
          this.setState({
            loggedIn: true,
          });
          localStorage.setItem("userInfo", {
            username: response.data.username,
            passwordHash: response.data.passwordHash,
            email: response.data.email,
            name: response.data.name,
            following: response.data.following,
            savedTripIDs: response.data.savedTripIDs,
            loggedIn: true,
          });
        } else {
          console.log("incorrect password");
        }
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
      passwordHash: bcrypt.hashSync(this.state.password, saltRounds),
      email: this.state.email,
      name: this.state.name,
    };
    console.log(user);
    axios
      .get(`http://localhost:3001/users/${user.username}`)
      .then((response) => {
        console.log(response);
        if (response.data != null) {
          // if already exists, wipe entries and re-prompt for username
          console.log("sorry");
        } else if (response.data == null) {
          // else, perform add to database
          axios
            .post("http://localhost:3001/users", {
              username: user.username,
              passwordHash: user.passwordHash,
              email: user.email,
              name: user.name,
            })
            .then((response) => {
              console.log(response);
              localStorage.setItem("userInfo", {
                username: user.username,
                passwordHash: user.passwordHash,
                email: user.email,
                name: user.name,
                following: [],
                savedTripIDs: [],
                loggedIn: true,
              });
              this.setState({
                loggedIn: true,
              });
              // automatically go to logged in view (set loggedIn to true)
            })
            .catch((err) => {
              console.log("error - posting profile", err);
            });
        }
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
