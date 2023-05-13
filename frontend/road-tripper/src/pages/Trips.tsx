import {
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../core/AuthContext";
import { useMutation } from "../core/api";
import { TripProps } from "./EditTrip";
import { Edit, Check, AccountCircle, Delete } from "@mui/icons-material";

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
});

const ListItemWithWiderSecondaryAction = styled(ListItem)(({ theme }) => ({
  "&.MuiListItem-secondaryAction": {
    paddingRight: 96,
  },
}));

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
  };

  return (
    <Grid item container xs={12} direction="row" sx={{ p: 4 }}>
      {currentUser ? (
        <>
          <Grid item xs={12}>
            <Typography variant="h5">Saved Trips</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <List>
              {trips
                ?.filter((trip) => trip.isComplete == false)
                .map((trip) => (
                  <ListItemWithWiderSecondaryAction key={trip.name + trip._id}>
                    <ListItemText
                      primary={
                        trip.name +
                        (trip.description ? ": " + trip.description : "")
                      }
                      secondary={trip.originVal + " to " + trip.destinationVal}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        aria-label="comments"
                        onClick={() => {
                          let subbedTrips = [...trips];
                          for (let i = 0; i < subbedTrips.length; i++) {
                            if (subbedTrips[i]._id == trip._id) {
                              subbedTrips[i].isComplete = true;
                              break;
                            }
                          }
                          setTrips(subbedTrips);
                        }}
                      >
                        <Check />
                      </IconButton>
                      <IconButton edge="end" aria-label="edit">
                        <Link href={`/trips/${trip._id}`}>
                          <Edit />
                        </Link>
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItemWithWiderSecondaryAction>
                ))}
            </List>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5">Completed Trips</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <List>
              {trips
                ?.filter((trip) => trip.isComplete == true)
                .map((trip) => (
                  <ListItemWithWiderSecondaryAction key={trip.name + trip._id}>
                    <ListItemText
                      primary={
                        trip.name +
                        (trip.description ? ": " + trip.description : "")
                      }
                      secondary={trip.originVal + " to " + trip.destinationVal}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        aria-label="comments"
                        onClick={() => {
                          let subbedTrips = [...trips];
                          for (let i = 0; i < subbedTrips.length; i++) {
                            if (subbedTrips[i]._id == trip._id) {
                              subbedTrips[i].isComplete = false;
                              break;
                            }
                          }
                          setTrips(subbedTrips);
                        }}
                      >
                        <Check />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => {
                          let subbedTrips = [...trips];
                          let i = 0;
                          for (0; i < subbedTrips.length; i++) {
                            if (subbedTrips[i]._id == trip._id) {
                              break;
                            }
                          }
                          setTrips(
                            subbedTrips
                              .slice(0, i)
                              .concat(
                                subbedTrips.slice(i + 1, subbedTrips.length)
                              )
                          );
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItemWithWiderSecondaryAction>
                ))}
            </List>
          </Grid>
        </>
      ) : (
        <>
          <Typography>Sign in to view your trips</Typography>
        </>
      )}
    </Grid>
  );
}
