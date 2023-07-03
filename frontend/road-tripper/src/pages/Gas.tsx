import React, { useState, useEffect } from "react";
import { useMutation } from "../core/api";
import { SpotInfoProps } from "../components/SpotInfo";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import AddGasPriceDialog from "../dialogs/AddGasPriceDialog";

export default function Spot(): JSX.Element {
  const getGasPriceInBox = useMutation("GetGasPriceInBox");
  const getGasStation = useMutation("GetGasStation");
  const getGasStationsInBox = useMutation("GetGasStationsInBox");
  const addGasStation = useMutation("AddGasStation");

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
        longitude1: position.coords.longitude + 1,
        latitude1: position.coords.latitude + 1,
        longitude2: position.coords.longitude - 1,
        latitude2: position.coords.latitude - 1,
      })
    );
  };

  const getGasStationsCallback = async (position: GeolocationPosition) => {
    setGasStations(
      await getGasStationsInBox.commit({
        longitude1: position.coords.longitude + 1,
        latitude1: position.coords.latitude + 1,
        longitude2: position.coords.longitude - 1,
        latitude2: position.coords.latitude - 1,
      })
    );
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4">Gas</Typography>
      <Grid item container sx={{ marginBottom: 4 }}>
        <Grid item xs={12} sm={6}>
          <Typography>Average gas price in your area:</Typography>
          <Typography>Unleaded: {avgGasPrices?.unleaded}</Typography>
          <Typography>Midgrade: {avgGasPrices?.midgrade}</Typography>
          <Typography>Premium: {avgGasPrices?.premium}</Typography>
          <Typography>Diesel: {avgGasPrices?.diesel}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>Best gas stations in your area:</Typography>
          {gasStations?.map((station) => {
            return (
              <>
                <Card>
                  <CardHeader>{station.name}</CardHeader>
                  <CardContent>
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
    date: Date;
    userId: string;
  }[];
  resolved_prices: {
    unleaded: number;
    midgrade: number;
    premium: number;
    diesel: number;
  };
};
