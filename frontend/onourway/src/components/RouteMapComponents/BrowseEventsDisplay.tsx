import { EventProps } from "../../pages/Event";
import {
  Avatar,
  Grid,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
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
import { OpenInNew } from "@mui/icons-material";

function statusBeautifier(status: string): string {
  switch (status) {
    case "onsale":
      return "On Sale";
    case "offsale":
      return "Not on Sale";
    default:
      return status;
  }
}

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
              secondaryAction={
                eventResult.externalLink && (
                  <IconButton
                    edge="end"
                    onClick={() =>
                      window.open(eventResult.externalLink, "_blank")
                    }
                  >
                    <OpenInNew />
                  </IconButton>
                )
              }
            >
              <ListItemButton
                onClick={() => {
                  props.map!.setCenter(eventResult.location);
                  props.map!.setZoom(10);
                }}
              >
                <ListItemAvatar>
                  <Avatar alt={eventResult.image} src={eventResult.image} />
                </ListItemAvatar>
                <ListItemText
                  ref={eventRef}
                  primary={eventResult.title}
                  secondary={
                    eventResult.startDate +
                    ", " +
                    statusBeautifier(eventResult.status)
                  }
                ></ListItemText>
              </ListItemButton>
            </ListItem>
          );
          return element;
        })
      : [
          <ListItem>
            No events are available during this time. Try expanding your search
            range
          </ListItem>,
        ];

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
