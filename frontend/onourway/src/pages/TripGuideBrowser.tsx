import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function TripGuideBrowser(): JSX.Element {
  return (
    <Container sx={{ height: "100%", p: 2 }}>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={8}>
          <Typography variant="h3">
            Search for pre-made travel guides
          </Typography>
          <Link
            to="/guide/New-York-to-Philadelphia"
            style={{ textDecoration: "none" }}
          >
            <Button variant="contained">New-York-to-Philadelphia</Button>
          </Link>
          <Link
            to="/guide/New-York-to-Boston"
            style={{ textDecoration: "none" }}
          >
            <Button variant="contained">New-York-to-Boston</Button>
          </Link>
          <Link
            to="/guide/New-York-to-Washington-DC"
            style={{ textDecoration: "none" }}
          >
            <Button variant="contained">New-York-to-Washington-DC</Button>
          </Link>
          <Link
            to="/guide/New-York-to-Atlanta"
            style={{ textDecoration: "none" }}
          >
            <Button variant="contained">New-York-to-Atlanta</Button>
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
}
