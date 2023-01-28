import React, { Component, useState } from "react";
import PropTypes from "prop-types";

export function SpotInfo(props: SpotInfoProps): JSX.Element {
  return (
    <div className="home">
      <div>
        Name: {props.name}
        Description: {props.description}
        Category: {props.category}
        Cost: {props.cost}
        Specialty: {props.specialty}
        Quality: {props.quality}
        Time: {props.time}
        Longitude: {props.longitude}
        Latitude: {props.latitude}
      </div>
    </div>
  );
}

export type SpotInfoProps = {
  name: string;
  description: string;
  category: string;
  cost: string;
  specialty: string;
  quality: string;
  time: string;
  longitude: string;
  latitude: string;
};
