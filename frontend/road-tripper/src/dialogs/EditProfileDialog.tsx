import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { ProfileProps } from "../pages/Profile";
import { useMutation } from "../core/api";

export default function ProfileFormDialog(props: ProfileProps) {
  const [open, setOpen] = React.useState(false);
  const [editAccountState, setEditAccountState] = React.useState(props);
  const [successfulEdit, setSuccessfulEdit] = React.useState(false);

  const updateProfile = useMutation("UpdateProfile");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async (submitting: boolean) => {
    if (submitting) {
      const updateRes = await updateProfile.commit(editAccountState);
      setSuccessfulEdit(updateRes != null);
    }
    setOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handling change", event);
    setEditAccountState({
      ...editAccountState,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Edit profile
      </Button>
      <Dialog open={open} onClose={handleClose}>
        {successfulEdit ? (
          <>
            <DialogContent>
              <DialogContentText>
                Profile updated successfully!
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleClose(false)}>Cancel</Button>
              <Button onClick={() => handleClose(true)}>Submit</Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogContent>
              <DialogContentText>New username</DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="username"
                label="username"
                type="text"
                fullWidth
                variant="standard"
                onChange={handleChange}
              />
              <DialogContentText>New name</DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="name"
                type="text"
                fullWidth
                variant="standard"
                onChange={handleChange}
              />
              <DialogContentText>New bio</DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="bio"
                label="bio"
                type="text"
                fullWidth
                variant="standard"
                onChange={handleChange}
              />
              <DialogContentText>New Instagram</DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="instagram"
                label="instagram"
                type="text"
                fullWidth
                variant="standard"
                onChange={handleChange}
              />
              <DialogContentText>New Twitter</DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="twitter"
                label="twitter"
                type="text"
                fullWidth
                variant="standard"
                onChange={handleChange}
              />
              <DialogContentText>New Facebook</DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="facebook"
                label="facebook"
                type="text"
                fullWidth
                variant="standard"
                onChange={handleChange}
              />
              <DialogContentText>New Youtube</DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="youtube"
                label="youtube"
                type="text"
                fullWidth
                variant="standard"
                onChange={handleChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleClose(false)}>Cancel</Button>
              <Button onClick={() => handleClose(true)}>Submit</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}
