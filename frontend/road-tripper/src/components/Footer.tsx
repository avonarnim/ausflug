import { Box, TextField, Typography } from "@mui/material";

export function Footer(): JSX.Element {
  return (
    <Box bgcolor="fill.lighter" mt={4} pl="auto" pr="auto">
      <Box sx={{ flexWrap: "wrap" }}>
        <Box
          sx={{ display: "inline-flex", flexDirection: "column" }}
          pl={4}
          pr={4}
          pt={2}
          pb={2}
        >
          <Typography variant="h6">Planner</Typography>
          <Typography>Home</Typography>
          <Typography>Events</Typography>
          <Typography>About</Typography>
          <Typography>FAQ</Typography>
        </Box>
        <Box
          sx={{ display: "inline-flex", flexDirection: "column" }}
          pl={4}
          pr={4}
          pt={2}
          pb={2}
        >
          <Typography variant="h6">Links</Typography>
          <Typography>Terms of Use</Typography>
          <Typography>Privacy Policy</Typography>
        </Box>
        <Box
          sx={{ display: "inline-flex", flexDirection: "column" }}
          pl={4}
          pr={4}
          pt={2}
          pb={2}
        >
          <Typography variant="h6">Join Us</Typography>
          <Typography>Twitter</Typography>
          <Typography>Instagram</Typography>
          <Typography>Discord</Typography>
        </Box>
        <Box
          sx={{ display: "inline-flex", flexDirection: "column" }}
          pl={4}
          pr={4}
          pt={2}
          pb={2}
        >
          <Typography variant="h6">Stay in the Loop</Typography>
          <TextField id="outlined-basic" label="Email Us" variant="outlined" />
        </Box>
      </Box>

      <Typography p={4}>Copyright Road Tripper</Typography>
    </Box>
  );
}
