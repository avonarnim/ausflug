import React from "react";
import { Grid, IconButton, Typography } from "@mui/material";
import {
  ArrowUpwardOutlined,
  ArrowDownwardOutlined,
} from "@mui/icons-material";

export function Upvote() {
  const [count, setCount] = React.useState(0);
  const [addend, setAddend] = React.useState(0);

  const toggleIncrement = () => {
    setAddend(addend === 1 ? 0 : 1);
  };

  const toggleDecrement = () => {
    setAddend(addend === -1 ? 0 : -1);
  };

  return (
    <Grid container alignItems="center" direction="column">
      <IconButton onClick={toggleIncrement}>
        <ArrowUpwardOutlined />
      </IconButton>
      <Typography>{count + addend}</Typography>
      <IconButton onClick={toggleDecrement}>
        <ArrowDownwardOutlined />
      </IconButton>
    </Grid>
  );
}
