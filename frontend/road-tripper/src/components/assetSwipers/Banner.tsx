import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import {
  Box,
  BoxProps,
  Card,
  CardActionArea,
  CardMedia,
  CardProps,
  Grid,
  Typography,
} from "@mui/material";
import * as React from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import { Link } from "react-router-dom";
import { Item } from "./Item";

export function AssetBannerCard(props: AssetBannerCardProps): JSX.Element {
  return (
    <Card sx={{ display: "flex", minWidth: 250 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CardMedia component="img" height="75" image={props.banner} alt="" />
        <CardActionArea
          component={Link}
          to={`/${props.type}/${props.id}`}
          style={{ textDecoration: "none", top: -37.5, height: 37.5 }}
        >
          <CardMedia
            component="img"
            image={props.avatar}
            alt=""
            sx={{
              width: 75,
              height: 75,
              borderRadius: "50%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
        </CardActionArea>
        <Typography variant="body1" color="text.primary">
          {props.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.subtitle}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Box p={1} sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="body1" color="text.primary" align="left">
              {props.attribute1}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="left">
              {props.value1}
            </Typography>
          </Box>

          <Box p={1} sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="body1" color="text.primary" align="left">
              {props.attribute2}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="left">
              {props.value2}
            </Typography>
          </Box>
          <Box p={1} sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="body1" color="text.primary" align="left">
              {props.attribute3}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="left">
              {props.value3}
            </Typography>
          </Box>
          <Box p={1} sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="body1" color="text.primary" align="left">
              {props.attribute4}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="left">
              {props.value4}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}

export type AssetBannerCardProps = Omit<CardProps, "children"> & {
  avatar: string;
  banner: string;
  name: string;
  subtitle: string;
  type: string;
  id: string;
  attribute1: string;
  value1: string;
  attribute2: string;
  value2: string;
  attribute3: string;
  value3: string;
  attribute4: string;
  value4: string;
};

export function AssetBannerCardHorizontalSwipe(
  props: AssetBannerCardHorizontalSwipeProps
): JSX.Element {
  const assets = props.assetCards;

  return (
    <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
      {assets.map((_, i) => (
        <Grid item p={1} key={`gridElementWrapper-asset-grid-${i}`}>
          <Item key={`asset-grid-${i}`}>
            <AssetBannerCard
              key={i}
              avatar={assets[i].avatar}
              banner={assets[i].banner}
              name={assets[i].name}
              subtitle={assets[i].subtitle}
              type={assets[i].type}
              id={assets[i].id}
              attribute1={assets[i].attribute1}
              value1={assets[i].value1}
              attribute2={assets[i].attribute2}
              value2={assets[i].value2}
              attribute3={assets[i].attribute3}
              value3={assets[i].value3}
              attribute4={assets[i].attribute4}
              value4={assets[i].value4}
            />
          </Item>
        </Grid>
      ))}
    </ScrollMenu>
  );
}

function Arrow({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled: boolean;
  onClick: VoidFunction;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        right: "1%",
        opacity: disabled ? "0" : "1",
        userSelect: "none",
        padding: 0,
        border: "none",
        background: "none",
      }}
    >
      {children}
    </button>
  );
}

function LeftArrow() {
  const { isFirstItemVisible, scrollPrev } =
    React.useContext(VisibilityContext);

  return (
    <Arrow
      children={<KeyboardArrowLeft />}
      disabled={isFirstItemVisible}
      onClick={() => scrollPrev()}
    />
  );
}

function RightArrow() {
  const { isLastItemVisible, scrollNext } = React.useContext(VisibilityContext);

  return (
    <Arrow
      children={<KeyboardArrowRight />}
      disabled={isLastItemVisible}
      onClick={() => scrollNext()}
    />
  );
}

export type AssetBannerCardHorizontalSwipeProps = Omit<BoxProps, "children"> & {
  assetCards: {
    avatar: string;
    banner: string;
    name: string;
    subtitle: string;
    type: string;
    id: string;
    attribute1: string;
    value1: string;
    attribute2: string;
    value2: string;
    attribute3: string;
    value3: string;
    attribute4: string;
    value4: string;
    [key: string]: any;
  }[];
};
