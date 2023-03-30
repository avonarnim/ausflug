import { MapQueueSpotForm } from "../forms/MapQueueSpot";
import { QueueSpotForm } from "../forms/QueueSpot";
import { Box, Typography } from "@mui/material";

export default function AddSpot(): JSX.Element {
  return (
    <Box p={4}>
      <Typography>
        Use this form to help us add more unique, exciting spots!
      </Typography>
      {/* <QueueSpotForm /> */}
      <MapQueueSpotForm />
    </Box>
  );
}
