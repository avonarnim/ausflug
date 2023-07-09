import {
  Avatar,
  Container,
  IconButton,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";
import { SpotInfoProps } from "../components/SpotInfo";
import { useMutation } from "../core/api";
import { Delete, Add } from "@mui/icons-material";
import { auth } from "../core/firebase";

export function QueuedSpots(props: QueueSpotsProps): JSX.Element {
  const approveSpot = useMutation("UpdateSpot");
  const [spots, setSpots] = useState<SpotInfoProps[]>(props.spots);

  const approveSpotCallback = async (spot: SpotInfoProps) => {
    await approveSpot.commit({ ...spot, status: "Approved" });
    setSpots(spots.filter((s) => s._id !== spot._id));
  };

  return (
    <Container sx={{ borderRadius: "5px", backgroundColor: "white" }}>
      <List>
        {spots.map((spot) => {
          return (
            <ListItem
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => approveSpotCallback(spot)}
                >
                  <Add />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar alt={spot.title} src={spot.images[0]} />
              </ListItemAvatar>
              <ListItemText primary={spot.title} secondary={spot.description} />
              <Typography>{spot.mapLocation.formatted_address}</Typography>
              <Typography>
                {spot.location.lat} {spot.location.lng}
              </Typography>
            </ListItem>
          );
        })}
      </List>
    </Container>
  );
}

type QueueSpotsProps = {
  spots: SpotInfoProps[];
};

export default function Admin(): JSX.Element {
  const [isAdmin, setIsAdmin] = useState(false);
  const [spots, setSpots] = useState<SpotInfoProps[]>([]);
  const [adminMetrics, setAdminMetrics] = useState<AdminMetrics>({
    completedMiles: 0,
    numUsers: 0,
    numQueuedSpots: 0,
    mostPopularOrigins: [],
    mostPopularDestinations: [],
    updatedAt: 0,
  });
  const [windowMetrics, setWindowMetrics] = useState<AdminMetrics>({
    completedMiles: 0,
    numUsers: 0,
    numQueuedSpots: 0,
    mostPopularOrigins: [],
    mostPopularDestinations: [],
    updatedAt: 0,
  });
  const [metricsWindow, setMetricsWindow] = useState(7);
  const [adminContent, setAdminContent] = useState<JSX.Element>(
    <Typography>
      Please login as Road Tripper team member to view this page
    </Typography>
  );
  const [feedback, setFeedback] = useState<FeedbackProps[]>([]);

  const getSpotsQueue = useMutation("GetSpotsQueue");
  const getAdminMetrics = useMutation("GetAdminMetrics");
  const getPastNDaysMetrics = useMutation("GetPastNDaysMetrics");
  const getFeedback = useMutation("GetFeedback");

  useEffect(() => {
    auth.currentUser
      ?.getIdTokenResult()
      .then((idTokenResult) => {
        console.log("have id token", idTokenResult);
        if (!!idTokenResult.claims.admin) {
          console.log("is admin");
          setIsAdmin(true);
          prepResults();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    auth.currentUser?.getIdTokenResult().then((idTokenResult) => {
      if (!!idTokenResult.claims.admin) {
        prepWindowResults();
      }
    });
  }, [metricsWindow]);

  const prepResults = async () => {
    const spotResults = await getSpotsQueue.commit({});
    const adminMetrics = await getAdminMetrics.commit({});
    const feedbackResults = await getFeedback.commit(null);
    setSpots(spotResults);
    setAdminMetrics(adminMetrics);
    setFeedback(feedbackResults);
  };

  const prepWindowResults = async () => {
    const adminMetrics = await getPastNDaysMetrics.commit({
      days: metricsWindow,
    });
    setWindowMetrics(adminMetrics);
  };

  return false || isAdmin ? (
    <Box p={4}>
      <Typography variant="h3">Admin</Typography>
      <Typography variant="h5">Queued spots {spots.length}</Typography>
      <QueuedSpots spots={spots} />
      <Typography variant="h5">Highlighted Categories</Typography>
      <Typography>
        TODO: be able to change highlighted categories + items within categories
      </Typography>
      <Grid container item xs={12}>
        <Grid
          item
          direction="column"
          xs={6}
          p={2}
          m={2}
          style={{ backgroundColor: "white", borderRadius: "5px" }}
        >
          <Grid item>
            <Typography variant="h5">Overall metrics</Typography>
          </Grid>
          <Grid item>
            <Typography>Completed miles</Typography>
            <Typography>{adminMetrics.completedMiles}</Typography>
          </Grid>
          <Grid item>
            <Typography>New users since</Typography>
            <Typography>{adminMetrics.numUsers}</Typography>
          </Grid>
          <Grid item>
            <Typography>Most popular origins</Typography>
            {adminMetrics.mostPopularOrigins.map((origin) => (
              <Typography>
                {origin._id} ({origin.count})
              </Typography>
            ))}
          </Grid>
          <Grid item>
            <Typography>Most popular destinations</Typography>
            {adminMetrics.mostPopularDestinations.map((origin) => (
              <Typography>
                {origin._id} ({origin.count})
              </Typography>
            ))}
          </Grid>
        </Grid>
        <Grid
          item
          direction="column"
          xs={6}
          style={{ backgroundColor: "white", borderRadius: "5px" }}
          p={2}
          m={2}
        >
          <Grid item>
            <Typography variant="h5">Window: {metricsWindow} days</Typography>
            <TextField
              margin="dense"
              id="window"
              label="window"
              type="text"
              variant="standard"
              placeholder={metricsWindow.toString()}
              name="window"
              onChange={(event) => {
                setMetricsWindow(Number(event.target.value));
              }}
            ></TextField>
          </Grid>
          <Grid item>
            <Typography>Completed miles</Typography>
            <Typography>{windowMetrics.completedMiles}</Typography>
          </Grid>
          <Grid item>
            <Typography>New users</Typography>
            <Typography>{windowMetrics.numUsers}</Typography>
          </Grid>
          <Grid item>
            <Typography>Most popular origins</Typography>
            {windowMetrics.mostPopularOrigins.map((origin) => (
              <Typography>
                {origin._id} ({origin.count})
              </Typography>
            ))}
          </Grid>
          <Grid item>
            <Typography>Most popular destinations</Typography>
            {windowMetrics.mostPopularDestinations.map((origin) => (
              <Typography>
                {origin._id} ({origin.count})
              </Typography>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Typography variant="h5">Feedback</Typography>
      <List>
        {feedback.map((fbEl) => {
          return (
            <>
              <ListItem>
                <ListItemText
                  primary={fbEl.feedback}
                  secondary={fbEl.contact + " " + fbEl.creationDate}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </>
          );
        })}
      </List>
    </Box>
  ) : (
    <Typography>
      Please login as Road Tripper team member to view this page
    </Typography>
  );
}

export type AdminMetrics = {
  completedMiles: number;
  numUsers: number;
  numQueuedSpots: number;
  mostPopularOrigins: { _id: string; count: number }[];
  mostPopularDestinations: { _id: string; count: number }[];
  updatedAt: number;
};

export type FeedbackProps = {
  feedback: string;
  contact: string;
  creationDate: string;
};
