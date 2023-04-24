import {
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../core/AuthContext";
import { useMutation } from "../core/api";
import { TripProps } from "./EditTrip";
import { Edit, AccountCircle, Delete } from "@mui/icons-material";

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
});

export default function Trips(): JSX.Element {
  const { currentUser, updateUserProfile, setError } = useAuth();
  const [trips, setTrips] = useState<TripProps[] | null>(null);

  const params = useParams();

  const getUserTrips = useMutation("GetUserTrips");

  useEffect(() => {
    if (currentUser) {
      console.log("getting own profile");
      getTripsCallback(currentUser.uid);
    } else {
      console.log("no user");
    }
  }, []);

  const getTripsCallback = async (userId: string) => {
    const getUserTripsResponse = await getUserTrips.commit({
      userId: userId,
    });
    setTrips(getUserTripsResponse);
    console.log("trips set", getUserTripsResponse);
  };

  return (
    <Grid item container xs direction="row" sx={{ p: 4 }}>
      <Typography variant="h5">Saved Trips</Typography>
      {currentUser ? (
        <Grid item xs={12} md={6}>
          <List>
            {trips?.map((trip) => (
              <ListItem
                key={trip.name + trip._id}
                secondaryAction={
                  <IconButton edge="end" aria-label="edit">
                    <Link href={`/trips/${trip._id}`}>
                      <Edit />
                    </Link>
                  </IconButton>
                }
              >
                <ListItemText
                  primary={
                    trip.name +
                    (trip.description ? ": " + trip.description : "")
                  }
                  secondary={trip.originVal + " to " + trip.destinationVal}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
      ) : (
        <>
          <Typography>Sign in to view your trips</Typography>
        </>
      )}
    </Grid>
  );
}
