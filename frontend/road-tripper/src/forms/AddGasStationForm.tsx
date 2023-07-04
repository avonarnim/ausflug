import React, { useState, useRef } from "react";
import { Box, Button, TextField, Grid, Input, Typography } from "@mui/material";
import { useMutation } from "../core/api";
import { GasPriceProps, GasStationProps } from "../pages/Gas";
import { useAuth } from "../core/AuthContext";
import {
  useJsApiLoader,
  Autocomplete,
  GoogleMap,
  Marker,
} from "@react-google-maps/api";

type Libraries = (
  | "drawing"
  | "geometry"
  | "localContext"
  | "places"
  | "visualization"
)[];
const libraries: Libraries = ["places"];

export default function AddGasStationForm() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_MAPS_KEY!,
    libraries: libraries,
  });

  const { currentUser } = useAuth();
  const [successfulEdit, setSuccessfulEdit] = useState(false);
  const [map, setMap] = useState<google.maps.Map>();
  const [center, setCenter] = useState({ lat: 48.8584, lng: 2.2945 });
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const locationRef = React.useRef<HTMLInputElement>();
  const [autoComplete, setAutoComplete] =
    React.useState<google.maps.places.Autocomplete | null>(null);
  const onLoadAutocomplete = (autoC: google.maps.places.Autocomplete) => {
    setAutoComplete(autoC);
  };
  const [gasStationState, setGasStationState] = useState<GasStationProps>({
    _id: "",
    name: "",
    ratings: [],
    rating: 0,
    number_of_ratings: 0,
    mapLocation: {
      formatted_address: "",
      formatted_phone_number: "",
      geometry: {
        location: {
          lat: 0,
          lng: 0,
        },
      },
      place_id: "",
    },
    prices: [],
    resolved_prices: {
      unleaded: 0,
      midgrade: 0,
      premium: 0,
      diesel: 0,
    },
  });
  const [pricesState, setPricesState] = useState({
    unleaded: 0,
    midgrade: 0,
    premium: 0,
    diesel: 0,
    date: new Date().getTime(),
    userId: currentUser?.uid || "",
  });

  const addGasStation = useMutation("AddGasStation");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handling change", event);
    setGasStationState({
      ...gasStationState,
      [event.target.name]: event.target.value,
    });
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handling price change", event);
    setPricesState({
      ...pricesState,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async () => {
    gasStationState.prices = [
      {
        ...pricesState,
      },
    ];
    const createRes = await addGasStation.commit({
      ...gasStationState,
    });
    setSuccessfulEdit(true && createRes);
  };

  const onLoad = React.useCallback(async function callback(
    map: google.maps.Map
  ) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    }

    setMap(map);
  },
  []);

  // upon success of finding the user's location, set the center of the map to that location
  function success(position: GeolocationPosition) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    setCenter({ lat: latitude, lng: longitude });
    map?.panTo(center);
    map?.setZoom(4);
  }

  // if the user's location cannot be found, set the center of the map to the continental US
  function error() {
    console.log("Unable to retrieve your location");
  }

  const onUnmount = React.useCallback(function callback(map: google.maps.Map) {
    setMap(undefined);
  }, []);

  const onPlaceChanged = () => {
    console.log("place changed", autoComplete === null);
    if (autoComplete !== null) {
      const place = autoComplete.getPlace();
      console.log(
        "place",
        place.geometry?.location,
        place.geometry?.location?.lat(),
        place.geometry?.location?.lng()
      );
      if (!place.geometry || !place.geometry.location) {
        console.log("No details available for input: '" + place.name + "'");
        return;
      }

      if (place.geometry.viewport) {
        map?.fitBounds(place.geometry.viewport);
      } else {
        map?.setCenter(place.geometry.location);
      }

      marker?.setMap(null);
      setMarker(
        new google.maps.Marker({
          position: place.geometry?.location,
          map: map,
        })
      );

      handleChange({
        target: {
          name: "mapLocation",
          value: place,
        },
      } as React.ChangeEvent<HTMLInputElement>);
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  return (
    <Box
      sx={{
        borderRadius: "5px",
        border: "1px solid black",
        backgroundColor: "white",
        p: 2,
        m: 2,
      }}
    >
      {successfulEdit ? (
        <>
          <Typography>Thanks! The gas station has been added!</Typography>
          <Button onClick={() => setSuccessfulEdit(false)}>Add another</Button>
        </>
      ) : (
        <>
          <Typography variant="h6">Add a gas station</Typography>
          <Grid item container xs={12} direction="row">
            {isLoaded && (
              <Grid item xs={12} sm={5}>
                <Autocomplete
                  onLoad={onLoadAutocomplete}
                  onPlaceChanged={onPlaceChanged}
                  className="autocomplete"
                >
                  <Input
                    type="text"
                    name="name"
                    placeholder="Name of gas station"
                    inputRef={locationRef}
                    onChange={handleChange}
                  />
                </Autocomplete>
                <br />
                <TextField
                  margin="dense"
                  id="unleaded"
                  label="Unleaded Price"
                  type="number"
                  fullWidth
                  variant="standard"
                  name="unleaded"
                  defaultValue={pricesState.unleaded}
                  onChange={handlePriceChange}
                />
                <TextField
                  margin="dense"
                  id="midgrade"
                  label="Midgrade Price"
                  type="number"
                  fullWidth
                  variant="standard"
                  name="midgrade"
                  defaultValue={pricesState.midgrade}
                  onChange={handlePriceChange}
                />
                <TextField
                  margin="dense"
                  id="premium"
                  label="Premium Price"
                  type="number"
                  fullWidth
                  variant="standard"
                  name="premium"
                  defaultValue={pricesState.premium}
                  onChange={handlePriceChange}
                />
                <TextField
                  margin="dense"
                  id="diesel"
                  label="Diesel Price"
                  type="number"
                  fullWidth
                  variant="standard"
                  name="diesel"
                  defaultValue={pricesState.diesel}
                  onChange={handlePriceChange}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={7} pl={4}>
              <GoogleMap
                mapContainerStyle={{ width: "300px", height: "300px" }}
                center={center}
                zoom={3}
                onLoad={onLoad}
                onUnmount={onUnmount}
              ></GoogleMap>
            </Grid>
          </Grid>
          <Button onClick={() => handleSubmit()}>Submit</Button>
        </>
      )}
    </Box>
  );
}
