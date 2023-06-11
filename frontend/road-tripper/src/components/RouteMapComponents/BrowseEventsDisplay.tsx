import { EventProps } from "../../pages/Event";
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
import { createRef, useState } from "react";
import { SpotInfoProps } from "../SpotInfo";
import FuzzySearch from "fuzzy-search";

export function BrowseEventsDisplay(props: {
  events: EventProps[];
  map: google.maps.Map | undefined;
}): JSX.Element {
  // #region search
  const [eventQuery, setEventQuery] = useState("");
  const eventSearch = new FuzzySearch(
    props.events,
    ["title", "description"],
    {}
  );
  const filteredEvents = eventSearch.search(eventQuery);
  // #endregion

  const eventElements =
    props.events.length > 0
      ? filteredEvents.map((eventResult: EventProps) => {
          const eventRef = createRef<HTMLDivElement>();

          const element = (
            <ListItem
              key={
                eventResult.title +
                eventResult._id +
                eventResult.endDate.toString() +
                "_event"
              }
              // secondaryAction={
              //   <IconButton edge="end" onClick={() => addEventToRoute(eventResult)}>
              //     <Add />
              //   </IconButton>
              // }
            >
              <ListItemButton
                onClick={() => {
                  props.map!.setCenter(eventResult.location);
                  props.map!.setZoom(10);
                }}
              >
                <ListItemText
                  ref={eventRef}
                  primary={eventResult.title}
                  secondary={eventResult.description}
                ></ListItemText>
              </ListItemButton>
            </ListItem>
          );
          return element;
        })
      : [<ListItem>No events are available during this time</ListItem>];

  return (
    <Grid item container direction="column" xs={12} sm={6} md={4} sx={{ p: 4 }}>
      <Grid item>
        <Typography>Browse Events</Typography>
        <Input
          type="text"
          fullWidth
          onChange={(event) => {
            setEventQuery(event.target.value);
          }}
        />
      </Grid>
      <Grid item mt={1}>
        <Paper style={{ height: 300, overflow: "auto", maxWidth: 360 }}>
          <List dense sx={{ width: "100%" }}>
            {eventElements.length === 0 ? (
              <ListItem>Loading...</ListItem>
            ) : (
              eventElements
            )}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
}
