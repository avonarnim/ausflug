import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Box, TextField, Typography } from "@mui/material";
import { useAuth } from "../core/AuthContext";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (e) {
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
