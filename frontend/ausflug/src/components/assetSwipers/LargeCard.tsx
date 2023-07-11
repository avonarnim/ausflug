import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import {
  BoxProps,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CardProps,
  Grid,
  Typography,
} from "@mui/material";
import * as React from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import { Link } from "react-router-dom";
import { Item } from "./Item";

export function AssetLargeCard(props: AssetLargeCardProps): JSX.Element {
  return (
    <Card sx={{ display: "flex", minWidth: 250 }}>
      <CardActionArea
        component={Link}
        to={`/${props.type}/${props.id}`}
        style={{ textDecoration: "none" }}
      >
        <CardMedia component="img" height="140" image={props.avatar} alt="" />
        <CardContent>
          <Typography variant="body1" color="text.primary" align="left">
            {props.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="left">
            {props.subtitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="left">
            {props.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export type AssetLargeCardProps = Omit<CardProps, "children"> & {
  avatar: string;
  name: string;
  description: string;
  subtitle: string;
  type: string;
  id: string;
};

export function AssetLargeCardHorizontalSwipe(
  props: AssetLargeCardHorizontalSwipeProps
): JSX.Element {
  const assets = props.assetCards;

  return (
    <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
      {assets.map((_, i) => (
        <Grid item p={1} key={`gridElementWrapper-asset-grid-${i}`}>
          <Item key={`asset-grid-${i}`}>
            <AssetLargeCard
              key={i}
              avatar={assets[i].avatar}
              description={assets[i].description}
              subtitle={assets[i].subtitle}
              name={assets[i].name}
              type={assets[i].type}
              id={assets[i].id}
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

export type AssetLargeCardHorizontalSwipeProps = Omit<BoxProps, "children"> & {
  assetCards: {
    avatar: string;
    name: string;
    description: string;
    subtitle: string;
    type: string;
    id: string;
    [key: string]: any;
  }[];
};
