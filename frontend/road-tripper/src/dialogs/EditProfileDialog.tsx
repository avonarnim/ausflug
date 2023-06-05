import * as React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { ProfileProps } from "../pages/Profile";
import { useMutation } from "../core/api";
import { useState } from "react";
import { useAuth } from "../core/AuthContext";
import profileIcon from "../assets/profileIcon.png";

export default function ProfileFormDialog(props: ProfileProps) {
  const [open, setOpen] = React.useState(false);
  const [editAccountState, setEditAccountState] = React.useState(props);
  const [successfulEdit, setSuccessfulEdit] = React.useState(false);

  const updateProfile = useMutation("UpdateProfile");
  const uploadFile = useMutation("UploadFile");
  const { currentUser } = useAuth();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async (submitting: boolean) => {
    if (submitting) {
      const updateRes = await updateProfile.commit(editAccountState);
      console.log(updateRes);
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

  const [profileFile, setProfileFile] = useState<{
    selectedFile: File | null;
    loaded: Number;
    message: string;
    defaultMessage: string;
    uploading: boolean;
  }>({
    selectedFile: null,
    loaded: 0,
    message: "Choose a profile photo...",
    defaultMessage: "Choose a profile photo...",
    uploading: false,
  });

  const handleFileChange = (files: FileList) => {
    setProfileFile({
      ...profileFile,
      selectedFile: files[0],
      loaded: 0,
      message: files[0] ? files[0].name : profileFile.defaultMessage,
    });
  };

  const handleUpload = async () => {
    if (profileFile.uploading) return;
    if (!profileFile.selectedFile) {
      setProfileFile({ ...profileFile, message: "Select a file first" });
      return;
    }
    setProfileFile({ ...profileFile, uploading: true });
    // define upload
    const res = await uploadFile.commit({
      file: profileFile.selectedFile,
      title: currentUser.uid,
      onUploadProgress: (ProgressEvent) => {
        setProfileFile({
          ...profileFile,
          loaded: Math.round(
            (ProgressEvent.loaded / ProgressEvent.total) * 100
          ),
        });
      },
    });

    setProfileFile({
      ...profileFile,
      message: "Uploaded successfully",
      uploading: false,
    });
    handleChange({
      target: { name: "image", value: res.uploadUrl },
    } as React.ChangeEvent<HTMLInputElement>);
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
              <form
                className="box"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpload();
                }}
              >
                <input
                  type="file"
                  name="file-5[]"
                  id="file-5"
                  className="inputfile inputfile-4"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    handleFileChange(e.target.files!);
                  }}
                />
                <Card sx={{ maxWidth: 345 }}>
                  <CardMedia
                    sx={{ height: 140 }}
                    image={
                      profileFile.selectedFile
                        ? URL.createObjectURL(profileFile.selectedFile)
                        : profileIcon
                    }
                    title="Profile picture"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="body2">
                      {profileFile.uploading
                        ? profileFile.loaded + "%"
                        : profileFile.message}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <label htmlFor="file-5">
                      <Button size="small" component="span" variant="outlined">
                        Select Image
                      </Button>
                    </label>
                    <Button
                      size="small"
                      // className="submit"
                      variant="contained"
                      onClick={handleUpload}
                      sx={{ ml: 2 }}
                    >
                      Upload
                    </Button>
                  </CardActions>
                </Card>
              </form>
              <TextField
                autoFocus
                margin="dense"
                id="username"
                label="username"
                type="text"
                fullWidth
                variant="standard"
                placeholder="username"
                name="username"
                onChange={handleChange}
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="name"
                type="text"
                fullWidth
                variant="standard"
                placeholder="name"
                name="name"
                onChange={handleChange}
              />
              <TextField
                autoFocus
                margin="dense"
                id="bio"
                label="bio"
                type="text"
                fullWidth
                variant="standard"
                placeholder="bio"
                name="bio"
                onChange={handleChange}
              />
              <TextField
                autoFocus
                margin="dense"
                id="instagram"
                label="instagram"
                type="text"
                fullWidth
                variant="standard"
                placeholder="instagram"
                name="instagram"
                onChange={handleChange}
              />
              <TextField
                autoFocus
                margin="dense"
                id="twitter"
                label="twitter"
                type="text"
                fullWidth
                variant="standard"
                placeholder="twitter"
                name="twitter"
                onChange={handleChange}
              />
              <TextField
                autoFocus
                margin="dense"
                id="facebook"
                label="facebook"
                type="text"
                fullWidth
                variant="standard"
                placeholder="facebook"
                name="facebook"
                onChange={handleChange}
              />
              <TextField
                autoFocus
                margin="dense"
                id="youtube"
                label="youtube"
                type="text"
                fullWidth
                variant="standard"
                placeholder="youtube"
                name="youtube"
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
