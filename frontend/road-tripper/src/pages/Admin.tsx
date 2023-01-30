import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

export function QueuedSpots(): JSX.Element {
  const queuedSpots = [
    {
      title: "The Spot",
      description: "This is a spot",
      location: {
        latitude: 0,
        longitude: 0,
      },
    },
  ];

  return (
    <Container>
      <List>
        {queuedSpots.map((spot) => {
          return (
            <ListItem>
              <ListItemText primary={spot.title} secondary={spot.description} />
              <Typography>
                {spot.location.latitude} {spot.location.longitude}
              </Typography>
            </ListItem>
          );
        })}
      </List>
    </Container>
  );
}

export default function Admin(): JSX.Element {
  return (
    <div>
      <Typography variant="h1">Admin</Typography>
      <Typography>This page will display queued spots</Typography>
      <QueuedSpots />
    </div>
  );
}
