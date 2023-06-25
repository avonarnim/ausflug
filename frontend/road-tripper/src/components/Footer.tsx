import { Box, Link, TextField, Typography } from "@mui/material";
import { Link as NavLink } from "react-router-dom";

export function Footer(): JSX.Element {
  return (
    <footer>
      <Box
        mt={4}
        bgcolor="fill.lighter"
        pl="auto"
        pr="auto"
        sx={{
          width: "100%",
        }}
      >
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
            <Link
              color="inherit"
              underline="none"
              to="/terms"
              component={NavLink}
            >
              Terms of Use
            </Link>
            <Link
              color="inherit"
              underline="none"
              to="/privacy"
              component={NavLink}
            >
              Privacy Policy
            </Link>
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
            <TextField
              id="outlined-basic"
              label="Email Us"
              variant="outlined"
            />
          </Box>
        </Box>

        <Typography p={4}>Copyright Road Tripper</Typography>
      </Box>
    </footer>
  );
}
