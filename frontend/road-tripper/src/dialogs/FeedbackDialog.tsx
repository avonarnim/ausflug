import * as React from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useMutation } from "../core/api";
import { FeedbackProps } from "../pages/Admin";

export default function FeedbackDialog() {
  const [open, setOpen] = React.useState(false);
  const [feedbackState, setFeedbackState] = React.useState<FeedbackProps>({
    feedback: "",
    contact: "",
    creationDate: "",
  });
  const [successfulEdit, setSuccessfulEdit] = React.useState(false);

  const createFeedback = useMutation("CreateFeedback");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handling change", event);
    setFeedbackState({
      ...feedbackState,
      [event.target.name]: event.target.value,
    });
  };

  const handleClose = async (submitting: boolean) => {
    if (submitting) {
      const createRes = await createFeedback.commit({
        ...feedbackState,
        creationDate: new Date().toISOString(),
      });
      setSuccessfulEdit(true && createRes);
    } else {
      setOpen(false);
    }
  };

  return (
    <div>
      <Button variant="standard" onClick={handleClickOpen}>
        Give Feedback
      </Button>
      <Dialog open={open} onClose={handleClose}>
        {successfulEdit ? (
          <>
            <DialogContent>
              <DialogContentText>
                Feedback submitted! Thank you for your help
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleClose(false)}>Close</Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>Feedback</DialogTitle>
            <DialogContent>
              {" "}
              <TextField
                autoFocus
                margin="dense"
                id="feedback"
                label="feedback"
                type="text"
                fullWidth
                variant="standard"
                placeholder="feedback"
                name="feedback"
                defaultValue={feedbackState.feedback}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                id="contact"
                label="contact"
                type="text"
                fullWidth
                variant="standard"
                placeholder="contact"
                name="contact"
                defaultValue={feedbackState.contact}
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
