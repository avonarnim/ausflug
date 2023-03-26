import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";

export function SpotInfo(props: SpotInfoProps): JSX.Element {
  return (
    <Box>
      <Typography>Name: {props.title}</Typography>
      <Typography>Description: {props.description}</Typography>
      <Typography>Category: {props.category}</Typography>
      <Typography>Cost: {props.cost}</Typography>
      <Typography>Specialty: {props.specialty}</Typography>
      <Typography>Quality: {props.quality}</Typography>
      <Typography>Time: {props.avgTimeSpent}</Typography>
      <Typography>Longitude: {props.location.lng}</Typography>
      <Typography>Latitude: {props.location.lat}</Typography>
    </Box>
  );
}

export type SpotInfoProps = {
  _id: string;
  title: string;
  image: string;
  description: string;
  category: string;
  cost: number;
  specialty: number;
  quality: number;
  numberOfRatings: number;
  avgTimeSpent: number;
  location: {
    lng: number;
    lat: number;
  };
  mapLocation: {
    formatted_address: string;
    formatted_phone_number: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    place_id: string;
    types: string[];
    rating: number;
    user_ratings_total: number;
    price_level: number;
  };
  sponsored: boolean;
  highlightedIn: string[];
  featuredBy: string[];
  duration: number;
  status: string;
  openTimes: number[];
};
