import React, { Component, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Modal from "react-modal";
import axios from "axios";
import FuzzySearch from "react-fuzzy";
import SpotInfo from "../components/SpotInfo";

export default class Spots extends Component {
  constructor(props) {
    super(props);

    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeCategory = this.onChangeCategory.bind(this);
    this.onChangeCost = this.onChangeCost.bind(this);
    this.onChangeSpecialty = this.onChangeSpecialty.bind(this);
    this.onChangeQuality = this.onChangeQuality.bind(this);
    this.onChangeTime = this.onChangeTime.bind(this);
    this.onChangeLongitude = this.onChangeLongitude.bind(this);
    this.onChangeLatitude = this.onChangeLatitude.bind(this);
    this.onChangeSample = this.onChangeSample.bind.bind(this);

    this.onSubmitCreateSpot = this.onSubmitCreateSpot.bind(this);
    this.handleSelectedItem = this.handleSelectedItem.bind(this);
    this.spotInfo = this.spotInfo.bind(this);
    this.empty = this.empty.bind(this);

    this.state = {
      name: "",
      description: "",
      category: "",
      cost: 0,
      specialty: 0,
      quality: 0,
      time: 0,
      longitude: 0,
      latitude: 0,
      sampleOfSpots: [],
      displayingSpot: false,
    };
  }

  componentDidMount() {}

  onChangeName(e) {
    this.setState({
      name: e.target.value,
    });
  }
  onChangeDescription(e) {
    this.setState({
      description: e.target.value,
    });
  }
  onChangeCategory(e) {
    this.setState({
      category: e.target.value,
    });
  }
  onChangeCost(e) {
    this.setState({
      cost: e.target.value,
    });
  }
  onChangeSpecialty(e) {
    this.setState({
      specialty: e.target.value,
    });
  }
  onChangeQuality(e) {
    this.setState({
      quality: e.target.value,
    });
  }
  onChangeTime(e) {
    this.setState({
      time: e.target.value,
    });
  }
  onChangeLongitude(e) {
    this.setState({
      longitude: e.target.value,
    });
  }
  onChangeLatitude(e) {
    this.setState({
      latitude: e.target.value,
    });
  }
  onChangeSample(e) {
    this.setState({
      sampleOfSpots: e.target.value,
    });
  }
  onSubmitCreateSpot(e) {
    e.preventDefault();
    axios
      .post("http://localhost:3001/spots", {
        name: this.state.name,
        description: this.state.description,
        category: this.state.category,
        cost: this.state.cost,
        specialty: this.state.cost.specialty,
        quality: this.state.cost.quality,
        numberOfRatings: 1,
        avgTimeSpent: this.state.time,
        location: {
          longitude: this.state.longitude,
          latitude: this.state.latitude,
        },
      })
      .then((response) => {
        console.log(response);
        // clear vars?
      })
      .catch((err) => {
        console.log("error - creating new spot", err);
      });
  }
  onSubmitArea(e) {
    e.preventDefault();
    axios
      .get("http://localhost:3001/spots", {
        location: {
          longitude: this.state.longitude,
          latitude: this.state.latitude,
        },
      })
      .then((response) => {
        console.log(response);
        this.setState({ sampleOfSpots: response.data });
      })
      .catch((err) => {
        console.log("error - creating new spot", err);
      });
  }
  handleSelectedItem(event) {
    this.setState({
      name: event.name,
      description: event.description,
      category: event.category,
      cost: event.cost,
      specialty: event.specialty,
      quality: event.quality,
      time: event.avgTimeSpent,
      longitude: event.location.longitude,
      latitude: event.location.latitude,
      displayingSpot: true,
    });
  }

  locationForm() {
    return (
      <form onSubmit={this.onSubmitArea}>
        <div className="form-group">
          <label>Longitude: </label>
          <input
            type="text"
            required
            className="form-control"
            value={this.state.longitude}
            onChange={this.onChangeLongitude}
          />
        </div>
        <div className="form-group">
          <label>Latitude: </label>
          <input
            type="text"
            required
            className="form-control"
            value={this.state.latitude}
            onChange={this.onChangeLatitude}
          />
        </div>
        <div className="form-group">
          <input
            type="submit"
            value="Submit Spot"
            className="btn btn-primary"
          />
        </div>
      </form>
    );
  }
  spotSearchBar() {
    return (
      <FuzzySearch
        className="searchbar"
        placeholder="Find a potential spot by name. Please select a location to improve results."
        list={this.state.sampleOfSpots}
        keys={["name", "cost", "category", "specialty", "quality"]}
        width={430}
        onSelect={this.handleSelectedItem}
      />
    );
  }
  newSpotForm() {
    return (
      <form onSubmit={this.onSubmitCreateSpot}>
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
          <label>Description: </label>
          <input
            type="text"
            required
            className="form-control"
            value={this.state.description}
            onChange={this.onChangeDescription}
          />
        </div>
        <div className="form-group">
          <label>Category: </label>
          <input
            type="text"
            required
            className="form-control"
            value={this.state.category}
            onChange={this.onChangeCategory}
          />
        </div>
        <div className="form-group">
          <label>Cost: </label>
          <input
            type="text"
            required
            className="form-control"
            value={this.state.cost}
            onChange={this.onChangeCost}
          />
        </div>
        <div className="form-group">
          <label>Specialty: </label>
          <input
            type="text"
            required
            className="form-control"
            value={this.state.specialty}
            onChange={this.onChangeSpecialty}
          />
        </div>
        <div className="form-group">
          <label>Quality: </label>
          <input
            type="text"
            required
            className="form-control"
            value={this.state.quality}
            onChange={this.onChangeQuality}
          />
        </div>
        <div className="form-group">
          <label>Time Spent: </label>
          <input
            type="text"
            required
            className="form-control"
            value={this.state.time}
            onChange={this.onChangeTime}
          />
        </div>
        <div className="form-group">
          <label>Longitude: </label>
          <input
            type="text"
            required
            className="form-control"
            value={this.state.longitude}
            onChange={this.onChangeLongitude}
          />
        </div>
        <div className="form-group">
          <label>Latitude: </label>
          <input
            type="text"
            required
            className="form-control"
            value={this.state.latitude}
            onChange={this.onChangeLatitude}
          />
        </div>
        <div className="form-group">
          <input
            type="submit"
            value="Submit Spot"
            className="btn btn-primary"
          />
        </div>
      </form>
    );
  }

  spotInfo() {
    <SpotInfo
      name={this.state.name}
      description={this.state.description}
      category={this.state.category}
      cost={this.state.cost}
      specialty={this.state.specialty}
      quality={this.state.quality}
      time={this.state.time}
      longitude={this.state.longitude}
      latitude={this.state.latitude}
    />;
  }

  empty() {
    return <br></br>;
  }

  loggedInProfile() {
    const displayedSpot = this.state.displayingSpot
      ? this.spotInfo()
      : this.empty();
    return (
      <div className="profile-info">
        <h2>Hello, {this.state.name}</h2>
        {this.locationForm()}
        {/* Want fuzzy search bar here to search through all spots */}
        {this.spotSearchBar()}
        {/* Want to display SpotInfo objects here -- populate as:
                         <HostedOrderModal
                            groupId={activeGroup}
                            handleCloseModal={this.handleCloseHostedOrderModal}
                            handleUpdateGroup={this.handleSubmitNewOrder}
                            handleRejectOrder={this.handleRejectOrder}
                            handleAcceptOrder={this.handleAcceptOrder}
                            handleUpdateStatusRequest={this.handleUpdateStatusRequest}
                            handlePaidForOrder={this.handlePaidForOrder}

                        /> */}
        {displayedSpot}
        {this.newSpotForm()}
      </div>
    );
  }

  loggedOutProfile() {
    return (
      <div className="profile-info">
        <h2>Please return to home to sign in</h2>
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
