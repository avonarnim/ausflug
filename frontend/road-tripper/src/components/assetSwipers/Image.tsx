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
import "../../styles/AssetCard.css";

export function AssetImageCard(props: AssetImageCardProps): JSX.Element {
  return (
    <Card sx={{ minWidth: 200 }}>
      <CardActionArea style={{ textDecoration: "none" }}>
        <CardMedia
          component="img"
          height="250px"
          width="auto"
          image={props.image}
          alt=""
        />
      </CardActionArea>
    </Card>
  );
}

export function SkeletonAssetImageCard(): JSX.Element {
  return (
    <Card sx={{}}>
      <div className="postSk">
        <div className="postSkImg"></div>
      </div>
    </Card>
  );
}

export type AssetImageCardProps = Omit<CardProps, "children"> & {
  image: string;
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

export function AssetImageCardHorizontalSwipe(
  props: AssetImageCardHorizontalSwipeProps
): JSX.Element {
  const assets = props.assetCards;

  return (
    <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
      {assets.map((_, i) => (
        <Grid item p={1} key={`gridElementWrapper-asset-grid-${i}`}>
          <Item key={`asset-grid-${i}`}>
            <AssetImageCard key={i} image={assets[i].image} />
          </Item>
        </Grid>
      ))}
    </ScrollMenu>
  );
}

export function SkeletonAssetImageCardHorizontalSwipe(): JSX.Element {
  return (
    <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
      {[1, 2, 3, 4, 5].map((_, i) => (
        <Grid item p={1} key={`gridElementWrapper-asset-grid-${i}`}>
          <Item key={`asset-grid-${i}`}>
            <SkeletonAssetImageCard />
          </Item>
        </Grid>
      ))}
    </ScrollMenu>
  );
}

export type AssetImageCardHorizontalSwipeProps = Omit<BoxProps, "children"> & {
  assetCards: {
    image: string;
  }[];
};
