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
import { useMutation } from "../core/api";
import { useState } from "react";
import { useAuth } from "../core/AuthContext";
import plusSign from "../assets/plusSign.png";

export default function SpotReviewFormDialog(props: { spotId: string }) {
  const { currentUser } = useAuth();

  const [open, setOpen] = React.useState(false);
  const [reviewState, setReviewState] = React.useState({
    spotId: props.spotId,
    review: "",
    specialty: 0,
    quality: 0,
    image: "",
    author: currentUser.uid,
  });
  const [successfulEdit, setSuccessfulEdit] = React.useState(false);

  //   TODO: update mutation to be for spot review submission
  const submitSpotReview = useMutation("CreateReview");
  const uploadFile = useMutation("UploadFile");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async (submitting: boolean) => {
    if (submitting) {
      const uploadRes = await handleUpload();
      const updateRes = await submitSpotReview.commit(reviewState);
      setSuccessfulEdit(updateRes != null);
      setSuccessfulEdit(true && uploadRes);
    }
    setOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handling change", event.target.name, event.target.value);
    setReviewState({
      ...reviewState,
      [event.target.name]: event.target.value,
    });
    console.log(reviewState);
  };

  const [spotImage, setSpotImage] = useState<{
    selectedFile: File | null;
    loaded: Number;
    message: string;
    defaultMessage: string;
    uploading: boolean;
  }>({
    selectedFile: null,
    loaded: 0,
    message: "Choose a photo...",
    defaultMessage: "Choose a photo...",
    uploading: false,
  });

  const handleFileChange = (files: FileList) => {
    setSpotImage({
      ...spotImage,
      selectedFile: files[0],
      loaded: 0,
      message: files[0] ? files[0].name : spotImage.defaultMessage,
    });
  };

  const handleUpload = async () => {
    if (spotImage.uploading) return false;
    if (!spotImage.selectedFile) {
      setSpotImage({ ...spotImage, message: "Select a file first" });
      return false;
    }
    setSpotImage({ ...spotImage, uploading: true });
    // define upload
    const res = await uploadFile.commit({
      file: spotImage.selectedFile,
      title: currentUser.uid + "/" + props.spotId,
      prevImage: "",
      onUploadProgress: (ProgressEvent) => {
        setSpotImage({
          ...spotImage,
          loaded: Math.round(
            (ProgressEvent.loaded / ProgressEvent.total) * 100
          ),
        });
      },
    });

    setSpotImage({
      ...spotImage,
      message: "Uploaded successfully",
      uploading: false,
    });
    handleChange({
      target: { name: "image", value: res.uploadUrl },
    } as React.ChangeEvent<HTMLInputElement>);
    return true;
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Leave a review
      </Button>
      <Dialog open={open} onClose={handleClose}>
        {successfulEdit ? (
          <>
            <DialogContent>
              <DialogContentText>We've received your review!</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleClose(false)}>Cancel</Button>
              <Button onClick={() => handleClose(true)}>Submit</Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>Leave a review</DialogTitle>
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
                      spotImage.selectedFile
                        ? URL.createObjectURL(spotImage.selectedFile)
                        : plusSign
                    }
                    title="Review picture"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="body2">
                      {spotImage.uploading
                        ? spotImage.loaded + "%"
                        : spotImage.message}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <label htmlFor="file-5">
                      <Button size="small" component="span" variant="outlined">
                        Select Image
                      </Button>
                    </label>
                  </CardActions>
                </Card>
              </form>
              <TextField
                autoFocus
                margin="dense"
                id="review"
                label="review"
                type="text"
                fullWidth
                variant="standard"
                placeholder="review"
                name="review"
                onChange={handleChange}
              />
              <TextField
                autoFocus
                margin="dense"
                id="specialty"
                label="specialty"
                type="number"
                fullWidth
                variant="standard"
                placeholder="specialty"
                name="specialty"
                onChange={handleChange}
              />
              <TextField
                autoFocus
                margin="dense"
                id="quality"
                label="quality"
                type="number"
                fullWidth
                variant="standard"
                placeholder="quality"
                name="quality"
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
