import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import React, { useRef, useState, createRef } from "react";
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

const center = { lat: 48.8584, lng: 2.2945 };

export function RouteMap(): JSX.Element {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_MAPS_KEY!,
    libraries: ["places"],
  });

  const [map, setMap] = useState<google.maps.Map>();
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult>();
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [chosenDetours, setChosenDetours] = useState<SpotInfoProps[]>([]);
  const [wayPointElements, setWayPointElements] = useState<JSX.Element[]>([]);

  const originRef = useRef<HTMLInputElement>();
  const destinationRef = useRef<HTMLInputElement>();

  const getSpots = useMutation("GetSpots");

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
            lat: spot.location.latitude,
            lng: spot.location.longitude,
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

  const onLoad = React.useCallback(async function callback(
    map: google.maps.Map
  ) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

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
              <p>${spotResult.category}</p>
              <p>${spotResult.location.latitude} ${spotResult.location.longitude}</p>
            </div>`,
        });

        const marker = new google.maps.Marker({
          position: {
            lat: spotResult.location.latitude,
            lng: spotResult.location.longitude,
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
        mapContainerStyle={{ width: "400px", height: "400px" }}
        center={center}
        zoom={4}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <Marker position={center} />

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
              map?.setZoom(15);
            }}
          >
            <NearMe />
          </IconButton>
        </Box>
      </Box>
    </>
  ) : (
    <></>
  );
}

// export function RouteMap(): JSX.Element {
//   // const [clicks, setClicks] = React.useState<google.maps.LatLng[]>([]);
//   const [zoom, setZoom] = useState(3); // initial zoom
//   const [center, setCenter] = useState<google.maps.LatLngLiteral>({
//     lat: 50,
//     lng: 50,
//   });
//   const [map, setMap] = useState<google.maps.Map>();
//   const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
//   const [directionsResponse, setDirectionsResponse] =
//     useState<google.maps.DirectionsResult>();
//   const [originAutocomplete, setOriginAutocomplete] =
//     useState<google.maps.places.Autocomplete>();
//   const [destinationAutocomplete, setDestinationAutocomplete] =
//     useState<google.maps.places.Autocomplete>();
//   const [originPlaceId, setOriginPlaceId] = useState("");
//   const [destinationPlaceId, setDestinationPlaceId] = useState("");
//   const [distance, setDistance] = useState("");
//   const [duration, setDuration] = useState("");
//   const [wayPoints, setWayPoints] = useState<google.maps.DirectionsWaypoint[]>(
//     []
//   );
//   const [travelMode, setTravelMode] = useState<google.maps.TravelMode>();
//   const [directionsService, setDirectionsService] =
//     useState<google.maps.DirectionsService>();
//   const [directionsRenderer, setDirectionsRenderer] =
//     useState<google.maps.DirectionsRenderer>();

//   const ref = useRef<HTMLElement>(null);
//   const originRef = useRef<HTMLInputElement>(null);
//   const destinationRef = useRef<HTMLInputElement>(null);

//   const options = {
//     fields: ["formatted_address", "geometry", "name"],
//     strictBounds: false,
//     types: ["place_id"],
//   };

//   // const getSpots = useMutation("GetSpots");
//   // const spotResults = getSpots.commit({});
//   // console.log(spotResults);

//   useEffect(() => {
//     console.log("in here 1");

//     if (map) {
//       ["idle", "click"].forEach((eventName) =>
//         google.maps.event.clearListeners(map, eventName)
//       );

//       if (onIdle) {
//         map.addListener("idle", () => onIdle(map));
//       }
//     }

//   }, [map, ref]);

//   const onIdle = async (m: google.maps.Map) => {
//     console.log("onIdle", m);
//     console.log(m.getBounds()!.toJSON());

//     // const getSpots = useMutation("GetSpotsInBox");
//     // const spotResults = await getSpots.commit({
//     //   latitude1: m.getBounds()!.toJSON().south,
//     //   longitude1: m.getBounds()!.toJSON().west,
//     //   latitude2: m.getBounds()!.toJSON().north,
//     //   longitude2: m.getBounds()!.toJSON().east,
//     // });
//     console.log(spotResults);
//     setMarkers(
//       markers.concat(
//         spotResults.map((spot) => {
//           return new google.maps.Marker({
//             position: {
//               lat: spot.location.latitude,
//               lng: spot.location.longitude,
//             },
//             map: m,
//           });
//         })
//       )
//     );
//     console.log(markers);
//   };

//   const setupPlaceChangedListener = (
//     autocomplete: google.maps.places.Autocomplete,
//     mode: string
//   ) => {
//     console.log("setting up place changed listener");
//     if (map) {
//       autocomplete.bindTo("bounds", map);
//     }

//     console.log("autocomplete: ", autocomplete);

//     autocomplete.addListener("place_changed", () => {
//       console.log("place changed");
//       const place = autocomplete.getPlace();

//       console.log("place: ", place);

//       if (!place.place_id) {
//         window.alert("Please select an option from the dropdown list.");
//         return;
//       }

//       if (mode === "ORIG") {
//         setOriginPlaceId(place.place_id);
//       } else {
//         setDestinationPlaceId(place.place_id);
//       }

//       route();
//     });
//   };

//   const route = () => {
//     console.log("routing");

//     if (!originPlaceId || !destinationPlaceId) {
//       return;
//     }

//     directionsService?.route(
//       {
//         origin: { placeId: originPlaceId },
//         destination: { placeId: destinationPlaceId },
//         travelMode: travelMode || google.maps.TravelMode.DRIVING,
//       },
//       (response, status) => {
//         if (status === "OK") {
//           directionsRenderer?.setDirections(response);
//         } else {
//           window.alert("Directions request failed due to " + status);
//         }
//       }
//     );
//   };

//   // const children = (
//   //   <>
//   //     <Marker key={"sampleMarker"} position={center} map={map} />
//   //     <Marker
//   //       key={"offcenterSampleMarker"}
//   //       position={{
//   //         lat: center.lat + 0.1,
//   //         lng: center.lng + 0.1,
//   //       }}
//   //       map={map}
//   //     />
//   //   </>
//   // );
