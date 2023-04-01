import {
  Button,
  Card,
  CardMedia,
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
import { useParams } from "react-router-dom";
import { useAuth } from "../core/AuthContext";
import logo250 from "../assets/logo250.png";
import { useMutation } from "../core/api";
import ProfileFormDialog from "../dialogs/EditProfileDialog";
import { TripProps } from "./EditTrip";
import { Edit, AccountCircle } from "@mui/icons-material";

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
});

export default function Profile(): JSX.Element {
  const { currentUser, updateUserProfile, setError } = useAuth();
  const props = {
    name: currentUser?.displayName,
    email: currentUser?.email,
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    twitter: "https://twitter.com/",
    youtube: "https://www.youtube.com/",
    avatar: logo250,
  };
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState<ProfileProps | null>(null);
  const [trips, setTrips] = useState<TripProps[] | null>(null);

  const params = useParams();

  const getProfile = useMutation("GetProfile");
  const updateProfile = useMutation("UpdateProfile");
  const getUserTrips = useMutation("GetUserTrips");

  useEffect(() => {
    console.log("params", params, currentUser?.uid);
    if ((!params.userId && currentUser) || params.userId === currentUser?.uid) {
      console.log("getting own profile");
      setUserId(currentUser.uid);
      getProfileCallback(currentUser.uid);
      getTripsCallback(currentUser.uid);
    } else if (params.userId) {
      console.log("getting profile");
      setUserId(params.userId);
      getProfileCallback(params.userId);
    } else {
      console.log("no user");
    }
  }, []);

  const getProfileCallback = async (userId: string) => {
    const getUserResponse = await getProfile.commit({ profileId: userId });
    setUser(getUserResponse);
    console.log("profile set", getUserResponse);
  };

  const getTripsCallback = async (userId: string) => {
    const getUserTripsResponse = await getUserTrips.commit({
      userId: userId,
    });
    setTrips(getUserTripsResponse);
    console.log("trips set", getUserTripsResponse);
  };

  const instagramLink =
    user?.instagram === "" ? null : (
      <Grid item>
        <Link href={user?.instagram}>
          <Img
            sx={{ width: 24, height: 24 }}
            alt="Instagram"
            src="https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Instagram_colored_svg_1-1024.png"
          />
        </Link>
      </Grid>
    );

  const twitterLink =
    user?.twitter === "" ? null : (
      <Grid item>
        <Link href={user?.twitter}>
          <Img
            sx={{ width: 24, height: 24 }}
            alt="Twitter"
            src="https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Twitter_colored_svg-1024.png"
          />
        </Link>
      </Grid>
    );

  const youtubeLink =
    user?.youtube === "" ? null : (
      <Grid item>
        <Link href={user?.youtube}>
          <Img
            sx={{ width: 24, height: 24 }}
            alt="YouTube"
            src="https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Youtube_colored_svg-1024.png"
          />
        </Link>
      </Grid>
    );

  const facebookLink =
    user?.facebook === "" ? null : (
      <Grid item>
        <Link href={user?.facebook}>
          <Img
            sx={{ width: 24, height: 24 }}
            alt="Facebook"
            src="https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Facebook_colored_svg_copy-1024.png"
          />
        </Link>
      </Grid>
    );

  return (
    <Grid item container xs direction="row" sx={{ pb: 4, mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              {user ? (
                <Card sx={{ maxWidth: 345, minWidth: 240 }}>
                  <CardMedia
                    component="img"
                    height="100%"
                    image={user?.image}
                    alt="Profile Photo"
                    sx={{
                      height: 300,
                      objectFit: "contain",
                    }}
                  />
                </Card>
              ) : (
                <AccountCircle />
              )}
            </Grid>
            <Grid item>{user ? <ProfileFormDialog {...user} /> : null}</Grid>
          </Grid>
        </Grid>
        <Grid item xs sx={{ minWidth: 450 }}>
          <Typography gutterBottom variant="h4" component="div">
            {user?.name}
          </Typography>
          <Typography gutterBottom variant="h5" component="div">
            @{user?.username}
          </Typography>
          <Typography gutterBottom variant="body1" component="div">
            {user?.bio}
          </Typography>
          <Typography variant="body1">
            {user?.followers.length} Followers
          </Typography>
          <Typography variant="body1">
            {user?.following.length} Following
          </Typography>
          <Grid container direction="row" spacing={2} sx={{ pb: 4 }}>
            {facebookLink}
            {youtubeLink}
            {instagramLink}
            {twitterLink}
          </Grid>
        </Grid>
        {(currentUser && !params.userId) || currentUser.uid == params.userId ? (
          <Grid item xs={12}>
            <Typography variant="h5">Saved Trips</Typography>
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
                  <ListItemText primary={trip.name} />
                </ListItem>
              ))}
            </List>
          </Grid>
        ) : (
          <></>
        )}
        {(currentUser && !params.userId) || currentUser.uid == params.userId ? (
          <Grid item xs={12}>
            <Typography variant="h5">Saved Spots</Typography>
            <List>
              {user?.savedSpots.map((spot) => (
                <ListItem
                  key={spot}
                  secondaryAction={
                    <IconButton edge="end" aria-label="edit">
                      <Link href={`/spots/${spot}`}>
                        <Edit />
                      </Link>
                    </IconButton>
                  }
                >
                  <ListItemText primary={spot} />
                </ListItem>
              ))}
            </List>
          </Grid>
        ) : (
          <></>
        )}
      </Grid>
    </Grid>
  );
}

export type ProfileProps = {
  _id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  image: string;
  following: string[];
  followers: string[];
  savedTripIDs: string[];
  upcomingTripsID: string[];
  savedSpots: string[];
  instagram: string;
  facebook: string;
  twitter: string;
  youtube: string;
};
