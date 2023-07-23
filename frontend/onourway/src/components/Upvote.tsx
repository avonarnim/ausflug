import React, { useEffect } from "react";
import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import {
  ArrowUpwardOutlined,
  ArrowDownwardOutlined,
} from "@mui/icons-material";
import { useMutation } from "../core/api";
import { SpotInfoProps } from "./SpotInfo";

// TODO: should have records of what each user has liked --> find initial "added" value from there for user
export function Upvote(props: { spot: SpotInfoProps; userId: string }) {
  const [initialCount, setInitialCount] = React.useState(
    Math.floor(props.spot.popularity ?? 0)
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

    if (props.userId) getVote();
  }, []);

  const toggleIncrement = async () => {
    console.log(props.userId);
    if (props.userId === "" || props.userId === undefined) return;

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
    if (props.userId === "" || props.userId === undefined) return;

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
      {props.userId?.length > 0 ? (
        <IconButton onClick={toggleIncrement}>
          <ArrowUpwardOutlined color={added === 1 ? "success" : "inherit"} />
        </IconButton>
      ) : (
        <Tooltip title="Sign in to vote">
          <IconButton onClick={toggleIncrement}>
            <ArrowUpwardOutlined color={added === 1 ? "success" : "inherit"} />
          </IconButton>
        </Tooltip>
      )}
      <Typography>{initialCount + added}</Typography>
      {props.userId?.length > 0 ? (
        <IconButton onClick={toggleDecrement}>
          <ArrowDownwardOutlined color={added === -1 ? "error" : "inherit"} />
        </IconButton>
      ) : (
        <Tooltip title="Sign in to vote">
          <IconButton onClick={toggleDecrement}>
            <ArrowDownwardOutlined color={added === -1 ? "error" : "inherit"} />
          </IconButton>
        </Tooltip>
      )}
    </Grid>
  );
}

export type SpotInteraction = {
  _id: String;
  spotId: String;
  userId: String;
  value: Boolean;
};
