import {
  Box,
  Button,
  Grid,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { GasStationProps } from "../../pages/Gas";

export function GasStationInfo(props: {
  stations: GasStationProps[];
}): JSX.Element {
  return (
    <Grid item container direction="row" xs={12} sx={{ p: 4 }}>
      <Typography>Gas stations along the way</Typography>

      <List
        dense
        sx={{
          width: "100%",
        }}
      >
        {props.stations
          .sort(
            (a, b) => a.resolved_prices.unleaded - b.resolved_prices.unleaded
          )
          .map((station, index) => {
            return (
              <ListItem key={station._id + "_" + index}>
                <ListItemText primary={station.name}></ListItemText>
                {Object.keys(station.resolved_prices).map((key) => {
                  const resolved_prices = station.resolved_prices as {
                    [key: string]: number;
                  };
                  return (
                    <Box>
                      <Typography>{key}</Typography>
                      <Typography>{resolved_prices[key]}</Typography>
                    </Box>
                  );
                })}
              </ListItem>
            );
          })}
      </List>
    </Grid>
  );
}
