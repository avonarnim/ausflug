import {
  Button,
  Box,
  Grid,
  Input,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "../core/api";
import {
  useJsApiLoader,
  Autocomplete,
  GoogleMap,
  Marker,
} from "@react-google-maps/api";
import { SpotInfoProps } from "../components/SpotInfo";

export function QueueSpotFormDetailsSection(props: {
  values: MapQueueSpotFormState;
  handleNext: () => void;
  handleBack: () => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  map: google.maps.Map;
  center: { lat: number; lng: number };
  onLoad: (map: google.maps.Map) => void;
  onUnmount: (map: google.maps.Map) => void;
}): JSX.Element {
  const [autoComplete, setAutoComplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const onLoad = (autoC: google.maps.places.Autocomplete) =>
    setAutoComplete(autoC);
  const [titleErrorMsg, setTitleErrorMsg] = useState("");
  const [descriptionErrorMsg, setDescriptionErrorMsg] = useState("");

  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const onPlaceChanged = () => {
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
        props.map.fitBounds(place.geometry.viewport);
      } else {
        props.map.setCenter(place.geometry.location);
        props.map.setZoom(17);
      }

      marker?.setMap(null);
      setMarker(
        new google.maps.Marker({
          position: place.geometry?.location,
          map: props.map,
        })
      );

      props.handleChange({
        target: {
          name: "mapLocation",
          value: place,
        },
      } as React.ChangeEvent<HTMLInputElement>);
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  const attemptContinue = () => {
    console.log("attempting to continue...", props.values);
    props.values.title.length === 0
      ? setTitleErrorMsg("Please enter a title")
      : setTitleErrorMsg("");
    props.values.description.length === 0
      ? setDescriptionErrorMsg("Please enter a description")
      : setDescriptionErrorMsg("");

    if (props.values.title.length > 0 && props.values.description.length > 0) {
      console.log("continuing...");
      props.handleNext();
    }
  };
  const locationRef = useRef<HTMLInputElement>();

  return (
    <Grid item container xs={12} direction="row">
      <Grid item xs={12} md={6}>
        <TextField
          placeholder="Enter the Title"
          name="title"
          onChange={props.handleChange}
          defaultValue={props.values.title}
          margin="normal"
          fullWidth
          error={titleErrorMsg.length > 0}
          helperText={titleErrorMsg}
        />
        <br />
        <TextField
          placeholder="Enter the Description"
          name="description"
          onChange={props.handleChange}
          defaultValue={props.values.description}
          margin="normal"
          fullWidth
          error={descriptionErrorMsg.length > 0}
          helperText={descriptionErrorMsg}
        />
        <br />
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <Input
            type="text"
            placeholder="Location"
            inputRef={locationRef}
            onChange={props.handleChange}
          />
        </Autocomplete>
        <br />
        <Button color="primary" variant="contained" onClick={attemptContinue}>
          Continue
        </Button>
      </Grid>
      <Grid item xs={12} md={6} pl={4}>
        <GoogleMap
          mapContainerStyle={{ width: "400px", height: "400px" }}
          center={props.center}
          zoom={3}
          onLoad={props.onLoad}
          onUnmount={props.onUnmount}
        ></GoogleMap>
      </Grid>
    </Grid>
  );
}

export function QueueSpotFormConfirm(props: {
  values: MapQueueSpotFormState;
  handleNext: () => void;
  handleBack: () => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element {
  const createSpot = useMutation("CreateSpot");

  const attemptContinue = async () => {
    try {
      const spotInfo = {
        _id: "",
        title: props.values.title,
        description: props.values.description,
        image: "",
        location: {
          lat: props.values.mapLocation.geometry.location.lat(),
          lng: props.values.mapLocation.geometry.location.lng(),
        },
        place_id: props.values.mapLocation.place_id,
        mapLocation: {
          formatted_address: props.values.mapLocation.formatted_address,
          formatted_phone_number:
            props.values.mapLocation.formatted_phone_number,
          geometry: {
            location: {
              lat: props.values.mapLocation.geometry.location.lat(),
              lng: props.values.mapLocation.geometry.location.lng(),
            },
          },
          place_id: props.values.mapLocation.place_id,
          types: props.values.mapLocation.types,
          rating: props.values.mapLocation.rating,
          user_ratings_total: props.values.mapLocation.user_ratings_total,
          price_level: props.values.mapLocation.price_level,
        },
        category: "",
        cost: 0,
        specialty: 0,
        quality: 0,
        numberOfRatings: 0,
        avgTimeSpent: 0,
        sponsored: false,
        featuredBy: [""],
        highlightedIn: [""],
        duration: 0,
        status: "pending",
        openTimes: [new Date().getTime()],
      } as SpotInfoProps;
      const createSpotResponse = await createSpot.commit(spotInfo);
      console.log(createSpotResponse);
      props.handleNext();
    } catch (err) {
      console.log("Sorry, but we were not able to submit this spot.");
      console.log(err);
    }
  };

  return (
    <Box>
      <List>
        <ListItem>
          <ListItemText primary="Title" secondary={props.values.title} />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Description"
            secondary={props.values.description}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Address"
            secondary={props.values.mapLocation.formatted_address}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Location"
            secondary={
              props.values.mapLocation.geometry.location.lat() +
              " " +
              props.values.mapLocation.geometry.location.lng()
            }
          />
        </ListItem>
        {props.values.mapLocation.rating ? (
          <ListItem>
            <ListItemText
              primary="Rating"
              secondary={
                props.values.mapLocation.rating +
                " " +
                props.values.mapLocation.user_ratings_total
              }
            />
          </ListItem>
        ) : null}
      </List>
      <br />
      <Button color="primary" variant="contained" onClick={props.handleBack}>
        Back
      </Button>
      <br />
      <Button color="primary" variant="contained" onClick={attemptContinue}>
        Confirm
      </Button>
    </Box>
  );
}

export function QueueSpotFormSuccess(props: {
  values: MapQueueSpotFormState;
  handleNext: () => void;
  handleBack: () => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element {
  return (
    <Box>
      <Typography variant="h5">
        Success! Thank you for your submission. We'll be reviewing it shortly.
      </Typography>
      <br />
      <Button>
        <Link to="/">Return Home</Link>
      </Button>
    </Box>
  );
}

export function MapQueueSpotForm(): JSX.Element {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_MAPS_KEY!,
    libraries: ["places"],
  });

  const [queueSpotState, setQueueSpotState] = useState<MapQueueSpotFormState>({
    title: "",
    description: "",
    mapLocation: {
      formatted_address: "",
      formatted_phone_number: "",
      geometry: {
        location: {
          lat: () => 0,
          lng: () => 0,
        },
      },
      place_id: "",
      types: [],
      rating: 0,
      user_ratings_total: 0,
      price_level: 0,
    },
  });
  const [step, setStep] = useState(0);
  const [map, setMap] = useState<google.maps.Map>();
  const [center, setCenter] = useState({ lat: 48.8584, lng: 2.2945 });

  const handleNext = () => {
    console.log("advancing", step);
    setStep(step + 1);
    console.log("advanced", step);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handling change", event);
    setQueueSpotState({
      ...queueSpotState,
      [event.target.name]: event.target.value,
    });
  };

  const onLoad = React.useCallback(async function callback(
    map: google.maps.Map
  ) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  },
  []);

  const onUnmount = React.useCallback(function callback(map: google.maps.Map) {
    setMap(undefined);
  }, []);

  const returnForm = () => {
    switch (step) {
      case 0:
        return (
          <QueueSpotFormDetailsSection
            values={queueSpotState}
            handleNext={handleNext}
            handleBack={handleBack}
            handleChange={handleChange}
            map={map as google.maps.Map}
            center={center}
            onLoad={onLoad}
            onUnmount={onUnmount}
          />
        );
      case 1:
        return (
          <QueueSpotFormConfirm
            values={queueSpotState}
            handleNext={handleNext}
            handleBack={handleBack}
            handleChange={handleChange}
          />
        );
      case 2:
        return (
          <QueueSpotFormSuccess
            values={queueSpotState}
            handleNext={handleNext}
            handleBack={handleBack}
            handleChange={handleChange}
          />
        );
      default:
        return <></>;
    }
  };

  return isLoaded ? <>{returnForm()}</> : <></>;
}

export type MapQueueSpotFormState = {
  title: string;
  description: string;
  mapLocation: {
    formatted_address: string;
    formatted_phone_number: string;
    geometry: {
      location: {
        lat: () => number;
        lng: () => number;
      };
    };
    place_id: string;
    types: string[];
    rating: number;
    user_ratings_total: number;
    price_level: number;
  };
};
