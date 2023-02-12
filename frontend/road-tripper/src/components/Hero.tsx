import { Box, Button, CardMedia, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import logo250 from "../assets/logo250.png";

export function Hero(): JSX.Element {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          borderRadius: "4px",
          width: "100%",
        }}
        bgcolor="fill.lighter"
        p={4}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box mb={2} mt={2}>
            <Typography variant="h2" align="left">
              Explore the world. Make every trip special.
            </Typography>
          </Box>
          <Box mb={4} mt={2}>
            <Typography align="left">
              Feel like a local on your next trip.
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Box mr={2}>
              <Link to="/" style={{ textDecoration: "none" }}>
                <Button variant="contained">Plan your next trip</Button>
              </Link>
            </Box>
            <Box ml={2}>
              <Link to="/addSpot" style={{ textDecoration: "none" }}>
                <Button variant="contained">Suggest a new stop</Button>
              </Link>
            </Box>
          </Box>
        </Box>
        <Box pl={4} sx={{ display: { xs: "none", sm: "flex" }, flexGrow: 1 }}>
          <CardMedia
            component="img"
            height="200"
            image={logo250}
            sx={{
              height: 300,
              objectFit: "contain",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
