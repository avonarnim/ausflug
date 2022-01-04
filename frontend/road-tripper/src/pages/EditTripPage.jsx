import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Modal from "react-modal";
import { FormControl, Form, Button, Col, Row } from "react-bootstrap";
import axios from "axios";

export default class EditTripPage extends Component {
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
    };
    console.log(user);
    // perform get --> compare for equality
    // go to logged in view if equal, else re-prompt
  }

  // creating new account
  onSubmitCreateProfile(e) {
    e.preventDefault();
    const user = {
      username: this.state.username,
    };
    console.log(user);
    // perform add to database
    // automatically go to logged in view (set loggedIn to true)
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
            value={this.state.username}
            onChange={this.onChangePassword}
          />
        </div>
        <div className="form-group">
          <input type="submit" value="Sign In" className="btn btn-primary" />
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
            onChange={this.onChangePassword}
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
          <input type="submit" value="Sign In" className="btn btn-primary" />
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
