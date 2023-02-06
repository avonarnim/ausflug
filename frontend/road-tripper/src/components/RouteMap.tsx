import { Wrapper, Status } from "@googlemaps/react-wrapper";
import React, { useEffect, useRef, useState, ReactElement } from "react";
import { Box, Button, Typography, TextField, IconButton } from "@mui/material";
import { useMutation } from "../core/api";
import { NearMe, Delete } from "@mui/icons-material";

const Marker: React.FC<google.maps.MarkerOptions> = (options) => {
  const [marker, setMarker] = React.useState<google.maps.Marker>();

  React.useEffect(() => {
    console.log("making marker", options);
    if (!marker) {
      console.log("setting marker");
      setMarker(new google.maps.Marker({ ...options }));
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(options.map ? options.map : null);
      }
    };
  }, [marker]);

  React.useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  return null;
};

// type MapProps = {
//   mapRef: React.RefObject<HTMLElement>;
//   style: { [key: string]: string };
//   onClick?: (e: google.maps.MapMouseEvent) => void;
//   onIdle?: (map: google.maps.Map) => void;
//   children?: React.ReactNode;
//   center: google.maps.LatLngLiteral;
//   zoom: number;
// };

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return <div>Loading...</div>;
    case Status.FAILURE:
      return <div>Failed to load Google Maps</div>;
    case Status.SUCCESS:
      return <div>Google Maps loaded</div>;
  }
};

export function RouteMap(): JSX.Element {
  // const [clicks, setClicks] = React.useState<google.maps.LatLng[]>([]);
  const [zoom, setZoom] = useState(3); // initial zoom
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: 50,
    lng: 50,
  });
  const [map, setMap] = useState<google.maps.Map>();
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult>();
  const [originAutocomplete, setOriginAutocomplete] =
    useState<google.maps.places.Autocomplete>();
  const [destinationAutocomplete, setDestinationAutocomplete] =
    useState<google.maps.places.Autocomplete>();
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [wayPoints, setWayPoints] = useState<google.maps.DirectionsWaypoint[]>(
    []
  );

  const ref = useRef<HTMLElement>(null);
  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);

  // const getSpots = useMutation("GetSpots");
  // const spotResults = getSpots.commit({});
  // console.log(spotResults);

  useEffect(() => {
    console.log("in here 1");

    if (map) {
      ["idle", "click"].forEach((eventName) =>
        google.maps.event.clearListeners(map, eventName)
      );

      if (onIdle) {
        map.addListener("idle", () => onIdle(map));
      }

      map.addListener("click", (mapsMouseEvent: google.maps.MapMouseEvent) => {
        console.log(mapsMouseEvent.latLng?.toJSON());
      });
    }

    if (ref.current && !map) {
      console.log("in here 2");
      setMap(
        new window.google.maps.Map(ref.current, {
          center: center,
          zoom: zoom,
        })
      );
      setOriginAutocomplete(
        new google.maps.places.Autocomplete(originRef.current!, {
          fields: ["formatted_address", "geometry", "name"],
          types: ["establishment"],
          strictBounds: false,
        })
      );
      setDestinationAutocomplete(
        new google.maps.places.Autocomplete(destinationRef.current!, {
          fields: ["formatted_address", "geometry", "name"],
          types: ["establishment"],
          strictBounds: false,
        })
      );
    }
  }, [map, ref]);

  const onIdle = async (m: google.maps.Map) => {
    console.log("onIdle", m);
    console.log(m.getBounds()!.toJSON());

    // const getSpots = useMutation("GetSpotsInBox");
    // const spotResults = await getSpots.commit({
    //   latitude1: m.getBounds()!.toJSON().south,
    //   longitude1: m.getBounds()!.toJSON().west,
    //   latitude2: m.getBounds()!.toJSON().north,
    //   longitude2: m.getBounds()!.toJSON().east,
    // });
    const spotResults = [
      { location: { latitude: 48, longitude: 50 } },
      { location: { latitude: 51, longitude: 40 } },
      { location: { latitude: 50.5, longitude: 50.5 } },
      { location: { latitude: 49, longitude: 49 } },
    ];
    console.log(spotResults);
    setMarkers(
      markers.concat(
        spotResults.map((spot) => {
          return new google.maps.Marker({
            position: {
              lat: spot.location.latitude,
              lng: spot.location.longitude,
            },

            map: m,
          });
        })
      )
    );
    console.log(markers);
  };

  async function calculateRoute() {
    console.log(
      "in here",
      originRef.current?.value,
      destinationRef.current?.value
    );
    if (originRef.current && destinationRef.current) {
      // eslint-disable-next-line no-undef
      const directionsService = new google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
      });
      setDirectionsResponse(results);
      setDistance(results.routes[0].legs[0].distance?.text || "");
      setDuration(results.routes[0].legs[0].duration?.text || "");
      console.log(results);

      if (map && directionsResponse) {
        const directionsRenderer = new google.maps.DirectionsRenderer({
          map: map,
          directions: directionsResponse,
        });
        console.log(directionsRenderer);
      }
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

  const offcenter: google.maps.LatLngLiteral = {
    lat: center.lat + 0.1,
    lng: center.lng + 0.1,
  };

  const children = (
    <>
      <Marker key={"sampleMarker"} position={center} map={map} />
      <Marker key={"offcenterSampleMarker"} position={offcenter} map={map} />
    </>
  );

  const mapBox: JSX.Element = (
    <>
      <Box ref={ref} sx={{ height: 300 }} id="map">
        {children}
      </Box>
    </>
  );

  return (
    <Wrapper
      apiKey={process.env.REACT_APP_MAPS_KEY!}
      render={render}
      libraries={["places"]}
    >
      {mapBox}
      <Box flexGrow={1}>
        <TextField ref={originRef} label="Origin" id="Origin" />
      </Box>
      <Box flexGrow={1}>
        <TextField ref={destinationRef} label="Destination" id="Destination" />
      </Box>

      <Button type="submit" onClick={calculateRoute}>
        Calculate Route
      </Button>
      <IconButton aria-label="center back" onClick={clearRoute}>
        <Delete />
      </IconButton>
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
    </Wrapper>
  );
}
