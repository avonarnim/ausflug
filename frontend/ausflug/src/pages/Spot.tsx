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
import { Bookmark, BookmarkBorder } from "@mui/icons-material";
import { useAuth } from "../core/AuthContext";
import SpotReviewFormDialog from "../dialogs/SpotReviewDialog";
import {
  AssetImageCardHorizontalSwipe,
  AssetImageCardHorizontalSwipeProps,
  SkeletonAssetImageCardHorizontalSwipe,
} from "../components/assetSwipers/Image";
import {
  AssetBlockCardHorizontalSwipe,
  AssetBlockCardHorizontalSwipeProps,
  SkeletonAssetBlockCardHorizontalSwipe,
} from "../components/assetSwipers/Block";
import { Upvote } from "../components/Upvote";
import { ProfileProps } from "./Profile";

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

  console.log("isLoaded", isLoaded);

  const params = useParams();
  const { currentUser } = useAuth();

  const [spotId, setSpotId] = useState("");
  const [map, setMap] = useState<google.maps.Map>();
  const [spot, setSpot] = useState<SpotInfoProps>();
  const [events, setEvents] = useState<EventProps[]>();
  const [similarSpots, setSimilarSpots] = useState<SpotInfoProps[]>();
  const [assetCards, setAssetCards] =
    useState<AssetImageCardHorizontalSwipeProps>({ assetCards: [] });
  const [profile, setProfile] = useState<ProfileProps>();
  const [spotSaved, setSpotSaved] = useState(false);

  const getSpot = useMutation("GetSpot");
  const getEvents = useMutation("GetEventsByVenue");
  const saveSpot = useMutation("SaveSpotToUser");
  const getSimilarSpots = useMutation("GetSimilarSpots");
  const getProfile = useMutation("GetProfile");

  useEffect(() => {
    console.log("params", params);
    if (!params.spotId) {
      console.log("no spot id");
    } else {
      console.log("getting spot");
      setSpotId(params.spotId);
      getSpotCallback(params.spotId);
      if (currentUser) getProfileCallback();
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
      getSimilarSpotsCallback(spot.title, spot.description);
    }
  }, [spot]);

  const getSpotCallback = async (spotId: string) => {
    const getSpotResponse = await getSpot.commit({ spotId: spotId });
    setSpot(getSpotResponse);
    setAssetCards({
      assetCards: getSpotResponse.images
        .map((image) => ({
          image: image,
        }))
        .filter((image) => image.image !== ""),
    });
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

  const getProfileCallback = async () => {
    const getProfileResponse = await getProfile.commit({
      profileId: currentUser.uid,
    });
    setProfile(getProfileResponse);
    setSpotSaved(getProfileResponse.savedSpots.includes(spotId));
  };

  const getEventsCallback = async (ticketMasterIdString: string) => {
    const getEventsResponse = await getEvents.commit({
      venueId: ticketMasterIdString,
    });
    console.log(getEventsResponse);
    setEvents(getEventsResponse);
  };

  const getSimilarSpotsCallback = async (
    title: string,
    description: string
  ) => {
    const getSimilarSpotsResponse = await getSimilarSpots.commit({
      title: title,
      description: description,
    });
    setSimilarSpots(getSimilarSpotsResponse);
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
          <Grid item xs={1} sm={1} alignItems="center" justifyContent="center">
            <Upvote spot={spot} userId={currentUser.uid} />
          </Grid>
          {assetCards.assetCards.length > 0 && (
            <Grid item xs={11} sm={6}>
              <AssetImageCardHorizontalSwipe
                assetCards={assetCards.assetCards}
              />
            </Grid>
          )}
          <Grid item xs={6} sm={5}>
            <Typography variant="h6">{spot.title}</Typography>
            <Typography>{spot.description}</Typography>
            <Typography>Category: {spot.category}</Typography>
            {spot.featuredBy.length > 0 ? (
              <Typography>Featured by: {spot.featuredBy}</Typography>
            ) : (
              <></>
            )}
            <Typography>Specialty: {spot.specialty}</Typography>
            <Typography>Quality: {spot.quality}</Typography>
            <Typography>Ratings: {spot.numberOfRatings}</Typography>
            <Typography>
              Average time spent here: {spot.avgTimeSpent} hr
              {spot.avgTimeSpent === 1 ? "" : "s"}
            </Typography>
            <Typography>Cost: {swapToDollarSigns(spot.cost)}</Typography>
            {currentUser && spotId ? (
              <Grid container direction="row">
                <IconButton
                  edge="end"
                  onClick={() => {
                    saveSpot.commit({
                      userId: currentUser.uid,
                      spotId: spotId,
                    });
                    setSpotSaved(true);
                  }}
                >
                  {spotSaved ? <Bookmark /> : <BookmarkBorder />}
                </IconButton>
                <SpotReviewFormDialog spotId={spotId} />
              </Grid>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>

        {isLoaded ? (
          <Grid item xs={6}>
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "40vh" }}
              center={spot.location}
              zoom={4}
              onLoad={(map) => setMap(map)}
              onUnmount={() => setMap(undefined)}
            ></GoogleMap>
          </Grid>
        ) : (
          <></>
        )}

        {spot.reviews.length > 0 ? (
          <>
            <Typography>Reviews</Typography>
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
        {similarSpots ? (
          <>
            <Typography variant="h6">Similar Spots</Typography>
            <AssetBlockCardHorizontalSwipe
              assetCards={similarSpots.map((spot) => ({
                title: spot.title,
                type: "spots",
                id: spot._id,
                attribute: "description",
                value: spot.description,
                image: spot.images[0],
              }))}
            />
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
