import { Wrapper, Status } from "@googlemaps/react-wrapper";
import React, { useEffect, useRef, ReactElement } from "react";
import { Box } from "@mui/material";
// import { useMutation } from "../core/api";

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
  const [zoom, setZoom] = React.useState(3); // initial zoom
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({
    lat: 50,
    lng: 50,
  });
  const [map, setMap] = React.useState<google.maps.Map>();

  const ref = useRef<HTMLElement>(null);

  // const getSpots = useMutation("GetSpots");
  // const spotResults = getSpots.commit({});
  // console.log(spotResults);

  useEffect(() => {
    console.log("in here 1");
    if (ref.current && !map) {
      console.log("in here 2");
      setMap(
        new window.google.maps.Map(ref.current, {
          center: center,
          zoom: zoom,
        })
      );
    }
  }, [map, ref]);

  const offcenter: google.maps.LatLngLiteral = {
    lat: center.lat + 0.1,
    lng: center.lng + 0.1,
  };

  const children = (
    <>
      <Marker key={1} position={center} map={map} />
      <Marker key={1} position={offcenter} map={map} />
    </>
  );

  const mapBox: JSX.Element = (
    <>
      <Box ref={ref} sx={{ height: 300 }} id="map">
        {children}
      </Box>
    </>
  );

  // const onClick = (e: google.maps.MapMouseEvent) => {
  //   // avoid directly mutating state
  //   setClicks([...clicks, e.latLng!]);
  // };

  // const onIdle = (m: google.maps.Map) => {
  //   console.log("onIdle", m);
  //   console.log(google.maps.)
  //   setZoom(m.getZoom()!);
  //   setCenter(m.getCenter()!.toJSON());

  // React.useEffect(() => {
  //   if (map) {
  //     ["click", "idle"].forEach((eventName) =>
  //       google.maps.event.clearListeners(map, eventName)
  //     );

  //     if (onClick) {
  //       map.addListener("click", onClick);
  //     }

  //     if (onIdle) {
  //       map.addListener("idle", () => onIdle(map));
  //     }
  //   }
  // }, [map, onClick, onIdle]);
  // };

  return (
    <Wrapper apiKey={"AIzaSyDPKLXmZyUAW3cUcHnlKVGCSgV8G-9bp8w"} render={render}>
      {mapBox}
    </Wrapper>
  );
}
