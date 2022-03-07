import React, { Component, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Modal from "react-modal";
import PropTypes from "prop-types";

export default class SpotInfo extends Component {
  constructor(props) {
    super(props);

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
    };
  }

  // upon starting, should maintain logged-in view if logged in; else, present sign-in view
  // upon starting, should maintain logged-in view if logged in; else, present sign-in view
  componentDidMount() {
    this.setState({
      name: this.props.name,
      description: this.props.description,
      category: this.props.category,
      cost: this.props.cost,
      specialty: this.props.specialty,
      quality: this.props.quality,
      time: this.props.time,
      longitude: this.props.longitude,
      latitude: this.props.latitude,
    });
  }

  static propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    cost: PropTypes.number,
    specialty: PropTypes.number,
    quality: PropTypes.number,
    time: PropTypes.number,
    longitude: PropTypes.number,
    latitude: PropTypes.number,
  };

  render() {
    return (
      <div className="home">
        <div>
          Name: {this.state.name}
          Description: {this.state.description}
          Category: {this.state.category}
          Cost: {this.state.cost}
          Specialty: {this.state.specialty}
          Quality: {this.state.quality}
          Time: {this.state.time}
          Longitude: {this.state.longitude}
          Latitude: {this.state.latitude}
        </div>
      </div>
    );
  }
}
