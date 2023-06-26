import {
  Avatar,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
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
import { TripMarkersMap } from "../components/TripComponents/TripMarkersMap";
import { Edit, Check, AccountCircle, Delete } from "@mui/icons-material";
import TripPostDialog from "../dialogs/TripPostDialog";
import { PlaceFrequencyWidget } from "../components/TripComponents/PlaceFrequencyWidget";

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
});

const ListItemWithWiderSecondaryAction = styled(ListItem)(({ theme }) => ({
  "&.MuiListItem-secondaryAction": {
    paddingRight: 144,
  },
}));

const ListItemWith3SecondaryAction = styled(ListItem)(({ theme }) => ({
  "&.MuiListItem-secondaryAction": {
    paddingRight: 216,
  },
}));

export default function Trips(): JSX.Element {
  const { currentUser, updateUserProfile, setError } = useAuth();
  const [trips, setTrips] = useState<TripProps[]>([]);
  const [incompleteOriginDestinations, setIncompleteOriginDestinations] =
    useState<{ originPlaceIds: string[]; destinationPlaceIds: string[] }>({
      originPlaceIds: [],
      destinationPlaceIds: [],
    });
  const [completeOriginDestinations, setCompleteOriginDestinations] = useState<{
    originPlaceIds: string[];
    destinationPlaceIds: string[];
  }>({
    originPlaceIds: [],
    destinationPlaceIds: [],
  });

  const params = useParams();

  const getUserTrips = useMutation("GetUserTrips");
  const updateTrip = useMutation("UpdateTrip");
  const deleteTrip = useMutation("DeleteTrip");

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

    const incompleteTrips = getUserTripsResponse.filter(
      (trip) => trip.completed == false
    );
    setIncompleteOriginDestinations({
      originPlaceIds: incompleteTrips.map((trip) => trip.originPlaceId),
      destinationPlaceIds: incompleteTrips.map(
        (trip) => trip.destinationPlaceId
      ),
    });

    const completeTrips = getUserTripsResponse.filter(
      (trip) => trip.completed == true
    );
    setCompleteOriginDestinations({
      originPlaceIds: completeTrips.map((trip) => trip.originPlaceId),
      destinationPlaceIds: completeTrips.map((trip) => trip.destinationPlaceId),
    });
  };

  const markTripAsCompleteIncomplete = async (
    trip: TripProps,
    complete: boolean
  ) => {
    let subbedTrips = [...trips];
    for (let i = 0; i < subbedTrips.length; i++) {
      if (subbedTrips[i]._id == trip._id) {
        subbedTrips[i].completed = complete;
        break;
      }
    }
    setTrips(subbedTrips);
    await updateTrip.commit({
      ...trip,
      completed: complete,
      completedAt: complete ? Date.now() : 0,
    });
    // TODO: allow for posts (use TripPostDialog)
    console.log("Would you like to post?");
  };

  const deleteAndRemoveTrip = async (trip: TripProps) => {
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
        .concat(subbedTrips.slice(i + 1, subbedTrips.length))
    );
    await deleteTrip.commit({
      tripId: trip._id,
      creatorId: trip.creatorId,
    });
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
                ?.filter((trip) => trip.completed == false)
                .map((trip) => (
                  <ListItemWith3SecondaryAction
                    key={trip.name + trip._id + "/incomplete"}
                  >
                    {trip.image && (
                      <ListItemAvatar>
                        <Avatar alt={trip.image} src={trip.image} />
                      </ListItemAvatar>
                    )}
                    <ListItemText
                      primary={
                        trip.name +
                        (trip.description ? ": " + trip.description : "")
                      }
                      secondary={trip.originVal + " to " + trip.destinationVal}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        aria-label="complete"
                        onClick={() => markTripAsCompleteIncomplete(trip, true)}
                      >
                        <Check />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => deleteAndRemoveTrip(trip)}
                      >
                        <Delete />
                      </IconButton>
                      <IconButton aria-label="edit">
                        <Link href={`/trips/${trip._id}`}>
                          <Edit />
                        </Link>
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItemWith3SecondaryAction>
                ))}
            </List>
          </Grid>
          <Grid item xs={0} md={6}>
            <TripMarkersMap
              originPlaceIds={incompleteOriginDestinations.originPlaceIds}
              destinationPlaceIds={
                incompleteOriginDestinations.destinationPlaceIds
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5">Completed Trips</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <List>
              {trips
                ?.filter((trip) => trip.completed == true)
                .map((trip) => (
                  <ListItemWith3SecondaryAction
                    key={trip.name + trip._id + "/completed"}
                  >
                    {/* <ListItemWithWiderSecondaryAction key={trip.name + trip._id + "/completed"}> */}
                    {trip.image && (
                      <ListItemAvatar>
                        <Avatar alt={trip.image} src={trip.image} />
                      </ListItemAvatar>
                    )}
                    <ListItemText
                      primary={
                        trip.name +
                        (trip.description ? ": " + trip.description : "")
                      }
                      secondary={trip.originVal + " to " + trip.destinationVal}
                    />
                    <ListItemSecondaryAction>
                      <TripPostDialog tripId={trip._id} />
                      <IconButton
                        aria-label="incomplete"
                        onClick={() =>
                          markTripAsCompleteIncomplete(trip, false)
                        }
                      >
                        <Check />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => deleteAndRemoveTrip(trip)}
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                    {/* </ListItemWithWiderSecondaryAction> */}
                  </ListItemWith3SecondaryAction>
                ))}
            </List>
          </Grid>
          <Grid item xs={0} md={6}>
            <TripMarkersMap
              originPlaceIds={completeOriginDestinations.originPlaceIds}
              destinationPlaceIds={
                completeOriginDestinations.destinationPlaceIds
              }
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography>My most common origins</Typography>
            <PlaceFrequencyWidget
              places={trips.map((trip) => {
                return trip.originVal;
              })}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography>My most common destinations</Typography>
            <PlaceFrequencyWidget
              places={trips.map((trip) => {
                return trip.destinationVal;
              })}
            />
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
