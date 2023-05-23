import * as React from "react";
import { Box, Button, Input, styled, Typography } from "@mui/material";
import { useMutation } from "../core/api";
import { useState, useRef } from "react";
import { useAuth } from "../core/AuthContext";
import { SpotInfoProps } from "../components/SpotInfo";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { Link } from "react-router-dom";

type Libraries = (
  | "drawing"
  | "geometry"
  | "localContext"
  | "places"
  | "visualization"
)[];
const libraries: Libraries = ["places"];

export default function RandomTripButton(props: { spots: SpotInfoProps[] }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_MAPS_KEY!,
    libraries: libraries,
  });

  const [startAutocomplete, setStartAutocomplete] =
    useState<google.maps.places.Autocomplete>();
  const [originPlace, setOriginPlace] = useState<string>();
  const originRef = useRef<HTMLInputElement>();

  const [randomWaypoints, setRandomWaypoints] = React.useState<SpotInfoProps[]>(
    []
  );

  return (
    <Box sx={{ p: 2, border: "1px black", borderRadius: 2, boxShadow: 2 }}>
      {isLoaded ? (
        <Autocomplete
          fields={["formatted_address", "name", "place_id", "geometry"]}
          onLoad={(autocomplete) => setStartAutocomplete(autocomplete)}
          onPlaceChanged={() => {
            const place = startAutocomplete?.getPlace();
            if (!place || !place.place_id) {
              return;
            } else {
              setOriginPlace(place.place_id);
              const tempLat = place.geometry?.location?.lat();
              const tempLng = place.geometry?.location?.lng();
              setRandomWaypoints(
                props.spots
                  .filter(
                    (spot) =>
                      spot.location.lat < tempLat! + 5 &&
                      spot.location.lng < tempLng! + 5 &&
                      spot.location.lat > tempLat! - 5 &&
                      spot.location.lng > tempLng! - 5
                  )
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 10)
              );
              localStorage.setItem(
                "waypoints",
                JSON.stringify(randomWaypoints)
              );
            }
          }}
        >
          <Input
            type="text"
            placeholder="Starting point"
            inputRef={originRef}
            fullWidth
            sx={{ mb: 2 }}
          />
        </Autocomplete>
      ) : (
        <></>
      )}
      <Link
        to={`/trips/random/${originPlace}/${originRef.current?.value || ""}`}
        style={{ textDecoration: "none" }}
      >
        <Button variant="contained">Plot me a trip</Button>
      </Link>
    </Box>
  );
}
