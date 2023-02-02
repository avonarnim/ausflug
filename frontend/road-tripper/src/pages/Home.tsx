import { Container, Typography } from "@mui/material";
import { Hero } from "../components/Hero";
import { RouteMap } from "../components/RouteMap";
import { SearchBar } from "../components/SearchBar";

export default function Home(): JSX.Element {
  return (
    <Container>
      <Hero />
      <Typography>Search for a Spot</Typography>
      <SearchBar />
      <RouteMap />
    </Container>
  );
}
