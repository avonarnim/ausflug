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
  const [adminContent, setAdminContent] = useState<JSX.Element>(
    <Typography>
      Please login as Road Tripper team member to view this page
    </Typography>
  );

  const getSpots = useMutation("GetSpots");

  useEffect(() => {
    prepSpotResults();
  }, []);

  const prepSpotResults = async () => {
    const spotResults = await getSpots.commit({});
    setSpots(spotResults);
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
            <QueuedSpots spots={spots.filter((x) => x.status == "pending")} />
            <Typography>Highlighted Categories</Typography>
            <Typography>
              TODO: be able to change highlighted categories + items within
              categories
            </Typography>
          </>
        </div>
      );
    }
  });

  return <>{adminContent}</>;
}
