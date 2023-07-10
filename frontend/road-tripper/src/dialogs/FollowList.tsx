import * as React from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  Typography,
} from "@mui/material";
import { ProfileProps } from "../pages/Profile";
import { useMutation } from "../core/api";
import { useState, useEffect } from "react";
import { useAuth } from "../core/AuthContext";
import profileIcon from "../assets/profileIcon.png";
import { useRecoilSnapshot } from "recoil";
import { useNavigate } from "react-router-dom";

export default function FollowList(props: {
  userId: string;
  users: string[];
  following: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [userProfiles, setUserProfiles] = React.useState<ProfileProps[]>([]);

  const updateProfile = useMutation("UpdateProfile");
  const getProfileList = useMutation("GetProfileList");

  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      const profiles = await getProfileList.commit({
        profileList: props.users,
      });
      setUserProfiles(profiles);
    };
    getProfile();
  }, [props.users]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async (submitting: boolean) => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        {props.users.length} {props.following ? "Following" : "Followers"}
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{props.following ? "Following" : "Followers"}</DialogTitle>
        <DialogContent>
          <List>
            {userProfiles.map((user) => {
              return (
                <ListItem>
                  <ListItemButton
                    onClick={() => navigate(`/profile/${user._id}`)}
                  >
                    <ListItemAvatar>
                      <Avatar src={user.image} />
                    </ListItemAvatar>
                  </ListItemButton>
                  <Typography>{user.username}</Typography>
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
