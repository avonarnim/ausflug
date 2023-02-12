import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useMutation } from "../core/api";
import { SpotInfoProps } from "../components/SpotInfo";
import { Box, Container, Typography } from "@mui/material";

export default function Spot(): JSX.Element {
  const params = useParams();
  const [spotId, setSpotId] = useState("");
  const [spot, setSpot] = useState<SpotInfoProps>();

  const getSpot = useMutation("GetSpot");

  useEffect(() => {
    console.log("params", params);
    if (!params.spotId) {
      console.log("no spot id");
    } else {
      console.log("getting spot");
      setSpotId(params.spotId);
      getSpotCallback(params.spotId);
    }
  }, []);

  const getSpotCallback = async (spotId: string) => {
    const getSpotResponse = await getSpot.commit({ spotId: spotId });
    setSpot(getSpotResponse);
    console.log("spot set", getSpotResponse);
  };

  return spot ? (
    <Container sx={{ marginTop: 10 }}>
      <Box>
        <Typography>{spot.name}</Typography>
        <Typography>{spot.description}</Typography>
        <Typography>{spot.category}</Typography>
      </Box>
    </Container>
  ) : (
    <Container>
      <Box>
        <Typography>loading</Typography>
      </Box>
    </Container>
  );
}
