import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Modal from "react-modal";
import { FormControl, Form, Button, Col, Row } from "react-bootstrap";
import axios from "axios";

export default class EditTripPage extends Component {
  constructor(props) {
    super(props);

    this.onChangeStartingLat = this.onChangeStartingLat.bind(this);
    this.onChangeStartingLong = this.onChangeStartingLong.bind(this);
    this.onChangeFinalLat = this.onChangeFinalLat.bind(this);
    this.onChangeFinalLong = this.onChangeFinalLong.bind(this);
    this.onChangeDesiredTotalDriveTime =
      this.onChangeDesiredTotalDriveTime.bind(this);
    this.onChangeDesiredTotalTravelTime =
      this.onChangeDesiredTotalTravelTime.bind(this);
    this.onChangeDesiredMaxCost = this.onChangeDesiredMaxCost.bind(this);
    this.onChangeDesiredMinSpecialty =
      this.onChangeDesiredMinSpecialty.bind(this);
    this.onChangeDesiredMinQuality = this.onChangeDesiredMinQuality.bind(this);
    this.onChangeDesiredNights = this.onChangeDesiredNights.bind(this);
    this.onChangeDesiredFoodCategories =
      this.onChangeDesiredFoodCategories.bind(this);
    this.onChangeDesiredDetourCategories =
      this.onChangeDesiredDetourCategories.bind(this);

    this.onSubmitPreferences = this.onSubmitPreferences.bind(this);
    this.onSaveTrip = this.onSaveTrip.bind(this);

    this.state = {
      loggedIn: false,
      username: "",
      name: false,
      passHash: "",
      email: "",
      savedTripIDs: [],
      following: [],

      startingLat: 0,
      startingLong: 0,
      finalLat: 0,
      finalLong: 0,
      desiredTotalDriveTime: 0,
      desiredTotalTravelTime: 0,
      desiredMaxCost: 0,
      desiredMinSpecialty: 0,
      desiredMinQuality: 0,
      desiredNights: 0,
      desiredFoodCategories: [],
      desiredDetourCategories: [],
      possibleStops: [],
      confirmedStops: [],
      actualDriveTime: 0,
      actualTravelTime: 0,
      completed: false,

      update: false,
    };
  }

  // upon starting, should maintain logged-in view if logged in; else, present sign-in view
  componentDidMount() {
    const loggedInUser = sessionStorage.getItem("userInfo");
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
    const editingNotCreating = sessionStorage.getItem("tripID");
    if (editingNotCreating) {
      const tripInfo = JSON.parse(tripInfo);
      this.setState({
        startingLat: tripInfo.startingLocation.latitude,
        startingLong: tripInfo.startingLocation.longitude,
        finalLat: tripInfo.finalLocation.latitude,
        finalLong: tripInfo.finalLocation.longitude,
        username: tripInfo.username,
        desiredTotalDriveTime: tripInfo.desiredTotalDriveTime,
        desiredTotalTravelTime: tripInfo.desiredTotalTravelTime,
        desiredMaxCost: tripInfo.desiredMaxCost,
        desiredMinSpecialty: tripInfo.desiredMinSpecialty,
        desiredMinQuality: tripInfo.desiredMinQuality,
        desiredNights: tripInfo.desiredNights,
        desiredFoodCategories: tripInfo.desiredFoodCategories,
        desiredDetourCategories: tripInfo.desiredDetourCategories,
        confirmedStops: tripInfo.confirmedStops,
        actualDriveTime: tripInfo.actualDriveTime,
        actualTravelTime: tripInfo.actualTravelTime,
        completed: tripInfo.completed,
      });
    }
  }
  onChangeStartingLat(e) {
    this.setState({
      startingLat: e.target.value,
    });
  }
  onChangeStartingLong(e) {
    this.setState({
      startingLong: e.target.value,
    });
  }
  onChangeFinalLat(e) {
    this.setState({
      finalLat: e.target.value,
    });
  }
  onChangeFinalLong(e) {
    this.setState({
      finalLong: e.target.value,
    });
  }
  onChangeDesiredTotalDriveTime(e) {
    this.setState({
      desiredTotalDriveTime: e.target.value,
    });
  }
  onChangeDesiredTotalTravelTime(e) {
    this.setState({
      desiredTotalTravelTime: e.target.value,
    });
  }
  onChangeDesiredMaxCost(e) {
    this.setState({
      desiredMaxCost: e.target.value,
    });
  }
  onChangeDesiredMinSpecialty(e) {
    this.setState({
      desiredMinSpecialty: e.target.value,
    });
  }
  onChangeDesiredMinQuality(e) {
    this.setState({
      desiredMinQuality: e.target.value,
    });
  }
  onChangeDesiredNights(e) {
    this.setState({
      desiredNights: e.target.value,
    });
  }
  onChangeDesiredFoodCategories(e) {
    this.setState({
      desiredFoodCategories: e.target.value,
    });
  }
  onChangeDesiredDetourCategories(e) {
    this.setState({
      username: e.target.value,
    });
  }

  // Go through confirmed stops and find the total travel/drive times
  getTime() {
    let spotA;
    let spotB = {
      latitude: this.state.startingLat,
      longitude: this.state.startingLong,
      averageTimeSpent: 0,
    };
    let driveTime = 0;
    let stayTime = 0;
    while (this.state.confirmedStops.length > 0) {
      spotA = spotB;
      spotB = this.state.confirmedStops.pop();
      driveTime +=
        Math.abs(spotA.latitude - spotB.latitude) +
        Math.abs(spotA.longitude - spotB.longitude);
      stayTime += spotB.averageTimeSpent;
    }
    spotA = spotB;
    spotB = {
      latitude: this.state.finalLat,
      longitude: this.state.finalLong,
      averageTimeSpent: 0,
    };
    driveTime +=
      Math.abs(spotA.latitude - spotB.latitude) +
      Math.abs(spotA.longitude - spotB.longitude);
    this.state.actualDriveTime = driveTime;
    this.state.actualTravelTime = driveTime + stayTime;
  }

  // query database for nearby stops that fit criteria
  onSubmitPreferences(e) {
    e.preventDefault();

    let timeToTraverse = this.getTime();
    let timeAvailable = this.state.desiredDriveTime - timeToTraverse;

    const leftOrRight = this.state.startingLat - this.state.finalLat; // pos --> going west
    const upOrDown = this.state.startingLong - this.state.finalLong; // pos --> going south
    const travelingHoriz = leftOrRight > upOrDown;
    axios
      .get(`http://localhost:3001/spots`, {
        location: {
          longitude: {
            $gte:
              Math.min(this.state.startingLong, this.state.startingLong) -
              timeAvailable / 2,
            $lte:
              Math.max(this.state.startingLong, this.state.finalLong) +
              timeAvailable / 2,
          },
          latitude: {
            $gte:
              Math.min(this.state.startingLat, this.state.startingLat) -
              timeAvailable / 2,
            $lte:
              Math.max(this.state.startingLat, this.state.finalLat) +
              timeAvailable / 2,
          },
        },
        desiredMaxCost: { $lte: this.state.desiredMaxCost },
        desiredMinSpecialty: { $gte: this.state.desiredMinSpecialty },
        desiredMinQuality: { $gte: this.state.desiredMinQuality },
      })
      .then((response) => {
        this.setState({
          update: true,
          possibleStops: response.data,
        });
      })
      .catch((err) => {
        console.log("error - grabbing profile", err);
      });
  }

  // save trip in database & place generated id into user list
  onSaveTrip(e) {
    e.preventDefault();
    axios
      .post(`http://localhost:3001/trips`, {
        startingLat: this.state.startingLat,
        startingLong: this.state.startingLong,
        finalLat: this.state.finalLat,
        finalLong: this.state.finalLong,
        username: this.state.username,
        desiredTotalDriveTime: this.state.desiredTotalDriveTime,
        desiredTotalTravelTime: this.state.desiredTotalTravelTime,
        desiredMaxCost: this.state.desiredMaxCost,
        desiredMinSpecialty: this.state.desiredMinSpecialty,
        desiredMinQuality: this.state.desiredMinQuality,
        desiredNights: this.state.desiredNights,
        desiredFoodCategories: this.state.desiredFoodCategories,
        desiredDetourCategories: this.state.desiredDetourCategories,
        confirmedStops: this.state.confirmedStops,
        actualDriveTime: this.state.actualDriveTime,
        actualTravelTime: this.state.actualTravelTime,
        completed: this.state.completed,
      })
      .then((response) => {
        axios
          .put(
            `http://localhost:3001/trips/` +
              this.state.username +
              `/` +
              response.id
          )
          .then((response) => {
            console.log("saved trip to user profile");
          })
          .catch((err) => {
            console.log("error - saving trip to user profile");
          });
      })
      .catch((err) => {
        console.log("error - saving trip", err);
      });
  }

  preferencesForm() {
    return (
      <form onSubmit={this.onSubmitPreferences}>
        <div className="form-group">
          <label>Starting Latitude: </label>
          <input
            type="text"
            required
            className="form-control"
            value={this.state.startingLat}
            onChange={this.onChangeStartingLat}
          />
        </div>
        <div className="form-group">
          <label>Starting Longitude: </label>
          <input
            type="text"
            required
            className="form-control"
            value={this.state.startingLong}
            onChange={this.onChangeStartingLong}
          />
        </div>
        <div className="form-group">
          <label>Final Latitude: </label>
          <input
            type="text"
            required
            className="form-control"
            value={this.state.finalLat}
            onChange={this.onChangeFinalLat}
          />
        </div>
        <div className="form-group">
          <label>Final Longitude: </label>
          <input
            type="text"
            required
            className="form-control"
            value={this.state.finalLong}
            onChange={this.onChangeFinalLong}
          />
        </div>
        <div className="form-group">
          <label>Drive Time: </label>
          <input
            type="text"
            required
            className="form-control"
            value={this.state.desiredTotalDriveTime}
            onChange={this.onChangeDesiredTotalDriveTime}
          />
        </div>
        <div className="form-group">
          <label>Travel Time: </label>
          <input
            type="text"
            required
            className="form-control"
            value={this.state.desiredTotalTravelTime}
            onChange={this.onChangeDesiredTotalTravelTime}
          />
        </div>
        <div className="form-group">
          <label>Cost: </label>
          <input
            type="text"
            required
            className="form-control"
            value={this.state.desiredMaxCost}
            onChange={this.onChangeDesiredMaxCost}
          />
        </div>
        <div className="form-group">
          <label>Specialty: </label>
          <input
            type="text"
            required
            className="form-control"
            value={this.state.desiredMinSpecialty}
            onChange={this.onChangeDesiredMinSpecialty}
          />
        </div>
        <div className="form-group">
          <label>Quality: </label>
          <input
            type="text"
            required
            className="form-control"
            value={this.state.desiredMinQuality}
            onChange={this.onChangeDesiredMinQuality}
          />
        </div>
        <div className="form-group">
          <label>Food: </label>
          <input
            type="text"
            required
            className="form-control"
            value={this.state.desiredFoodCategories}
            onChange={this.onChangeDesiredFoodCategories}
          />
        </div>
        <div className="form-group">
          <label>Detours: </label>
          <input
            type="text"
            required
            className="form-control"
            value={this.state.desiredDetourCategories}
            onChange={this.onChangeDesiredDetourCategories}
          />
        </div>
        <div className="form-group">
          <label>Travel Time: </label>
          <input
            type="text"
            required
            className="form-control"
            value={this.state.desiredTotalTravelTime}
            onChange={this.onChangeDesiredTotalTravelTime}
          />
        </div>
        <div className="form-group">
          <input type="submit" value="Get Trip" className="btn btn-primary" />
        </div>
      </form>
    );
  }

  saveTrip() {
    return (
      <a href="/home" onClick={this.onSaveTrip} className="nav-item">
        Save Trip
      </a>
    );
  }

  selectSpot(stop) {
    this.state.confirmedStops.push(stop);
  }

  tripDetails() {
    return (
      <div>
        Drive time: {this.state.actualDriveTime}
        Travel time: {this.state.actualTravelTime}
      </div>
    );
  }

  chooseSpots() {
    let stopButtons = [];
    for (const stop of this.state.possibleStops) {
      stopButtons.push(
        <div>
          <a onClick={() => this.selectSpot(stop)}>{stop.name}</a>
          <p>
            Quality Rating: {stop.quality} ({stop.numberOfRatings})
          </p>
          <p>
            Specialty Rating: {stop.specialty} ({stop.numberOfRatings})
          </p>
        </div>
      );
    }
    this.getTime();
    return <div>{stopButtons}</div>;
  }

  blank() {
    return <br></br>;
  }

  loggedInProfile() {
    const displaySpots = this.state.update ? this.blank() : this.chooseSpots();

    return (
      <div className="profile-info">
        <p>
          Please input information for a potential trip, then select all spots
          you'd like to include in the trip
        </p>
        {this.preferencesForm()}
        {this.tripDetails()}
        {displaySpots}
        {this.selectSpots()}
        {this.saveTrip()}
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
    console.log("in edit trip page");
    const loggedIn = this.state.loggedIn
      ? this.loggedInProfile()
      : this.loggedOutProfile();
    return (
      <div className="home">
        <div className="home-welcome">
          Hi! Welcome to Road Tripper! Please request a trip
        </div>
        {loggedIn}
      </div>
    );
  }
}
