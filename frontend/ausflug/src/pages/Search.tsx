import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { CustomSearchBar } from "../components/SearchBar";
import { Link } from "react-router-dom";

export default function Search(): JSX.Element {
  return (
    <Container sx={{ height: "100%", p: 2 }}>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={8}>
          <Typography variant="h3">Search for Users & Spots</Typography>
          <Typography variant="body1">
            We have thousands of unique detours, ranging from Michelin-star
            restaurants to Atlas Obscura notables to America's top event venues
          </Typography>
          <Typography variant="body1">
            Also, find your friends and see what they're up to!
          </Typography>
        </Grid>
        <Grid item xs={4} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Box>
            <Link to="/addSpot" style={{ textDecoration: "none" }}>
              <Button variant="contained">Suggest a new stop</Button>
            </Link>
          </Box>
        </Grid>
      </Grid>
      <CustomSearchBar />
    </Container>
  );
}
