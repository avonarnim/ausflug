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
  Grid,
  Input,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  ListItemButton,
  Paper,
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
  const [routeCreated, setRouteCreated] = useState(false);
  const [startAutocomplete, setStartAutocomplete] =
    useState<google.maps.places.Autocomplete>();
  const [destinationAutocomplete, setDestinationAutocomplete] =
    useState<google.maps.places.Autocomplete>();
  const [savedSpots, setSavedSpots] = useState<SpotInfoProps[]>([]);
  const [originPlace, setOriginPlace] =
    useState<google.maps.places.PlaceResult>();
  const [destinationPlace, setDestinationPlace] =
    useState<google.maps.places.PlaceResult>();

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
      setRouteCreated(true);
      return;
    }
  }

  function clearRoute() {
    setDirectionsResponse(undefined);
    setDistance("");
    setDuration("");
    setRouteCreated(false);
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

  function generateRandomRoute() {
    console.log("generateRandomRoute");

    if (
      originPlace &&
      originPlace.geometry &&
      originPlace.geometry.location &&
      destinationPlace &&
      destinationPlace.geometry &&
      destinationPlace.geometry.location
    ) {
      const lat1 = originPlace.geometry.location.lat();
      const lng1 = originPlace.geometry.location.lng();
      const lat2 = destinationPlace.geometry.location.lat();
      const lng2 = destinationPlace.geometry.location.lng();

      const inRange = savedSpots.filter((spot) => {
        const insideLat =
          (spot.location.lat > lat1 && spot.location.lat < lat2) ||
          (spot.location.lat < lat1 && spot.location.lat > lat2);
        const insideLng =
          (spot.location.lng > lng1 && spot.location.lng < lng2) ||
          (spot.location.lng < lng1 && spot.location.lng > lng2);
        return insideLat && insideLng;
      });

      const idealNumberOfSpots = 10;
      const necessaryProbability = idealNumberOfSpots / inRange.length;

      const randomChoice = inRange
        .filter((spot) => {
          return Math.random() > necessaryProbability;
        })
        .slice(0, idealNumberOfSpots);

      setChosenDetours(randomChoice);
    }
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
    const options = {
      restriction: {
        latLngBounds: {
          north: 85,
          south: -85,
          west: -179,
          east: 179,
        },
        strictBounds: true,
      },
    };
    map.setOptions(options);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    }

    setMap(map);

    const spotResults = await getSpots.commit({});
    setSavedSpots(spotResults);
    console.log("spot results", spotResults);
    console.log("map", map);

    const wayPointsWithRefs = spotResults.map((spotResult: SpotInfoProps) => {
      const waypointRef = createRef<HTMLDivElement>();

      const element = (
        <ListItem
          key={
            spotResult.title +
            spotResult.id +
            spotResult.location.lat +
            spotResult.location.lng
          }
          secondaryAction={
            <IconButton edge="end" onClick={() => addSpotToRoute(spotResult)}>
              <Add />
            </IconButton>
          }
        >
          <ListItemButton
            onClick={() => {
              map.setCenter(spotResult.location);
              map.setZoom(10);
            }}
          >
            <ListItemText
              ref={waypointRef}
              primary={spotResult.title}
              secondary={spotResult.description}
            ></ListItemText>
          </ListItemButton>
        </ListItem>
      );
      return {
        spot: { spotResult, waypointRef },
        element,
      };
    });

    const elements = wayPointsWithRefs.map((wayPoint) => wayPoint.element);
    const spotsWithRefs = wayPointsWithRefs.map((wayPoint) => wayPoint.spot);

    setWayPointElements(elements);

    if (map) {
      const markers = spotsWithRefs.map((spot) => {
        const infoWindow = new google.maps.InfoWindow({
          content: `<div>
              <h2>${spot.spotResult.title}</h2>
              <p>${spot.spotResult.description}</p>
              <p>${spot.spotResult.category}</p>
              <p>Quality: ${spot.spotResult.quality}</p>
              <p>Specialty: ${spot.spotResult.specialty}</p>
              <p>${spot.spotResult.location.lat} ${spot.spotResult.location.lng}</p>
            </div>`,
        });

        const marker = new google.maps.Marker({
          position: {
            lat: spot.spotResult.location.lat,
            lng: spot.spotResult.location.lng,
          },
          map: map,
        });

        marker.addListener("click", () => {
          infoWindow.open({ anchor: marker, map });
          scrollToMarkerElement(spot.waypointRef);
        });

        return marker;
      });

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

  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "800px" }}
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
          <Grid item container direction="row" alignItems="center">
            <Grid item xs={6} sx={{ p: 4 }}>
              <Autocomplete
                fields={["formatted_address", "name", "geometry", "place_id"]}
                onLoad={(autocomplete) => setStartAutocomplete(autocomplete)}
                onPlaceChanged={() => {
                  const place = startAutocomplete?.getPlace();
                  if (!place || !place.geometry || !place.geometry.location) {
                    return;
                  } else {
                    setOriginPlace(place);
                    map?.setCenter(place.geometry.location);
                    map?.setZoom(10);
                  }
                }}
              >
                <Input
                  type="text"
                  placeholder="Origin"
                  inputRef={originRef}
                  fullWidth
                />
              </Autocomplete>
            </Grid>
            <Grid item xs={6} sx={{ p: 4 }}>
              <Autocomplete
                fields={["formatted_address", "name", "geometry", "place_id"]}
                onLoad={(autocomplete) =>
                  setDestinationAutocomplete(autocomplete)
                }
                onPlaceChanged={() => {
                  const place = destinationAutocomplete?.getPlace();
                  if (!place || !place.geometry || !place.geometry.location) {
                    return;
                  } else {
                    setDestinationPlace(place);
                    map?.setCenter(place.geometry.location);
                    map?.setZoom(10);
                  }
                }}
              >
                <Input
                  type="text"
                  placeholder="Destination"
                  inputRef={destinationRef}
                  fullWidth
                />
              </Autocomplete>
            </Grid>
            <br />
            <br />
            <br />
            <Grid item container direction="column" xs={6} sx={{ p: 4 }}>
              <Grid item>
                <Typography>Browse Stops</Typography>
              </Grid>
              <Grid item>
                <Paper style={{ height: 300, overflow: "auto", maxWidth: 360 }}>
                  <List dense sx={{ width: "100%" }}>
                    {wayPointElements.length === 0 ? (
                      <ListItem>Loading...</ListItem>
                    ) : (
                      wayPointElements
                    )}
                  </List>
                </Paper>
              </Grid>
            </Grid>
            <Grid item container direction="column" xs={6} sx={{ p: 4 }}>
              <Grid item>
                <Typography>Selected Detours</Typography>
              </Grid>
              <Grid item>
                <Paper style={{ height: 300, overflow: "auto", maxWidth: 360 }}>
                  {chosenDetours.length === 0 &&
                  originRef.current?.value === "" &&
                  destinationRef.current?.value === "" ? (
                    <Box sx={{ p: 2 }}>
                      <Typography>No detours selected</Typography>
                      <Typography>
                        Enter an origin and destination to get recommendations
                      </Typography>
                    </Box>
                  ) : chosenDetours.length === 0 ? (
                    <Box sx={{ p: 2 }}>
                      <Typography>No detours selected</Typography>
                      <Button onClick={generateRandomRoute}>
                        Choose for me
                      </Button>
                    </Box>
                  ) : (
                    <List
                      dense
                      sx={{
                        width: "100%",
                      }}
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
                            <ListItemButton
                              onClick={() => {
                                map?.setCenter(detour.location);
                                map?.setZoom(10);
                              }}
                            >
                              <ListItemText
                                primary={detour.title}
                                secondary={detour.description}
                              ></ListItemText>
                            </ListItemButton>
                          </ListItem>
                        );
                      })}
                    </List>
                  )}
                </Paper>
              </Grid>
            </Grid>

            <Grid container spacing={0} justifyContent="flex-begin">
              <Grid item xs={3} sx={{ p: 4 }}>
                <Button
                  type="submit"
                  onClick={calculateRoute}
                  variant="contained"
                >
                  Calculate Route
                </Button>
              </Grid>
            </Grid>

            {routeCreated ? (
              <>
                <Grid item xs={6} sx={{ pl: 4, pr: 4 }}>
                  <Typography>Distance: {distance} </Typography>
                </Grid>
                <Grid item xs={6} sx={{ pl: 4, pr: 4 }}>
                  <Typography>Duration: {duration} </Typography>
                </Grid>
              </>
            ) : (
              <></>
            )}

            {/* <Grid item xs={6} sx={{ pl: 4, pr: 4 }}>
              <IconButton
                aria-label="center back"
                onClick={() => {
                  map?.panTo(center);
                  map?.setZoom(4);
                }}
              >
                <NearMe />
              </IconButton>
            </Grid> */}
            <Grid item xs={6} sx={{ pl: 4, pr: 4 }}>
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

              <IconButton aria-label="delete route" onClick={clearRoute}>
                <Delete />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  ) : (
    <></>
  );
}
