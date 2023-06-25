import * as React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useMutation } from "../core/api";
import { useState } from "react";
import { useAuth } from "../core/AuthContext";
import { PostProps } from "../pages/Feed";
import { PhotoUploader } from "../components/PhotoUploader";
import { ProfileProps } from "../pages/Profile";

export default function TripPostDialog(props: { tripId: string }) {
  const { currentUser } = useAuth();

  const [open, setOpen] = React.useState(false);
  const [imageString, setImageString] = useState<string>("");
  const [postState, setPostState] = React.useState<PostProps>({
    _id: props.tripId,
    authorId: currentUser.uid,
    authorUsername: "",
    authorImage: "",
    images: [],
    caption: "",
    comments: [],
    likes: [],
    createdAt: new Date().getTime(),
  });
  const [successfulEdit, setSuccessfulEdit] = React.useState(false);
  const [profile, setProfile] = React.useState<ProfileProps>({
    _id: "",
    name: "",
    username: "",
    email: "",
    image: "",
    bio: "",
    followers: [],
    following: [],
    savedTripIDs: [],
    upcomingTripsID: [],
    savedSpots: [],
    instagram: "",
    facebook: "",
    twitter: "",
    youtube: "",
    createdAt: 0,
  });

  const createPost = useMutation("CreatePost");
  const getProfile = useMutation("GetProfile");

  React.useEffect(() => {
    if (currentUser.uid) {
      getProfile.commit({ profileId: currentUser.uid }).then((profile) => {
        setProfile(profile);
      });
    }
  }, [currentUser]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async (submitting: boolean) => {
    if (submitting) {
      const createRes = await createPost.commit({
        ...postState,
        images: [imageString],
        authorUsername: profile.username,
        authorImage: profile.image,
      });
      setSuccessfulEdit(true && createRes);
    }
    setOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handling change", event.target.name, event.target.value);
    setPostState({
      ...postState,
      [event.target.name]: event.target.value,
    });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setImageString(event.target.value);
    } catch (err) {
      console.log("error handling change", err);
    }
  };

  return (
    <div>
      <Button onClick={handleClickOpen}>Post</Button>
      <Dialog open={open} onClose={handleClose}>
        {successfulEdit ? (
          <>
            <DialogContent>
              <DialogContentText>We've got your post!</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleClose(false)}>Cancel</Button>
              <Button onClick={() => handleClose(true)}>Submit</Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>Post</DialogTitle>
            <DialogContent>
              <PhotoUploader
                id={currentUser.uid + "/trips/" + props.tripId}
                setImageString={handleImageChange}
              />
              <TextField
                autoFocus
                margin="dense"
                id="caption"
                label="caption"
                type="text"
                fullWidth
                variant="standard"
                placeholder="caption"
                name="caption"
                onChange={handleChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleClose(false)}>Cancel</Button>
              <Button onClick={() => handleClose(true)}>Post</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}
