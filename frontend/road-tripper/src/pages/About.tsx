import { Container, Link, Typography } from "@mui/material";
import { usePageEffect } from "../core/page";

/**
 * Generated by https://getterms.io
 */
export default function About(): JSX.Element {
  usePageEffect({ title: "About" });

  return (
    <Container
      maxWidth="sm"
      sx={{ marginTop: (x) => x.spacing(3), marginBottom: (x) => x.spacing(3) }}
    >
      <Typography variant="h1" gutterBottom>
        About Road Tripper
      </Typography>
      <Typography></Typography>
    </Container>
  );
}
