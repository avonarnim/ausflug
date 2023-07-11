import {
  Avatar,
  Grid,
  Input,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { categoryToIcon } from "../../core/util";
import { createRef, useState } from "react";
import { SpotInfoProps } from "../SpotInfo";
import FuzzySearch from "fuzzy-search";

export function BrowseSpotsDisplay(props: {
  spots: SpotInfoProps[];
  addSpotToRoute: (spot: SpotInfoProps) => void;
  map: google.maps.Map | undefined;
}): JSX.Element {
  // #region search

  const [spotQuery, setSpotQuery] = useState("");

  // const [eventQuery, setEventQuery] = useState("");
  // const [selectedQuery, setSelectedQuery] = useState("");
  const spotSearch = new FuzzySearch(props.spots, ["title", "description"], {});
  // const eventSearch = new FuzzySearch(
  //   savedEvents,
  //   ["title", "description"],
  //   {}
  // );
  // const selectedSearch = new FuzzySearch(
  //   chosenDetours,
  //   ["title", "description"],
  //   {}
  // );

  // useEffect(() => {
  //   const filteredSpots = spotSearch.search(spotQuery);
  //   // const eventsResult = eventSearch.search(eventQuery);
  //   // const selectedSpotsResult = selectedSearch.search(selectedQuery);
  //   // }, [spotQuery, eventQuery, selectedQuery]);
  // }, [spotQuery]);

  const filteredSpots = spotSearch.search(spotQuery);

  // #endregion

  const wayPointElements = filteredSpots.map((spotResult: SpotInfoProps) => {
    const waypointRef = createRef<HTMLDivElement>();

    const element = (
      <ListItem
        key={
          spotResult.title +
          spotResult._id +
          spotResult.location.lat +
          spotResult.location.lng +
          "_BrowseWaypoint"
        }
        secondaryAction={
          <IconButton
            edge="end"
            onClick={() => props.addSpotToRoute(spotResult)}
          >
            <Add />
          </IconButton>
        }
      >
        <ListItemButton
          onClick={() => {
            props.map!.setCenter(spotResult.location);
            props.map!.setZoom(10);
          }}
        >
          <ListItemAvatar>
            <Avatar
              alt={spotResult.title}
              src={spotResult.images[0]}
              variant="square"
              sizes="large"
            />
          </ListItemAvatar>
          <ListItemText
            ref={waypointRef}
            primary={spotResult.title}
            secondary={spotResult.description}
          ></ListItemText>
        </ListItemButton>
      </ListItem>
    );
    return element;
  });

  return (
    <Grid item container direction="column" xs={12} sm={6} md={4} sx={{ p: 4 }}>
      <Grid item>
        <Typography>Browse Stops</Typography>

        <Input
          type="text"
          fullWidth
          placeholder="Search..."
          onChange={(event) => {
            setSpotQuery(event.target.value);
          }}
        />
      </Grid>
      <Grid item mt={1}>
        <Paper style={{ height: 300, overflow: "auto" }}>
          <List dense sx={{ width: "100%" }}>
            {wayPointElements.length === 0 ? (
              <ListItem>Loading...</ListItem>
            ) : (
              wayPointElements
            )}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
}
