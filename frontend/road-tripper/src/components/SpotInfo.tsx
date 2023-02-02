import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";

export function SpotInfo(props: SpotInfoProps): JSX.Element {
  return (
    <Box>
      <Typography>Name: {props.name}</Typography>
      <Typography>Description: {props.description}</Typography>
      <Typography>Category: {props.category}</Typography>
      <Typography>Cost: {props.cost}</Typography>
      <Typography>Specialty: {props.specialty}</Typography>
      <Typography> Quality: {props.quality}</Typography>
      <Typography>Time: {props.avgTimeSpent}</Typography>
      <Typography>Longitude: {props.location.longitude}</Typography>
      <Typography>Latitude: {props.location.latitude}</Typography>
    </Box>
  );
}

export type SpotInfoProps = {
  id: string;
  name: string;
  description: string;
  category: string;
  cost: number;
  specialty: number;
  quality: number;
  numberOfRatings: number;
  avgTimeSpent: number;
  location: {
    longitude: number;
    latitude: number;
  };
  sponsored: boolean;
  duration: number;
  status: string;
  openTimes: number[];
};
