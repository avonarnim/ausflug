import { Box, Link, TextField, Typography } from "@mui/material";
import { Link as NavLink } from "react-router-dom";
import FeedbackDialog from "../dialogs/FeedbackDialog";

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
            <Link color="inherit" underline="none" to="/" component={NavLink}>
              Home
            </Link>
            <Link
              color="inherit"
              underline="none"
              to="/about"
              component={NavLink}
            >
              About
            </Link>
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
        </Box>

        <Typography p={4}>Copyright Ausflug</Typography>
        <FeedbackDialog />
      </Box>
    </footer>
  );
}
