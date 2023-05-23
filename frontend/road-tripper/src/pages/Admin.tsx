import {
  Container,
  IconButton,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { SpotInfoProps } from "../components/SpotInfo";
import { useMutation } from "../core/api";
import { NearMe, Delete, Add } from "@mui/icons-material";
import { useAuth } from "../core/AuthContext";
import { auth } from "../core/firebase";

export function QueuedSpots(props: QueueSpotsProps): JSX.Element {
  const approveSpot = useMutation("UpdateSpot");

  const approveSpotCallback = async (spot: SpotInfoProps) => {
    await approveSpot.commit({ ...spot, status: "Approved" });
  };

  return (
    <Container>
      <List>
        {props.spots.map((spot) => {
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
              <ListItemText primary={spot.title} secondary={spot.description} />
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
  const { currentUser, updateUserProfile, setError } = useAuth();
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

  const getSpots = useMutation("GetSpots");
  const getAdminMetrics = useMutation("GetAdminMetrics");
  const getPastNDaysMetrics = useMutation("GetPastNDaysMetrics");

  useEffect(() => {
    prepResults();
  }, []);

  useEffect(() => {
    prepWindowResults();
  }, [metricsWindow]);

  const prepResults = async () => {
    const spotResults = await getSpots.commit({});
    const adminMetrics = await getAdminMetrics.commit({});
    setSpots(spotResults);
    setAdminMetrics(adminMetrics);
  };

  const prepWindowResults = async () => {
    const adminMetrics = await getPastNDaysMetrics.commit({
      days: metricsWindow,
    });
    setWindowMetrics(adminMetrics);
  };

  auth.currentUser?.getIdTokenResult().then((idTokenResult) => {
    console.log(idTokenResult.claims);
    console.log(idTokenResult.claims.admin);
    console.log(!!idTokenResult.claims.admin);
    if (!!idTokenResult.claims.admin) {
      setAdminContent(
        <div>
          <>
            <Typography variant="h1">Admin</Typography>
            <Typography>Queued spots</Typography>
            <Typography>{spots.length}</Typography>
            <QueuedSpots spots={spots.filter((x) => x.status == "pending")} />
            <Typography>Highlighted Categories</Typography>
            <Typography>
              TODO: be able to change highlighted categories + items within
              categories
            </Typography>
            <Grid container item direction="row">
              <Grid container item direction="column">
                <Grid item>
                  <Typography>Overall metrics</Typography>
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
                  <Typography>{adminMetrics.mostPopularOrigins}</Typography>
                </Grid>
                <Grid item>
                  <Typography>Most popular destinations</Typography>
                  <Typography>
                    {adminMetrics.mostPopularDestinations}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container item direction="column">
                <Grid item>
                  <Typography>Window: {metricsWindow} days</Typography>
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
                  <Typography>{windowMetrics.mostPopularOrigins}</Typography>
                </Grid>
                <Grid item>
                  <Typography>Most popular destinations</Typography>
                  <Typography>
                    {windowMetrics.mostPopularDestinations}
                  </Typography>
                </Grid>
                <Grid item>
                  <TextField
                    margin="dense"
                    id="window"
                    label="window"
                    type="text"
                    fullWidth
                    variant="standard"
                    placeholder={metricsWindow.toString()}
                    name="window"
                    onChange={(event) => {
                      setMetricsWindow(Number(event.target.value));
                    }}
                  ></TextField>
                </Grid>
              </Grid>
            </Grid>
          </>
        </div>
      );
    }
  });

  return <>{adminContent}</>;
}

export type AdminMetrics = {
  completedMiles: number;
  numUsers: number;
  numQueuedSpots: number;
  mostPopularOrigins: string[];
  mostPopularDestinations: string[];
  updatedAt: number;
};
