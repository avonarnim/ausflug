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
import "react-horizontal-scrolling-menu/dist/styles.css";
import { Link } from "react-router-dom";
import { Item } from "./Item";

export function AssetBlockCard(props: AssetBlockCardProps): JSX.Element {
  return (
    <Card sx={{ minWidth: 250 }}>
      <CardActionArea
        component={Link}
        to={`/${props.type}/${props.id}`}
        style={{ textDecoration: "none" }}
      >
        <CardMedia component="img" height="140" image={props.image} alt="" />
        <CardContent>
          <Typography variant="body1" color="text.primary" align="left">
            {props.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="left">
            {props.attribute} {props.value}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export type AssetBlockCardProps = Omit<CardProps, "children"> & {
  image: string;
  title: string;
  type: string;
  id: string;
  attribute: string;
  value: string;
};

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

export function AssetBlockCardHorizontalSwipe(
  props: AssetBlockCardHorizontalSwipeProps
): JSX.Element {
  const assets = props.assetCards;

  console.log("assets", assets);
  console.log(assets.map((_, i) => i));

  return (
    <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
      {assets.map((_, i) => (
        <Grid item p={1} key={`gridElementWrapper-asset-grid-${i}`}>
          <Item key={`asset-grid-${i}`}>
            <AssetBlockCard
              key={i}
              image={assets[i].image}
              title={assets[i].title}
              type={assets[i].type}
              id={assets[i].id}
              attribute={assets[i].attribute}
              value={assets[i].value}
            />
          </Item>
        </Grid>
      ))}
    </ScrollMenu>
  );
}

export type AssetBlockCardHorizontalSwipeProps = Omit<BoxProps, "children"> & {
  assetCards: {
    image: string;
    title: string;
    type: string;
    id: string;
    attribute: string;
    value: string;
    [key: string]: any;
  }[];
};
