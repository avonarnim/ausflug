import React, { useState, useEffect } from "react";
import { useMutation } from "../core/api";
import { SpotInfoProps } from "../components/SpotInfo";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import AddGasPriceDialog from "../dialogs/AddGasPriceDialog";
import AddGasStationForm from "../forms/AddGasStationForm";

export default function Spot(): JSX.Element {
  const getGasPriceInBox = useMutation("GetGasPriceInBox");
  const getGasStation = useMutation("GetGasStation");
  const getGasStationsInBox = useMutation("GetGasStationsInBox");

  const [avgGasPrices, setAvgGasPrices] = useState<GasPriceProps>();
  const [gasStations, setGasStations] = useState<GasStationProps[]>();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position: GeolocationPosition) => {
          getGasPricesCallback(position);
          getGasStationsCallback(position);
        },
        () => {
          console.log("Unable to retrieve your location");
        }
      );
    }
  }, []);

  const getGasPricesCallback = async (position: GeolocationPosition) => {
    setAvgGasPrices(
      await getGasPriceInBox.commit({
        longitude1: position.coords.longitude + 2,
        latitude1: position.coords.latitude + 2,
        longitude2: position.coords.longitude - 2,
        latitude2: position.coords.latitude - 2,
      })
    );
  };

  const getGasStationsCallback = async (position: GeolocationPosition) => {
    setGasStations(
      await getGasStationsInBox.commit({
        longitude1: position.coords.longitude + 2,
        latitude1: position.coords.latitude + 2,
        longitude2: position.coords.longitude - 2,
        latitude2: position.coords.latitude - 2,
      })
    );
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4">Gas</Typography>
      <Grid container sx={{ marginBottom: 4 }} direction="row">
        <Grid item xs={12} sm={6}>
          <Box
            sx={{
              borderRadius: "5px",
              border: "1px solid black",
              backgroundColor: "white",
              p: 2,
              m: 2,
              color: "black",
            }}
          >
            <Typography variant="h6">
              Average gas price in your area:
            </Typography>
            <Typography>Unleaded: {avgGasPrices?.unleaded}</Typography>
            <Typography>Midgrade: {avgGasPrices?.midgrade}</Typography>
            <Typography>Premium: {avgGasPrices?.premium}</Typography>
            <Typography>Diesel: {avgGasPrices?.diesel}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box
            sx={{
              borderRadius: "5px",
              border: "1px solid black",
              backgroundColor: "white",
              color: "black",
              p: 2,
              m: 2,
            }}
          >
            <Typography variant="h6">
              Best gas stations in your area:
            </Typography>
            <Typography>Add prices to help others & earn points!</Typography>
            {gasStations?.map((station) => {
              return (
                <>
                  <Card sx={{ mb: 1 }}>
                    <CardContent>
                      <Typography variant="body1">{station.name}</Typography>
                      <Typography variant="subtitle2">
                        {station.mapLocation.formatted_address}
                      </Typography>
                      <Typography>
                        Unleaded: {station.resolved_prices.unleaded}
                      </Typography>
                      <Typography>
                        Midgrade: {station.resolved_prices.midgrade}
                      </Typography>
                      <Typography>
                        Premium: {station.resolved_prices.premium}
                      </Typography>
                      <Typography>
                        Diesel: {station.resolved_prices.diesel}
                      </Typography>
                      <AddGasPriceDialog station={station} />
                    </CardContent>
                  </Card>
                </>
              );
            })}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <AddGasStationForm />
        </Grid>
      </Grid>
    </Container>
  );
}

export type GasPriceProps = {
  unleaded: number;
  midgrade: number;
  premium: number;
  diesel: number;
};

export type GasStationProps = {
  _id: string;
  name: string;
  ratings: { userId: string; rating: number }[];
  rating: number;
  number_of_ratings: number;
  mapLocation: {
    formatted_address: string;
    formatted_phone_number: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    place_id: string;
  };
  prices: {
    unleaded: number;
    midgrade: number;
    premium: number;
    diesel: number;
    date: number;
    userId: string;
  }[];
  resolved_prices: {
    unleaded: number;
    midgrade: number;
    premium: number;
    diesel: number;
  };
};
