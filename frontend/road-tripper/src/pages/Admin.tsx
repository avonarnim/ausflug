import {
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
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
    numNewUsers: 0,
    numQueuedSpots: 0,
    mostPopularOrigins: [],
    mostPopularDestinations: [],
    updatedAt: 0,
  });
  const [adminContent, setAdminContent] = useState<JSX.Element>(
    <Typography>
      Please login as Road Tripper team member to view this page
    </Typography>
  );

  const getSpots = useMutation("GetSpots");
  const getAdminMetrics = useMutation("GetAdminMetrics");
  const refreshAdminMetrics = useMutation("RefreshAdminMetrics");

  useEffect(() => {
    prepResults();
  }, []);

  const prepResults = async () => {
    const spotResults = await getSpots.commit({});
    const adminMetrics = await getAdminMetrics.commit({});
    setSpots(spotResults);
    setAdminMetrics(adminMetrics);
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
            <Typography>Completed miles</Typography>
            <Typography>{adminMetrics.completedMiles}</Typography>
            <Typography>New users</Typography>
            <Typography>{adminMetrics.numNewUsers}</Typography>
            <Typography>Most popular origins</Typography>
            <Typography>{adminMetrics.mostPopularOrigins}</Typography>
            <Typography>Most popular destinations</Typography>
            <Typography>{adminMetrics.mostPopularDestinations}</Typography>
          </>
        </div>
      );
    }
  });

  return <>{adminContent}</>;
}

export type AdminMetrics = {
  completedMiles: number;
  numNewUsers: number;
  numQueuedSpots: number;
  mostPopularOrigins: string[];
  mostPopularDestinations: string[];
  updatedAt: number;
};
