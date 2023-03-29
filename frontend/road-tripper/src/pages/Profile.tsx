import { Button, Card, CardMedia, Grid, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../core/AuthContext";
import logo250 from "../assets/logo250.png";
import { useMutation } from "../core/api";
import ProfileFormDialog from "../dialogs/EditProfileDialog";

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

  const params = useParams();

  const getProfile = useMutation("GetProfile");
  const updateProfile = useMutation("UpdateProfile");

  useEffect(() => {
    console.log("params", params);
    if (!params.userId) {
      console.log("no user id");
    } else {
      console.log("getting spot");
      setUserId(params.userId);
      getProfileCallback(params.userId);
    }
  }, []);

  const getProfileCallback = async (userId: string) => {
    const getUserResponse = await getProfile.commit({ profileId: userId });
    setUser(getUserResponse);
    console.log("profile set", getUserResponse);
  };

  const instagramLink =
    props.instagram === "" ? null : (
      <Grid item>
        <Link href={props.instagram}>
          <Img
            sx={{ width: 24, height: 24 }}
            alt="Instagram"
            src="https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Instagram_colored_svg_1-1024.png"
          />
        </Link>
      </Grid>
    );

  const twitterLink =
    props.twitter === "" ? null : (
      <Grid item>
        <Link href={props.twitter}>
          <Img
            sx={{ width: 24, height: 24 }}
            alt="Twitter"
            src="https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Twitter_colored_svg-1024.png"
          />
        </Link>
      </Grid>
    );

  const youtubeLink =
    props.youtube === "" ? null : (
      <Grid item>
        <Link href={props.youtube}>
          <Img
            sx={{ width: 24, height: 24 }}
            alt="YouTube"
            src="https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Youtube_colored_svg-1024.png"
          />
        </Link>
      </Grid>
    );

  const facebookLink =
    props.facebook === "" ? null : (
      <Grid item>
        <Link href={props.facebook}>
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
              <Card sx={{ maxWidth: 345, minWidth: 240 }}>
                <CardMedia
                  component="img"
                  height="100%"
                  image={props.avatar}
                  alt="Profile Photo"
                  sx={{
                    height: 300,
                    objectFit: "contain",
                  }}
                />
              </Card>
            </Grid>
            <Grid item>{user ? <ProfileFormDialog {...user} /> : null}</Grid>
          </Grid>
        </Grid>
        <Grid item xs sx={{ minWidth: 450 }}>
          <Typography gutterBottom variant="h4" component="div">
            {props.name}
          </Typography>
          <Grid container direction="row" spacing={2} sx={{ pb: 4 }}>
            {facebookLink}
            {youtubeLink}
            {instagramLink}
            {twitterLink}
          </Grid>
        </Grid>
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
