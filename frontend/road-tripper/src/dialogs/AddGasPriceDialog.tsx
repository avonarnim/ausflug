import * as React from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useMutation } from "../core/api";
import { GasPriceProps, GasStationProps } from "../pages/Gas";
import { useAuth } from "../core/AuthContext";

export default function AddGasPriceDialog(props: { station: GasStationProps }) {
  const [open, setOpen] = React.useState(false);
  const [gasPriceState, setGasPriceState] = React.useState<
    GasPriceProps & { rating: number }
  >({
    unleaded: props.station.resolved_prices.unleaded,
    midgrade: props.station.resolved_prices.midgrade,
    premium: props.station.resolved_prices.premium,
    diesel: props.station.resolved_prices.diesel,
    rating: 0,
  });
  const [successfulEdit, setSuccessfulEdit] = React.useState(false);

  const addGasPrices = useMutation("AddGasPrices");

  const { currentUser } = useAuth();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handling change", event);
    setGasPriceState({
      ...gasPriceState,
      [event.target.name]: event.target.value,
    });
  };

  const handleClose = async (submitting: boolean) => {
    if (submitting) {
      const createRes = await addGasPrices.commit({
        ...gasPriceState,
        _id: props.station._id,
        userId: currentUser?.uid,
      });
      setSuccessfulEdit(true && createRes);
    } else {
      setOpen(false);
    }
  };

  return (
    <div>
      <Typography pl={4} pb={4} onClick={handleClickOpen}>
        Add updated price
      </Typography>
      <Dialog open={open} onClose={handleClose}>
        {successfulEdit ? (
          <>
            <DialogContent>
              <DialogContentText>Thank you for your help!</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleClose(false)}>Close</Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>Gas Prices</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="unleaded"
                label="unleaded"
                type="number"
                fullWidth
                variant="standard"
                name="unleaded"
                defaultValue={gasPriceState.unleaded}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                id="midgrade"
                label="midgrade"
                type="number"
                fullWidth
                variant="standard"
                name="midgrade"
                defaultValue={gasPriceState.midgrade}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                id="premium"
                label="premium"
                type="number"
                fullWidth
                variant="standard"
                name="premium"
                defaultValue={gasPriceState.premium}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                id="diesel"
                label="diesel"
                type="number"
                fullWidth
                variant="standard"
                name="diesel"
                defaultValue={gasPriceState.diesel}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                id="rating"
                label="rating"
                type="number"
                fullWidth
                variant="standard"
                name="rating"
                defaultValue={gasPriceState.rating}
                onChange={handleChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleClose(false)}>Close</Button>
              <Button onClick={() => handleClose(true)}>Submit</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}
