import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useMutation } from "../core/api";
import { SpotInfoProps } from "../components/SpotInfo";
import {
  Box,
  Container,
  Grid,
  Typography,
  CircularProgress,
  IconButton,
  Button,
} from "@mui/material";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { EventProps } from "./Event";
import { AddCircleOutline } from "@mui/icons-material";
import { useAuth } from "../core/AuthContext";
import SpotReviewFormDialog from "../dialogs/SpotReviewDialog";

type Libraries = (
  | "drawing"
  | "geometry"
  | "localContext"
  | "places"
  | "visualization"
)[];
const libraries: Libraries = ["places"];

export default function Spot(): JSX.Element {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_MAPS_KEY!,
    libraries: libraries,
  });

  const params = useParams();
  const { currentUser } = useAuth();

  const [spotId, setSpotId] = useState("");
  const [map, setMap] = useState<google.maps.Map>();
  const [spot, setSpot] = useState<SpotInfoProps>();
  const [events, setEvents] = useState<EventProps[]>();

  const getSpot = useMutation("GetSpot");
  const getEvents = useMutation("GetEventsByVenue");
  const saveSpot = useMutation("SaveSpotToUser");

  useEffect(() => {
    console.log("params", params);
    if (!params.spotId) {
      console.log("no spot id");
    } else {
      console.log("getting spot");
      setSpotId(params.spotId);
      getSpotCallback(params.spotId);
    }
  }, [map]);

  useEffect(() => {
    if (spot) {
      // if (spot.category === "venue" && spot.externalIds.length > 0) {
      if (spot.externalIds.length > 0) {
        console.log("getting events");
        const ticketMasterId = spot.externalIds.find(
          (externalId) => externalId.source === "TicketMaster"
        );
        if (ticketMasterId?.id) getEventsCallback(ticketMasterId.id);
      }
    }
  }, [spot]);

  const getSpotCallback = async (spotId: string) => {
    const getSpotResponse = await getSpot.commit({ spotId: spotId });
    setSpot(getSpotResponse);
    console.log("spot set", getSpotResponse);
    const marker = new google.maps.Marker({
      position: getSpotResponse.location,
      map: map,
    });

    map?.setOptions({
      zoom: 8,
      center: {
        lat: getSpotResponse.location.lat,
        lng: getSpotResponse.location.lng,
      },
    });
  };

  const getEventsCallback = async (ticketMasterIdString: string) => {
    const getEventsResponse = await getEvents.commit({
      venueId: ticketMasterIdString,
    });
    console.log(getEventsResponse);
    setEvents(getEventsResponse);
  };

  // called on-start up of the page
  const onLoad = React.useCallback(async function callback(
    map: google.maps.Map
  ) {
    setMap(map);
  },
  []);

  return spot ? (
    <Container sx={{ marginTop: 4 }}>
      <Box>
        <Grid item container sx={{ marginBottom: 4 }}>
          <Grid item xs={12} sm={6}>
            <img
              src={spot.images[0]}
              alt={spot.title}
              style={{ borderRadius: "25px", width: "200px", height: "auto" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>{spot.title}</Typography>
            <Typography>{spot.description}</Typography>
            <Typography>Category: {spot.category}</Typography>
            {spot.featuredBy.length > 0 ? (
              <Typography>Featured by: {spot.featuredBy}</Typography>
            ) : (
              <></>
            )}
            {spot.highlightedIn.length > 0 ? (
              <Typography>Highlighted in {spot.highlightedIn}</Typography>
            ) : (
              <></>
            )}
            <Typography>Specialty: {spot.specialty}</Typography>
            <Typography>Quality: {spot.quality}</Typography>
            <Typography>Ratings: {spot.numberOfRatings}</Typography>
            <Typography>
              Average time spent here: {spot.avgTimeSpent}
            </Typography>
            <Typography>Cost: {swapToDollarSigns(spot.cost)}</Typography>
            {currentUser && spotId ? (
              <>
                <IconButton
                  edge="end"
                  onClick={() =>
                    saveSpot.commit({ userId: currentUser.uid, spotId: spotId })
                  }
                >
                  <AddCircleOutline />
                </IconButton>
                <SpotReviewFormDialog spotId={spotId} />
              </>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>

        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "500px" }}
            center={spot.location}
            zoom={4}
            onLoad={(map) => setMap(map)}
            onUnmount={() => setMap(undefined)}
          ></GoogleMap>
        ) : (
          <></>
        )}

        {spot.reviews.length > 0 ? (
          <>
            <Typography>Reviews</Typography>{" "}
            <Grid item container>
              {spot.reviews.map((review) => (
                <Grid item xs={12} sm={6} md={4}>
                  <Typography>{review.content}</Typography>
                  <Typography>{review.author}</Typography>
                  <Typography>{review.specialty}</Typography>
                  <Typography>{review.quality}</Typography>
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          <></>
        )}

        {events ? (
          <>
            <Typography>Events</Typography>
            <Grid item container>
              {events.map((event) => (
                <Grid item xs={12} sm={6} md={4}>
                  <img
                    src={event.image}
                    alt={event.title}
                    style={{
                      borderRadius: "25px",
                      width: "200px",
                      height: "auto",
                    }}
                  />
                  <Typography>{event.title}</Typography>
                  <Typography>{event.description}</Typography>
                  <Typography>{event.status}</Typography>
                  <Typography>{event.startDate}</Typography>
                  <Typography>{event.endDate}</Typography>
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          <></>
        )}
      </Box>
    </Container>
  ) : (
    <Container>
      <Box>
        <CircularProgress />
      </Box>
    </Container>
  );
}

function swapToDollarSigns(cost: number): string {
  let dollarSigns = "";
  for (let i = 0; i < cost; i++) {
    dollarSigns += "$";
  }
  return dollarSigns;
}
