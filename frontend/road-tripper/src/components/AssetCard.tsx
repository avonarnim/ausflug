import {
  Avatar,
  Box,
  BoxProps,
  Card,
  CardActionArea,
  CardMedia,
  CardProps,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import * as React from "react";
import { Link } from "react-router-dom";
import "../styles/AssetCard.css";

const useStyles = makeStyles({
  multiLineEllipsisTitle: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
    fontWeight: 600,
    lineHeight: 1.4,
  },
  multiLineEllipsisDescription: {
    mb: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 3,
    "-webkit-box-orient": "vertical",
  },
});

export function AssetCard(props: AssetCardProps): JSX.Element {
  const classes = useStyles();

  return (
    <Card variant="outlined" sx={{ m: 0 }}>
      <CardActionArea
        component={Link}
        to={`/spots/${props.id}`}
        style={{ textDecoration: "none", textAlign: "left" }}
      >
        <Grid container>
          <Grid item xs={3}>
            <Box sx={{ p: 1, height: "100%" }}>
              <CardMedia
                component="img"
                sx={{
                  borderRadius: 1,
                  height: "100%",
                }}
                image={props.image}
                alt=""
              />
            </Box>
          </Grid>
          <Grid item xs={8}>
            <Box
              sx={{
                p: 1,
                pt: 2,
              }}
            >
              <Typography
                variant="subtitle1"
                className={classes.multiLineEllipsisTitle}
              >
                {props.title}
              </Typography>
              <Typography
                mt={1}
                mb={1}
                variant="body2"
                color="text.secondary"
                className={classes.multiLineEllipsisDescription}
              >
                {props.description}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardActionArea>
    </Card>
  );
}

export function LoadingAssetCard(): JSX.Element {
  return (
    <Card variant="outlined" sx={{ m: 0 }}>
      <div className="postSk">
        <div className="postSkImg"></div>
        <div className="postSkInfo">
          <div className="postSkDetail">
            <div className="postSkText"></div>
            <div className="postSkText sm"></div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export type AssetCardProps = Omit<CardProps, "children"> & {
  image: string;
  description: string;
  id: string;
  title: string;
};
