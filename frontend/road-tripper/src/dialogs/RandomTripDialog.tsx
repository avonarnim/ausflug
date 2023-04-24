import * as React from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Input,
  Typography,
} from "@mui/material";
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
const libraries: Libraries = ["geometry", "places"];

export default function RandomTripDialog(props: { spots: SpotInfoProps[] }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_MAPS_KEY!,
    libraries: libraries,
  });

  const [startAutocomplete, setStartAutocomplete] =
    useState<google.maps.places.Autocomplete>();
  const [originLat, setOriginLat] = useState<number>();
  const [originLng, setOriginLng] = useState<number>();
  const [originPlace, setOriginPlace] = useState<string>();
  const originRef = useRef<HTMLInputElement>();

  const [open, setOpen] = React.useState(false);
  const [randomWaypoints, setRandomWaypoints] = React.useState<SpotInfoProps[]>(
    []
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async (submitting: boolean) => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Plot me a trip
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Choose a starting point</DialogTitle>
        <DialogContent>
          {isLoaded ? (
            <Autocomplete
              fields={["formatted_address", "name", "place_id"]}
              onLoad={(autocomplete) => setStartAutocomplete(autocomplete)}
              onPlaceChanged={() => {
                const place = startAutocomplete?.getPlace();
                if (!place || !place.place_id) {
                  return;
                } else {
                  setOriginPlace(place.place_id);
                  setOriginLat(place.geometry?.location?.lat());
                  setOriginLng(place.geometry?.location?.lng());
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
          ) : (
            <></>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)}>Cancel</Button>
          <Link to={`/trips`} style={{ textDecoration: "none" }}>
            <Button variant="contained" onClick={() => handleClose(true)}>
              Plot me a trip
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
}
