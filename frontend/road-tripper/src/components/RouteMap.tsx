import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import React, { useRef, useState, createRef, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
} from "@mui/material";
import { useMutation } from "../core/api";
import { NearMe, Delete, Add } from "@mui/icons-material";
import { SpotInfoProps } from "./SpotInfo";

// const center = { lat: 48.8584, lng: 2.2945 };

export function RouteMap(): JSX.Element {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_MAPS_KEY!,
    libraries: ["places"],
  });

  const [map, setMap] = useState<google.maps.Map>();
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult>();
  const [center, setCenter] = useState({ lat: 38.8584, lng: -112.2945 });
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [chosenDetours, setChosenDetours] = useState<SpotInfoProps[]>([]);
  const [wayPointElements, setWayPointElements] = useState<JSX.Element[]>([]);

  const originRef = useRef<HTMLInputElement>();
  const destinationRef = useRef<HTMLInputElement>();
  const nameRef = useRef<HTMLInputElement>();

  const getSpots = useMutation("GetSpots");
  const createTrip = useMutation("CreateTrip");

  function success(position: GeolocationPosition) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    setCenter({ lat: latitude, lng: longitude });
    map?.panTo(center);
    map?.setZoom(4);
    console.log(center, "center");
  }

  function error() {
    console.log("Unable to retrieve your location");
  }

  async function calculateRoute() {
    console.log(
      "calculateRoute",
      originRef.current,
      destinationRef.current,
      originRef.current?.value,
      destinationRef.current?.value
    );
    if (originRef.current && destinationRef.current) {
      // eslint-disable-next-line no-undef
      const directionsService = new google.maps.DirectionsService();
      const wayPoints = chosenDetours.map((spot) => {
        return {
          location: {
            lat: spot.location.lat,
            lng: spot.location.lng,
          },
          stopover: true,
        };
      });
      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        waypoints: wayPoints,
        optimizeWaypoints: true,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
      });
      setDirectionsResponse(results);
      setDistance(results.routes[0].legs[0].distance?.text || "");
      setDuration(results.routes[0].legs[0].duration?.text || "");
      return;
    }
  }

  function clearRoute() {
    setDirectionsResponse(undefined);
    setDistance("");
    setDuration("");
    if (originRef.current && destinationRef.current) {
      originRef.current.value = "";
      destinationRef.current.value = "";
    }
  }

  function addSpotToRoute(spot: SpotInfoProps) {
    console.log("addSpotToRoute");
    setChosenDetours([...chosenDetours, spot]);
  }

  function removeSpotFromRoute(index: number) {
    console.log("removeSpotFromRoute", index);
    const newDetours = chosenDetours.filter((detour, i) => i !== index);
    setChosenDetours(newDetours);
  }

  // useEffect(() => {
  //   console.log("useEffect");
  //   if (!navigator.geolocation) {
  //     console.log("Geolocation is not supported by your browser");
  //   } else {
  //     console.log("Locating…");
  //     navigator.geolocation.getCurrentPosition(success, error);
  //   }
  //   if (map) {
  //     // console.log("fitting bounds");
  //     // const bounds = new window.google.maps.LatLngBounds(center);
  //     // map.fitBounds(bounds);
  //   }
  // }, []);

  const onLoad = React.useCallback(async function callback(
    map: google.maps.Map
  ) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    }

    setMap(map);

    const spotResults = await getSpots.commit({});
    console.log(spotResults);
    console.log(map);
    if (map) {
      const markers = spotResults.map((spotResult: SpotInfoProps) => {
        const infoWindow = new google.maps.InfoWindow({
          content: `<div>
              <h2>${spotResult.title}</h2>
              <p>${spotResult.description}</p>
              <p>${spotResult.category}</p>
              <p>Quality: ${spotResult.quality}</p>
              <p>Specialty: ${spotResult.specialty}</p>
              <p>${spotResult.location.lat} ${spotResult.location.lng}</p>
            </div>`,
        });

        const marker = new google.maps.Marker({
          position: {
            lat: spotResult.location.lat,
            lng: spotResult.location.lng,
          },
          map: map,
        });

        const waypointRef = createRef<HTMLDivElement>();

        setWayPointElements([
          ...wayPointElements,
          <ListItem
            secondaryAction={
              <IconButton edge="end" onClick={() => addSpotToRoute(spotResult)}>
                <Add />
              </IconButton>
            }
          >
            <ListItemText
              ref={waypointRef}
              primary={spotResult.title}
              secondary={spotResult.description}
            />
          </ListItem>,
        ]);

        marker.addListener("click", () => {
          infoWindow.open({ anchor: marker, map });
          scrollToMarkerElement(waypointRef);
        });

        return marker;
      });

      console.log(markers);
      new MarkerClusterer({ map, markers });
    }
  },
  []);

  function scrollToMarkerElement(markerRef: React.RefObject<HTMLDivElement>) {
    if (markerRef.current) {
      markerRef.current.scrollIntoView();
    }
  }

  const onUnmount = React.useCallback(function callback(map: google.maps.Map) {
    setMap(undefined);
  }, []);

  // const spotResults = [
  //   { location: { latitude: 48, longitude: 50 } },
  //   { location: { latitude: 51, longitude: 40 } },
  //   { location: { latitude: 50.5, longitude: 50.5 } },
  //   { location: { latitude: 49, longitude: 49 } },
  // ];
  // console.log(spotResults);
  // const markers = spotResults.map((spot) => {
  //   return new google.maps.Marker({
  //     position: {
  //       lat: spot.location.latitude,
  //       lng: spot.location.longitude,
  //     },
  //     map: map,
  //   });
  // });
  // console.log(markers);

  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "400px" }}
        center={center}
        zoom={4}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>
      <Box>
        <Box>
          <Box>
            <Autocomplete>
              <Input type="text" placeholder="Origin" inputRef={originRef} />
            </Autocomplete>
          </Box>
          <Box>
            <Autocomplete>
              <Input
                type="text"
                placeholder="Destination"
                inputRef={destinationRef}
              />
            </Autocomplete>
          </Box>
          <Box>
            <Typography>Browse Stops</Typography>
            <List
              dense
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            >
              {wayPointElements}
            </List>
          </Box>
          <Box>
            <Typography>Waypoints</Typography>
            <List
              dense
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            >
              {chosenDetours.map((detour, index) => {
                return (
                  <ListItem
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="comments"
                        onClick={() => removeSpotFromRoute(index)}
                      >
                        <Delete />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={detour.title}></ListItemText>
                    <ListItemText primary={detour.description}></ListItemText>
                  </ListItem>
                );
              })}
            </List>
          </Box>

          <Button type="submit" onClick={calculateRoute}>
            Calculate Route
          </Button>

          <IconButton aria-label="center back" onClick={clearRoute}>
            <Delete />
          </IconButton>
        </Box>
        <Box>
          <Typography>Distance: {distance} </Typography>
          <Typography>Duration: {duration} </Typography>
          <IconButton
            aria-label="center back"
            onClick={() => {
              map?.panTo(center);
              map?.setZoom(4);
            }}
          >
            <NearMe />
          </IconButton>
          <Input type="text" placeholder="Name" inputRef={nameRef} />
          <Button
            onClick={() => {
              createTrip.commit({
                name: nameRef.current?.value || "Unnamed Trip",
                description: "",
                creatorId: "1",
                origin: originRef.current?.value || "",
                destination: destinationRef.current?.value || "",
                waypoints: chosenDetours.map((spot) => {
                  return {
                    location: {
                      lat: spot.location.lat,
                      lng: spot.location.lng,
                    },
                    stopover: true,
                  };
                }),
                startDate: Date.now(),
                endDate: Date.now(),
                isPublic: false,
                isComplete: false,
                isArchived: false,
                createdAt: Date.now(),
                updatedAt: Date.now(),
              });
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </>
  ) : (
    <></>
  );
}
