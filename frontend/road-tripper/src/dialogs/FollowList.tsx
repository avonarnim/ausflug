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
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { ProfileProps } from "../pages/Profile";
import { useMutation } from "../core/api";
import { useState } from "react";
import { useAuth } from "../core/AuthContext";
import profileIcon from "../assets/profileIcon.png";
import { useRecoilSnapshot } from "recoil";

export default function FollowList(props: {
  userId: string;
  users: string[];
  following: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  const updateProfile = useMutation("UpdateProfile");

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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{props.following ? "Following" : "Followers"}</DialogTitle>
        <DialogContent>
          <List>
            {props.users.map((user) => {
              return (
                <ListItem>
                  <Typography>{user}</Typography>
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
