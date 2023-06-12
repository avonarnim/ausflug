import React, { useEffect } from "react";
import { Grid, IconButton, Typography } from "@mui/material";
import {
  ArrowUpwardOutlined,
  ArrowDownwardOutlined,
} from "@mui/icons-material";
import { useMutation } from "../core/api";
import { SpotInfoProps } from "./SpotInfo";

// TODO: should have records of what each user has liked --> find initial "added" value from there for user
export function Upvote(props: { spot: SpotInfoProps; userId: string }) {
  const [initialCount, setInitialCount] = React.useState(
    Math.floor(props.spot.popularity)
  );
  const [added, setAdded] = React.useState(0);

  const updateSpot = useMutation("UpdateSpot");
  const getUserVote = useMutation("GetVote");
  const setUserVote = useMutation("SetVote");

  useEffect(() => {
    const getVote = async () => {
      const userVote = await getUserVote.commit({
        spotId: props.spot._id,
        userId: props.userId,
      });
      setAdded(userVote.value ? 1 : -1);
    };

    getVote();
  }, []);

  const toggleIncrement = async () => {
    setAdded(added === 1 ? 0 : 1);
    await updateSpot.commit({
      ...props.spot,
      popularity: initialCount + added,
    });
    await setUserVote.commit({
      spotId: props.spot._id,
      userId: props.userId,
      value: true,
    });
  };

  const toggleDecrement = async () => {
    setAdded(added === -1 ? 0 : -1);
    await updateSpot.commit({
      ...props.spot,
      popularity: initialCount + added,
    });
    await setUserVote.commit({
      spotId: props.spot._id,
      userId: props.userId,
      value: false,
    });
  };

  return (
    <Grid container alignItems="center" direction="column">
      <IconButton onClick={toggleIncrement}>
        <ArrowUpwardOutlined />
      </IconButton>
      <Typography>{initialCount + added}</Typography>
      <IconButton onClick={toggleDecrement}>
        <ArrowDownwardOutlined />
      </IconButton>
    </Grid>
  );
}

export type SpotInteraction = {
  _id: String;
  spotId: String;
  userId: String;
  value: Boolean;
};
