import { Container, Typography } from "@mui/material";
import { Hero } from "../components/Hero";
import { RouteMap } from "../components/RouteMap";

export default function Home(): JSX.Element {
  return (
    <Container>
      <Hero />
      <RouteMap />
    </Container>
  );
}
