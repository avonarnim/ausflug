import { Fragment, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogProps,
  IconButton,
  Typography,
  DialogContentText,
} from "@mui/material";

import { useAuth } from "../core/AuthContext";

export function Logout(props: {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const cancelButtonRef = useRef(null);
  const navigate = useNavigate();

  const { logout, setError } = useAuth();

  async function handleLogout() {
    try {
      setError("");
      await logout();
      props.setModal(false);
      navigate("/login");
    } catch {
      setError("Failed to logout");
    }
  }

  return (
    <Dialog onClose={() => props.setModal(false)} open={props.modal}>
      <DialogTitle>Log Out</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to log out ?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.setModal(false)}>Cancel</Button>
        <Button onClick={handleLogout}>Log Out</Button>
      </DialogActions>
    </Dialog>
  );
}
