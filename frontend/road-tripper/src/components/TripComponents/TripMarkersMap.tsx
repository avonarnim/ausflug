import {
  useJsApiLoader,
  GoogleMap,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import React, { useRef, useState, useEffect } from "react";
import { Box, Button, Container, Grid, Input } from "@mui/material";

type Libraries = (
  | "drawing"
  | "geometry"
  | "localContext"
  | "places"
  | "visualization"
)[];
const libraries: Libraries = ["places"];

export function TripMarkersMap(props: {
  originPlaceIds: string[];
  destinationPlaceIds: string[];
}): JSX.Element {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_MAPS_KEY!,
    libraries: libraries,
  });

  const [map, setMap] = useState<google.maps.Map>();

  const [center, setCenter] = useState({ lat: 38.8584, lng: -112.2945 });

  // called on-start up of the page
  const onLoad = React.useCallback(async function callback(
    map: google.maps.Map
  ) {
    setMap(map);

    var placesService = new google.maps.places.PlacesService(map);

    if (map) {
      var markers: google.maps.Marker[] = [];

      for (var i = 0; i < props.originPlaceIds.length; i++) {
        var request = {
          placeId: props.originPlaceIds[i],
          fields: ["geometry"],
        };

        placesService.getDetails(request, function (result, status) {
          if (
            status == google.maps.places.PlacesServiceStatus.OK &&
            result &&
            result.geometry &&
            result.geometry.location
          ) {
            var marker = new google.maps.Marker({
              position: result.geometry.location,
              map: map,
            });

            markers.push(marker);
          }
        });
      }

      new MarkerClusterer({ map, markers });

      for (var i = 0; i < props.destinationPlaceIds.length; i++) {
        var request = {
          placeId: props.destinationPlaceIds[i],
          fields: ["geometry"],
        };

        placesService.getDetails(request, function (result, status) {
          if (
            status == google.maps.places.PlacesServiceStatus.OK &&
            result &&
            result.geometry &&
            result.geometry.location
          ) {
            var marker = new google.maps.Marker({
              position: result.geometry.location,
              map: map,
            });

            markers.push(marker);
          }
        });
      }

      new MarkerClusterer({ map, markers });
    }
  },
  []);

  const onUnmount = React.useCallback(function callback(map: google.maps.Map) {
    setMap(undefined);
  }, []);

  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "500px" }}
        center={center}
        zoom={4}
        onLoad={onLoad}
        onUnmount={onUnmount}
      ></GoogleMap>
    </>
  ) : (
    <></>
  );
}
