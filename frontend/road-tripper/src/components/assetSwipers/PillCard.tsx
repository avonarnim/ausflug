import { Masonry } from "@mui/lab";
import {
  Box,
  BoxProps,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CardProps,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Item } from "./Item";

export function AssetPillCard(props: AssetPillCardProps): JSX.Element {
  return (
    <Card sx={{ display: "flex" }}>
      <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
        <CardActionArea
          component={Link}
          to={`/${props.type}/${props.id}`}
          style={{ textDecoration: "none" }}
        >
          <CardMedia
            component="img"
            image={props.avatar}
            alt=""
            sx={{ borderRadius: 1, width: 75, height: 75 }}
          />
        </CardActionArea>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent>
          <Typography variant="body1" color="text.primary" align="left">
            {props.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="left">
            {props.attribute1} {props.value1}
          </Typography>
        </CardContent>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent>
          <Typography variant="body1" color="text.primary" align="left">
            {props.attribute2} {props.value2}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="left">
            {props.attribute3} {props.value3}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
}

export type AssetPillCardProps = Omit<CardProps, "children"> & {
  avatar: string;
  name: string;
  type: string;
  id: string;
  attribute1: string;
  value1: string;
  attribute2: string;
  value2: string;
  attribute3: string;
  value3: string;
};

export function AssetPillGrid(props: AssetPillGridProps): JSX.Element {
  const assets = props.assetCards;

  return (
    <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
      {assets.map((_, i) => (
        <Item key={`asset-grid-${i}`}>
          {/* {JSON.stringify(assets[i])} */}
          <AssetPillCard
            key={i}
            avatar={assets[i].avatar}
            name={assets[i].name}
            type={assets[i].type}
            id={assets[i].id}
            attribute1={assets[i].attribute1}
            value1={assets[i].value1}
            attribute2={assets[i].attribute2}
            value2={assets[i].value2}
            attribute3={assets[i].attribute3}
            value3={assets[i].value3}
          />
        </Item>
      ))}
    </Masonry>
  );
}

type AssetPillGridProps = Omit<BoxProps, "children"> & {
  assetCards: AssetPillCardProps[];
};
