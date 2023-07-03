import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Input,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { HeroCarousel } from "../components/HeroCarousel";
import { useMutation } from "../core/api";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AssetBlockCardHorizontalSwipe,
  AssetBlockCardHorizontalSwipeProps,
  SkeletonAssetBlockCardHorizontalSwipe,
} from "../components/assetSwipers/Block";
import { SpotInfoProps } from "../components/SpotInfo";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { GasPriceProps } from "./Gas";

type Libraries = (
  | "drawing"
  | "geometry"
  | "localContext"
  | "places"
  | "visualization"
)[];
const libraries: Libraries = ["places"];

export default function Home(): JSX.Element {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_MAPS_KEY!,
    libraries: libraries,
  });

  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [startAutocomplete, setStartAutocomplete] =
    useState<google.maps.places.Autocomplete>();
  const [destinationAutocomplete, setDestinationAutocomplete] =
    useState<google.maps.places.Autocomplete>();
  const [originPlace, setOriginPlace] = useState<string>();
  const [destinationPlace, setDestinationPlace] = useState<string>();
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [oneWayRoundTrip, setOneWayRoundTrip] = useState<
    "oneWay" | "roundTrip"
  >("oneWay");

  const [avgGasPrices, setAvgGasPrices] = useState<GasPriceProps>();

  const [hikingHighlightedSpots, setHikingHighlightedSpots] =
    useState<AssetBlockCardHorizontalSwipeProps>({ assetCards: [] });
  const [beachesHighlightedSpots, setBeachesHighlightedSpots] =
    useState<AssetBlockCardHorizontalSwipeProps>({ assetCards: [] });
  const [parksHighlightedSpots, setParksHighlightedSpots] =
    useState<AssetBlockCardHorizontalSwipeProps>({ assetCards: [] });
  const [historyHighlightedSpots, setHistoryHighlightedSpots] =
    useState<AssetBlockCardHorizontalSwipeProps>({ assetCards: [] });

  const [atlasObscuraSourceSpots, setAtlasObscuraSourceSpots] =
    useState<AssetBlockCardHorizontalSwipeProps>({ assetCards: [] });
  const [michelinSourceSpots, setMichelinSourceSpots] =
    useState<AssetBlockCardHorizontalSwipeProps>({ assetCards: [] });
  const [ticketMasterSourceSpots, setTicketMasterSourceSpots] =
    useState<AssetBlockCardHorizontalSwipeProps>({ assetCards: [] });

  const [yourCenterSpots, setYourCenterSpots] =
    useState<AssetBlockCardHorizontalSwipeProps>({ assetCards: [] });
  const [nyCenterSpots, setNyCenterSpots] =
    useState<AssetBlockCardHorizontalSwipeProps>({ assetCards: [] });
  const [laCenterSpots, setLaCenterSpots] =
    useState<AssetBlockCardHorizontalSwipeProps>({ assetCards: [] });
  const [chiCenterSpots, setChiCenterSpots] =
    useState<AssetBlockCardHorizontalSwipeProps>({ assetCards: [] });
  const [sfCenterSpots, setSfCenterSpots] =
    useState<AssetBlockCardHorizontalSwipeProps>({ assetCards: [] });
  const [dcCenterSpots, setDcCenterSpots] =
    useState<AssetBlockCardHorizontalSwipeProps>({ assetCards: [] });
  const [seaCenterSpots, setSeaCenterSpots] =
    useState<AssetBlockCardHorizontalSwipeProps>({ assetCards: [] });

  const sourceSpots = [
    {
      source: "AtlasObscura",
      setter: setAtlasObscuraSourceSpots,
    },
    {
      source: "MichelinRestaurants",
      setter: setMichelinSourceSpots,
    },
    {
      source: "TicketMaster",
      setter: setTicketMasterSourceSpots,
    },
  ];

  const centerCoordinates = [
    { longitude: -73.935242, latitude: 40.73061, setter: setNyCenterSpots },
    { longitude: -118.243683, latitude: 34.052235, setter: setLaCenterSpots },
    { longitude: -87.6298, latitude: 41.8781, setter: setChiCenterSpots },
    { longitude: -122.419416, latitude: 37.774929, setter: setSfCenterSpots },
    { longitude: -77.03653, latitude: 38.907192, setter: setDcCenterSpots },
    { longitude: -122.33207, latitude: 47.60621, setter: setSeaCenterSpots },
  ];

  const highlightedGroups = [
    { subject: "Hiking", setter: setHikingHighlightedSpots },
    { subject: "Beaches", setter: setBeachesHighlightedSpots },
    { subject: "Parks", setter: setParksHighlightedSpots },
    { subject: "History", setter: setHistoryHighlightedSpots },
  ];

  const getSpotsByHighlightedGroup = useMutation("GetSpotsByHighlightedGroup");
  const getSpotsBySource = useMutation("GetSpotsBySource");
  const getSpotsByCenter = useMutation("GetSpotsByCenter");
  const getGasPriceInBox = useMutation("GetGasPriceInBox");

  const originRef = useRef<HTMLInputElement>();
  const destinationRef = useRef<HTMLInputElement>();

  const featurettes = [
    {
      title: "New York",
      spots: nyCenterSpots,
    },
    {
      title: "Michelin Restaurants",
      spots: michelinSourceSpots,
    },
    {
      title: "Los Angeles",
      spots: laCenterSpots,
    },
    {
      title: "Hiking",
      spots: hikingHighlightedSpots,
    },
    {
      title: "Beaches",
      spots: beachesHighlightedSpots,
    },
    {
      title: "Atlas Obscura Locations",
      spots: atlasObscuraSourceSpots,
    },
    {
      title: "San Francisco",
      spots: sfCenterSpots,
    },
    {
      title: "Washington DC",
      spots: dcCenterSpots,
    },
    {
      title: "Parks",
      spots: parksHighlightedSpots,
    },
    {
      title: "Venues",
      spots: ticketMasterSourceSpots,
    },
    {
      title: "Chicago",
      spots: chiCenterSpots,
    },
    {
      title: "History",
      spots: historyHighlightedSpots,
    },
    {
      title: "Seattle",
      spots: seaCenterSpots,
    },
  ];

  useEffect(() => {
    const init = async () => {
      for (const { source, setter } of sourceSpots) {
        const spots: SpotInfoProps[] = await getSpotsBySource.commit({
          source: source,
        });
        setter({
          assetCards: spots.map((spot) => ({
            title: spot.title,
            type: "spots",
            id: spot._id,
            attribute: "description",
            value: spot.description,
            image: spot.images[0],
          })),
        });
      }

      for (const { subject, setter } of highlightedGroups) {
        const spots = await getSpotsByHighlightedGroup.commit({
          subject: subject,
        });
        setter({
          assetCards: spots.map((spot) => ({
            title: spot.title,
            type: "spots",
            id: spot._id,
            attribute: "description",
            value: spot.description,
            image: spot.images[0],
          })),
        });
      }

      // TODO: remove auto-geolocation
      // this is considered untrustworthy by users
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position: GeolocationPosition) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            setCenter({ lat: latitude, lng: longitude });
            const spots = await getSpotsByCenter.commit({
              longitude,
              latitude,
            });
            setYourCenterSpots({
              assetCards: spots.map((spot) => ({
                title: spot.title,
                type: "spots",
                id: spot._id,
                attribute: "description",
                value: spot.description,
                image: spot.images[0],
              })),
            });

            setAvgGasPrices(
              await getGasPriceInBox.commit({
                longitude1: position.coords.longitude + 1,
                latitude1: position.coords.latitude + 1,
                longitude2: position.coords.longitude - 1,
                latitude2: position.coords.latitude - 1,
              })
            );
          },
          () => {
            console.log("Unable to retrieve your location");
          }
        );
      }

      for (const { longitude, latitude, setter } of centerCoordinates) {
        const spots = await getSpotsByCenter.commit({ longitude, latitude });
        setter({
          assetCards: spots.map((spot) => ({
            title: spot.title,
            type: "spots",
            id: spot._id,
            attribute: "description",
            value: spot.description,
            image: spot.images[0],
          })),
        });
      }
    };

    init();
  }, []);

  return (
    <Container
      sx={{ p: 0, mr: 0, ml: 0 }}
      disableGutters
      maxWidth={false}
      id="home container"
    >
      {/* <HeroCarousel /> */}

      <Container>
        {isLoaded && (
          <Box
            mt={4}
            sx={{ borderRadius: "5px", borderColor: "black", border: 1 }}
          >
            <Typography variant="h6" sx={{ pl: 4, pt: 2 }}>
              Start planning your next trip
            </Typography>
            <ToggleButtonGroup
              value={oneWayRoundTrip}
              exclusive
              onChange={(event, newOneWayRoundTrip: "oneWay" | "roundTrip") =>
                setOneWayRoundTrip(newOneWayRoundTrip)
              }
              aria-label="outlined button group"
              sx={{ pl: 4, pt: 2 }}
            >
              <ToggleButton value="oneWay" aria-label="one way">
                One Way
              </ToggleButton>
              <ToggleButton value="roundTrip" aria-label="round trip">
                Round Trip
              </ToggleButton>
            </ToggleButtonGroup>
            <Grid item container direction="row" alignItems="center">
              <Grid item xs={6} sx={{ pl: 4, pr: 4, pt: 4, pb: 2 }}>
                <Autocomplete
                  fields={["formatted_address", "name", "place_id"]}
                  onLoad={(autocomplete) => setStartAutocomplete(autocomplete)}
                  onPlaceChanged={() => {
                    const place = startAutocomplete?.getPlace();
                    if (!place || !place.place_id) {
                      return;
                    } else {
                      setOriginPlace(place.place_id);
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
              <Grid item xs={6} sx={{ pl: 4, pr: 4, pt: 4, pb: 2 }}>
                <Autocomplete
                  fields={["formatted_address", "name", "place_id"]}
                  onLoad={(autocomplete) =>
                    setDestinationAutocomplete(autocomplete)
                  }
                  onPlaceChanged={() => {
                    const place = destinationAutocomplete?.getPlace();
                    if (!place || !place.place_id) {
                      return;
                    } else {
                      setDestinationPlace(place.place_id);
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid item xs={6} sx={{ p: 4 }}>
                  <DatePicker
                    label="Start"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                  />
                </Grid>
                <Grid item xs={6} sx={{ p: 4 }}>
                  <DatePicker
                    label="End"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                  />
                </Grid>
              </LocalizationProvider>
              <br />
              <Grid container spacing={0} justifyContent="flex-begin">
                <Grid item xs={3} sx={{ pl: 4, pr: 4, pt: 2, pb: 4 }}>
                  <Link
                    to={
                      originPlace && destinationPlace && startDate && endDate
                        ? `/trips/${oneWayRoundTrip}/${originPlace}/${
                            originRef.current!.value
                          }/${destinationPlace}/${
                            destinationRef.current!.value
                          }/${startDate.format()}/${endDate.format()}`
                        : originPlace && destinationPlace
                        ? `/trips/${oneWayRoundTrip}/${originPlace}/${
                            originRef.current!.value
                          }/${destinationPlace}/${
                            destinationRef.current!.value
                          }`
                        : `/`
                    }
                    style={{ textDecoration: "none" }}
                  >
                    <Button variant="contained">Find spots</Button>
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        )}
        <Grid container spacing={1} p={1} alignItems="stretch">
          <Grid item xs={12} mt={2}>
            <Divider style={{ marginTop: 10, marginBottom: 10 }} />
            <Typography variant="h4">Around You</Typography>
            {yourCenterSpots.assetCards.length != 0 ? (
              <>
                <AssetBlockCardHorizontalSwipe
                  assetCards={yourCenterSpots.assetCards}
                />
              </>
            ) : (
              <>
                <SkeletonAssetBlockCardHorizontalSwipe />
              </>
            )}
          </Grid>
          <Divider style={{ marginTop: 2, marginBottom: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid black",
                  borderRadius: "5px",
                  p: 2,
                  background: "linear-gradient(45deg, #f6c0aa, #a4c7e7)",
                }}
              >
                <Typography variant="h6">Find the best gas stations</Typography>
                <Typography>
                  Check the average price along your entire route
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid black",
                  borderRadius: "5px",
                  p: 2,
                }}
              >
                <Typography variant="h6">
                  Average gas price in your area
                </Typography>
                <Typography>Unleaded: {avgGasPrices?.unleaded}</Typography>
                <Typography>Midgrade: {avgGasPrices?.midgrade}</Typography>
                <Typography>Premium: {avgGasPrices?.premium}</Typography>
                <Typography>Diesel: {avgGasPrices?.diesel}</Typography>
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={8}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid black",
                  borderRadius: "5px",
                  p: 2,
                  background: "linear-gradient(295deg, #f6c0aa, #a4c7e7)",
                }}
              >
                <Typography variant="h6">
                  Never miss a concert in that little town along the way
                </Typography>
                <Typography>
                  Know what events are happening at thousands of venues
                </Typography>
                <Typography></Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid black",
                  borderRadius: "5px",
                  p: 2,
                }}
              >
                <Typography>
                  Search through curated, memorable detours
                </Typography>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/search"
                  sx={{
                    mt: "auto",
                    mb: "auto",
                    alignSelf: "center",
                  }}
                >
                  Search
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={7}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid black",
                  borderRadius: "5px",
                  p: 2,
                  background: "linear-gradient(125deg, #f6c0aa, #a4c7e7)",
                }}
              >
                <Typography variant="h6">
                  Plan your road trip alongside your friends
                </Typography>
                <Typography>
                  Know which friends are looking to join a trip or want you to
                  tag along
                </Typography>
                <Typography>Save your plans and post later</Typography>
              </Box>
            </Grid>
            <Grid item xs={5}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid black",
                  borderRadius: "5px",
                  p: 2,
                }}
              >
                <Typography>
                  Promote your town's best stop or next event
                </Typography>
                <Button
                  variant="contained"
                  component={Link}
                  to="/addSpot"
                  sx={{
                    color: "#efefef",
                    mt: "auto",
                    mb: 2,
                    alignSelf: "center",
                  }}
                >
                  Suggest a new stop
                </Button>
              </Box>
            </Grid>
          </Grid>
          {featurettes.map(({ title, spots }, index) => (
            <Grid key={index} item xs={12} mt={2}>
              <Typography variant="h4">{title}</Typography>
              {spots.assetCards.length != 0 ? (
                <AssetBlockCardHorizontalSwipe assetCards={spots.assetCards} />
              ) : (
                <SkeletonAssetBlockCardHorizontalSwipe />
              )}
            </Grid>
          ))}
        </Grid>
      </Container>
    </Container>
  );
}
