import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useParams } from "react-router-dom";
import React, { useRef, useState, createRef, useEffect } from "react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import {
  Box,
  Button,
  Grid,
  Input,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import { useMutation } from "../core/api";
import { NearMe, Delete, Add } from "@mui/icons-material";
import { SpotInfoProps } from "../components/SpotInfo";
import { Link } from "react-router-dom";

type Libraries = (
  | "drawing"
  | "geometry"
  | "localContext"
  | "places"
  | "visualization"
)[];
const libraries: Libraries = ["places"];

export default function EditTrip(): JSX.Element {
  const params = useParams();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_MAPS_KEY!,
    libraries: libraries,
  });

  const [map, setMap] = useState<google.maps.Map>();
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult>();
  const [center, setCenter] = useState({ lat: 38.8584, lng: -112.2945 });
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [chosenDetours, setChosenDetours] = useState<SpotInfoProps[]>([]);
  const [tempChosenDetour, setTempChosenDetour] = useState<SpotInfoProps>();
  const [wayPointElements, setWayPointElements] = useState<JSX.Element[]>([]);
  const [routeCreated, setRouteCreated] = useState(false);
  const [tripResult, setTripResult] = useState<TripProps>();
  const [savedSpots, setSavedSpots] = useState<SpotInfoProps[]>([]);
  const [startAutocomplete, setStartAutocomplete] =
    useState<google.maps.places.Autocomplete>();
  const [destinationAutocomplete, setDestinationAutocomplete] =
    useState<google.maps.places.Autocomplete>();
  const [originPlace, setOriginPlace] =
    useState<google.maps.places.PlaceResult>();
  const [destinationPlace, setDestinationPlace] =
    useState<google.maps.places.PlaceResult>();

  const originRef = useRef<HTMLInputElement>();
  const destinationRef = useRef<HTMLInputElement>();

  const getSpotsInBox = useMutation("GetSpotsInBox");
  const getTrip = useMutation("GetTrip");
  const getSpot = useMutation("GetSpot");

  // called when the user clicks on "Calculate Route"
  async function calculateRoute(
    originValue:
      | string
      | google.maps.LatLng
      | google.maps.Place
      | google.maps.LatLngLiteral,
    destinationValue:
      | string
      | google.maps.LatLng
      | google.maps.Place
      | google.maps.LatLngLiteral
  ) {
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
      origin: originValue,
      destination: destinationValue,
      waypoints: wayPoints,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);

    const cumulativeDistance = results.routes[0].legs.reduce(
      (acc, cur) => acc + (cur.distance?.value ?? 0),
      0
    );
    const cumulativeDuration = results.routes[0].legs.reduce(
      (acc, cur) => acc + (cur.duration?.value ?? 0),
      0
    );
    setDistance(
      `${Math.floor((10 * cumulativeDistance) / 1609.34) / 10} miles`
    );
    setDuration(
      `${Math.floor(cumulativeDuration / 3600)} hours, ${Math.floor(
        (cumulativeDuration - 3600 * Math.floor(cumulativeDuration / 3600)) / 60
      )} mins`
    );
    setRouteCreated(true);
    return;
  }

  // called once originPlace and destinationPlace lat/lng data is available
  // pulls spots from within reasonable range and renders
  async function loadSpots() {
    const spotResults = await getSpotsInBox.commit({
      longitude1: originPlace!.geometry!.location!.lng(),
      latitude1: originPlace!.geometry!.location!.lat(),
      longitude2: destinationPlace!.geometry!.location!.lng(),
      latitude2: destinationPlace!.geometry!.location!.lat(),
    });

    setSavedSpots(spotResults);

    const wayPointsWithRefs = spotResults.map((spotResult: SpotInfoProps) => {
      const waypointRef = createRef<HTMLDivElement>();

      const element = (
        <ListItem
          key={
            spotResult.title +
            spotResult._id +
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
              map!.setCenter(spotResult.location);
              map!.setZoom(10);
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
          // scrollToMarkerElement(spot.waypointRef);
        });

        return marker;
      });

      new MarkerClusterer({ map, markers });
    }
  }

  useEffect(() => {
    if (map && tripResult?.originPlaceId && tripResult?.destinationPlaceId) {
      const placesDetailsService = new google.maps.places.PlacesService(map);
      placesDetailsService.getDetails(
        { placeId: tripResult?.originPlaceId, fields: ["geometry"] },
        (place, status) => {
          if (place) {
            setOriginPlace(place);
          } else {
            console.log(status);
          }
        }
      );
      placesDetailsService.getDetails(
        { placeId: tripResult?.destinationPlaceId, fields: ["geometry"] },
        (place, status) => {
          if (place) {
            setDestinationPlace(place);
          } else {
            console.log(status);
          }
        }
      );

      retrieveSpotsAndCalculateRoute();
    }
  }, [tripResult]);

  const retrieveSpotsAndCalculateRoute = async () => {
    // need to set chosen waypoints to the trip's waypoints
    for (const waypoint of tripResult!.waypoints) {
      const spot = await getSpot.commit({ spotId: waypoint._id });
      setChosenDetours((prev) => [...prev, spot]);
    }

    calculateRoute(
      { placeId: tripResult?.originPlaceId },
      { placeId: tripResult?.destinationPlaceId }
    );
  };

  // Called once the map is loaded
  useEffect(() => {
    if (
      map &&
      originPlace &&
      destinationPlace &&
      originPlace.geometry &&
      destinationPlace.geometry &&
      originPlace.geometry.location &&
      destinationPlace.geometry.location
    ) {
      const bounds = new window.google.maps.LatLngBounds(
        originPlace?.geometry?.location,
        destinationPlace?.geometry?.location
      );
      map.fitBounds(bounds);
      loadSpots();
    }
  }, [originPlace, destinationPlace]);

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
    setChosenDetours([...chosenDetours, spot]);
  }

  function removeSpotFromRoute(index: number) {
    const newDetours = chosenDetours.filter((detour, i) => i !== index);
    setChosenDetours(newDetours);
  }

  // finds ~10 random spots within the bounding box of the route
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

  const onLoad = React.useCallback(async function callback(
    map: google.maps.Map
  ) {
    setMap(map);

    if (!params.tripId) {
      console.log("no trip id");
    } else {
      console.log("getting trip");
      setTripResult(await getTrip.commit({ tripId: params.tripId }));
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
                  placeholder={tripResult?.originVal || "Origin"}
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
                  placeholder={tripResult?.destinationVal || "Destination"}
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
                            key={detour._id}
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
                  onClick={() => {
                    if (
                      originRef.current?.value &&
                      destinationRef.current?.value
                    ) {
                      calculateRoute(
                        originRef.current?.value,
                        destinationRef.current?.value
                      );
                    } else {
                      alert("Please enter an origin and destination");
                    }
                  }}
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
            {/* <Grid item xs={6} sx={{ pl: 4, pr: 4 }}>
              {currentUser ? (
                <>
                  <Input type="text" placeholder="Name" inputRef={nameRef} />
                  <Button
                    onClick={() => {
                      createTrip.commit({
                        name: nameRef.current?.value || "Unnamed Trip",
                        description: "",
                        creatorId: currentUser.uid,
                        originPlaceId: originPlace?.place_id || "",
                        originVal: originRef.current?.value || "",
                        destinationPlaceId: destinationPlace?.place_id || "",
                        destinationVal: destinationRef.current?.value || "",
                        waypoints: chosenDetours.map((spot) => {
                          return {
                            _id: spot._id,
                            place_id: spot.place_id,
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
                </>
              ) : (
                <Link to={`/login`} style={{ textDecoration: "none" }}>
                  <Button>Log in to save your trip</Button>
                </Link>
              )}

              <IconButton aria-label="delete route" onClick={clearRoute}>
                <Delete />
              </IconButton>
            </Grid> */}
          </Grid>
        </Box>
      </Box>
    </>
  ) : (
    <></>
  );
}

export type TripProps = {
  _id: string;
  name: string;
  description: string;
  creatorId: string;
  originPlaceId: string;
  originVal: string;
  destinationPlaceId: string;
  destinationVal: string;
  waypoints: {
    _id: string;
    place_id: string;
    location: { lat: number; lng: number };
    stopover: boolean;
  }[];
  startDate: number;
  endDate: number;
  isPublic: boolean;
  isComplete: boolean;
  isArchived: boolean;
  createdAt: number;
  updatedAt: number;
};
