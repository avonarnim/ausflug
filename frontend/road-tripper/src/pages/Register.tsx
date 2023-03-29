import { useState, useEffect, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Box, TextField, Typography } from "@mui/material";
import { useAuth } from "../core/AuthContext";
import { useMutation } from "../core/api";
import { ProfileProps } from "./Profile";
import { NewAccountForm } from "../forms/NewAccount";

// export default function Register() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const { currentUser, register, setError } = useAuth();
//   const createProfile = useMutation("CreateProfile");

//   useEffect(() => {
//     if (currentUser) {
//       navigate("/");
//     }
//   }, [currentUser, navigate]);

//   async function handleFormSubmit(e: any) {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       return setError("Passwords do not match");
//     }

//     try {
//       setError("");
//       setLoading(true);
//       const registrationResult = await register(email, password);
//       const profileInfo = await createProfile.commit({
//         email: email,
//         _id: registrationResult.user.uid,
//       } as ProfileProps);
//       console.log("done with this");
//       navigate(`/`);
//       // navigate(`/profile/${profileInfo._id}`);
//     } catch (e) {
//       setError("Failed to register");
//     }

//     setLoading(false);
//   }

//   return (
//     <Box p={4} component="form">
//       <Typography variant="h2">Register your account</Typography>
//       <TextField
//         id="email"
//         placeholder="Email"
//         name="email"
//         onChange={(e) => setEmail(e.target.value)}
//         autoComplete="email"
//         margin="normal"
//         fullWidth
//         required
//       />
//       <TextField
//         id="password"
//         type="password"
//         placeholder="Password"
//         name="password"
//         onChange={(e) => setPassword(e.target.value)}
//         autoComplete="new-password"
//         margin="normal"
//         fullWidth
//         required
//       />
//       <TextField
//         id="confirm-password"
//         type="password"
//         placeholder="Confirm Password"
//         name="password"
//         onChange={(e) => setConfirmPassword(e.target.value)}
//         autoComplete="new-password"
//         margin="normal"
//         fullWidth
//         required
//       />
//       <Button
//         variant="contained"
//         onClick={async (e) => {
//           await handleFormSubmit(e);
//         }}
//         disabled={loading}
//         type="submit"
//       >
//         Register
//       </Button>
//     </Box>
//   );
// }

export default function Register() {
  const navigate = useNavigate();

  const { currentUser, register, setError } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, []);

  return <NewAccountForm />;
}
