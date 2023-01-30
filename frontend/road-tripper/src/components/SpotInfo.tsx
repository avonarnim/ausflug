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
      <Typography>Time: {props.time}</Typography>
      <Typography>Longitude: {props.longitude}</Typography>
      <Typography>Latitude: {props.latitude}</Typography>
    </Box>
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
