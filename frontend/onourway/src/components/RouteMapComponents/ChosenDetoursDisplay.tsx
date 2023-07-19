import {
  Grid,
  Typography,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Paper,
  Button,
  Input,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { categoryToIcon } from "../../core/util";
import FuzzySearch from "fuzzy-search";
import { useState } from "react";

export function ChosenDetoursDisplay(props: {
  savedSpots: any[];
  chosenDetours: any[];
  originRef: any;
  originPlace: any;
  destinationRef: any;
  destinationPlace: any;
  map: any;
  daysDriving: number;
  removeSpotFromRoute: (index: number) => void;
  setChosenDetours: (detours: any[]) => void;
}): JSX.Element {
  // finds ~10 random spots within the bounding box of the route
  function generateRandomRoute() {
    if (
      props.originPlace &&
      props.originPlace.geometry &&
      props.originPlace.geometry.location &&
      props.destinationPlace &&
      props.destinationPlace.geometry &&
      props.destinationPlace.geometry.location
    ) {
      const lat1 = props.originPlace.geometry.location.lat();
      const lng1 = props.originPlace.geometry.location.lng();
      const lat2 = props.destinationPlace.geometry.location.lat();
      const lng2 = props.destinationPlace.geometry.location.lng();

      const inRange = props.savedSpots.filter((spot) => {
        const insideLat =
          (spot.location.lat > lat1 && spot.location.lat < lat2) ||
          (spot.location.lat < lat1 && spot.location.lat > lat2);
        const insideLng =
          (spot.location.lng > lng1 && spot.location.lng < lng2) ||
          (spot.location.lng < lng1 && spot.location.lng > lng2);
        return insideLat && insideLng;
      });

      const idealNumberOfSpots = props.daysDriving * 4;
      const necessaryProbability = idealNumberOfSpots / inRange.length;

      const randomChoice = inRange
        .filter((spot) => {
          return Math.random() > necessaryProbability;
        })
        .slice(0, idealNumberOfSpots);

      props.setChosenDetours(randomChoice);
    }
  }

  // #region search
  const [detourQuery, setDetourQuery] = useState("");
  const detourSearch = new FuzzySearch(
    props.chosenDetours,
    ["title", "description"],
    {}
  );
  const filteredDetours = detourSearch.search(detourQuery);
  // #endregion

  return (
    <Grid item container direction="column" xs={12} sm={6} md={4} sx={{ p: 4 }}>
      <Grid item>
        <Typography>Selected Detours</Typography>
        <Input
          type="text"
          fullWidth
          onChange={(event) => {
            setDetourQuery(event.target.value);
          }}
        />
      </Grid>
      <Grid item mt={1}>
        <Paper style={{ height: 300, overflow: "auto", maxWidth: 360 }}>
          {props.chosenDetours.length === 0 &&
          props.originRef.current?.value === "" &&
          props.destinationRef.current?.value === "" ? (
            <Box sx={{ p: 2 }}>
              <Typography>No detours selected</Typography>
              <Typography>
                Enter an origin and destination to get recommendations
              </Typography>
            </Box>
          ) : props.chosenDetours.length === 0 ? (
            <Box sx={{ p: 2 }}>
              <Typography>No detours selected</Typography>
              <Button onClick={generateRandomRoute}>Choose for me</Button>
            </Box>
          ) : (
            <List
              dense
              sx={{
                width: "100%",
              }}
            >
              {filteredDetours.map((detour, index) => {
                console.log("mapping", index, detour.title);
                return (
                  <ListItem
                    key={detour._id + "_chosenDetour" + index}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="comments"
                        onClick={() => props.removeSpotFromRoute(index)}
                      >
                        <Delete />
                      </IconButton>
                    }
                  >
                    <ListItemButton
                      onClick={() => {
                        props.map?.setCenter(detour.location);
                        props.map?.setZoom(14);
                      }}
                    >
                      <ListItemIcon>
                        {categoryToIcon(detour.category)}
                      </ListItemIcon>
                      <ListItemText
                        primary={detour.title}
                        secondary={detour.description}
                      ></ListItemText>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}
