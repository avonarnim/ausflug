import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Box, TextField, Typography } from "@mui/material";
import { useAuth } from "../core/AuthContext";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");

  const { currentUser, login, setError } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  async function handleFormSubmit(e: any) {
    e.preventDefault();

    try {
      setError("");
      setEmailErrorMsg("");
      setPasswordErrorMsg("");
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (error: unknown) {
      const errorCast = error as Error;
      console.log(errorCast);
      if (errorCast.message === "Firebase: Error (auth/invalid-email).") {
        setEmailErrorMsg("Invalid email");
      } else if (
        errorCast.message === "Firebase: Error (auth/user-not-found)."
      ) {
        setEmailErrorMsg("No user found with that email");
      } else if (
        errorCast.message === "Firebase: Error(auth/email-already-exists)."
      ) {
        setEmailErrorMsg("Email already exists");
      } else if (
        errorCast.message === "Firebase: Error (auth/wrong-password)."
      ) {
        setPasswordErrorMsg("Incorrect password");
      } else if (
        errorCast.message === "Firebase: Error (auth/too-many-requests)."
      ) {
        setPasswordErrorMsg(errorCast.message);
      } else if (
        errorCast.message === "Firebase: Error (auth/invalid-password)."
      ) {
        setPasswordErrorMsg(
          "Invalid password. Password must be at least 6 characters"
        );
      } else {
        setError(errorCast.message);
      }
      setError("Failed to login");
    }

    setLoading(false);
  }

  return (
    <Box p={4} component="form">
      <Typography variant="h2">Login to your account</Typography>
      <TextField
        id="email"
        placeholder="Email"
        name="email"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        margin="normal"
        fullWidth
        required
        error={emailErrorMsg !== ""}
        helperText={emailErrorMsg}
      />
      <TextField
        id="password"
        placeholder="Password"
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        margin="normal"
        type="password"
        fullWidth
        required
        error={passwordErrorMsg !== ""}
        helperText={passwordErrorMsg}
      />
      <Button
        variant="contained"
        onClick={async (e) => {
          await handleFormSubmit(e);
        }}
        disabled={loading}
        type="submit"
      >
        Login
      </Button>
      <Button variant="outlined" component={Link} to="/register">
        Don't have an account? Register here
      </Button>
    </Box>
  );
}
