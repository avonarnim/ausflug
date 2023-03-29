import {
  Button,
  Box,
  Input,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState, useRef, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "../core/api";
import { ProfileProps } from "../pages/Profile";

import { useAuth } from "../core/AuthContext";

export function NewAccountRegisterSection(props: {
  values: NewAccountFormState;
  handleNext: () => void;
  handleBack: () => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { currentUser, register, setError } = useAuth();

  const attemptContinue = async (e: any) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      const res = await register(email, password);
      props.handleChange({
        event: { target: { name: "_id", value: res.user.uid } },
      } as unknown as ChangeEvent<HTMLInputElement>);
    } catch (e) {
      setError("Failed to register", e);
      setLoading(false);
    }
    props.handleNext();
  };

  return (
    <>
      <Box p={4} component="form">
        <Typography variant="h2">Register your account</Typography>
        <TextField
          id="email"
          placeholder="Email"
          name="email"
          onChange={(e) => {
            setEmail(e.target.value);
            props.handleChange(e as ChangeEvent<HTMLInputElement>);
          }}
          autoComplete="email"
          margin="normal"
          fullWidth
          required
        />
        <TextField
          id="password"
          type="password"
          placeholder="Password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          margin="normal"
          fullWidth
          required
        />
        <TextField
          id="confirm-password"
          type="password"
          placeholder="Confirm Password"
          name="password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          margin="normal"
          fullWidth
          required
        />
        <Button
          variant="contained"
          onClick={async (e) => {
            await attemptContinue(e);
          }}
          disabled={loading}
        >
          Register
        </Button>
      </Box>
    </>
  );
}

export function NewAccountFormDetailsSection(props: {
  values: NewAccountFormState;
  handleNext: () => void;
  handleBack: () => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element {
  const attemptContinue = () => {
    if (props.values.username.length > 0 && props.values.name.length > 0) {
      props.handleNext();
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h5">Tell us about yourself</Typography>
      <TextField
        placeholder="Select a username"
        name="username"
        onChange={props.handleChange}
        defaultValue={props.values.username}
        margin="normal"
        fullWidth
      />
      <br />
      <TextField
        placeholder="Name"
        name="name"
        onChange={props.handleChange}
        defaultValue={props.values.name}
        margin="normal"
        fullWidth
      />
      <br />
      <TextField
        placeholder="Bio"
        name="bio"
        onChange={props.handleChange}
        defaultValue={props.values.bio}
        margin="normal"
        fullWidth
      />
      <br />
      <TextField
        placeholder="Instagram"
        name="instagram"
        onChange={props.handleChange}
        defaultValue={props.values.instagram}
        margin="normal"
        fullWidth
      />
      <br />
      <TextField
        placeholder="Twitter"
        name="twitter"
        onChange={props.handleChange}
        defaultValue={props.values.twitter}
        margin="normal"
        fullWidth
      />
      <br />
      <TextField
        placeholder="Facebook"
        name="facebook"
        onChange={props.handleChange}
        defaultValue={props.values.facebook}
        margin="normal"
        fullWidth
      />
      <br />
      <TextField
        placeholder="Youtube"
        name="youtube"
        onChange={props.handleChange}
        defaultValue={props.values.youtube}
        margin="normal"
        fullWidth
      />
      <br />
      <Button color="primary" variant="contained" onClick={attemptContinue}>
        Continue
      </Button>
    </Box>
  );
}

export function NewAccountFormConfirm(props: {
  values: NewAccountFormState;
  handleNext: () => void;
  handleBack: () => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element {
  const createProfile = useMutation("CreateProfile");

  const attemptContinue = async () => {
    try {
      const profileInfo = {
        _id: props.values._id,
        name: props.values.name,
        username: props.values.username,
        email: props.values.username,
        bio: props.values.bio,
        image: "",
        following: [],
        followers: [],
        savedTripIDs: [],
        upcomingTripsID: [],
        savedSpots: [],
        instagram: props.values.instagram,
        facebook: props.values.facebook,
        twitter: props.values.twitter,
        youtube: props.values.youtube,
      } as ProfileProps;
      const createProfileResponse = await createProfile.commit(profileInfo);

      props.handleNext();
    } catch (err) {
      console.log("Sorry, but we were not able to create the profile.");
      console.log(err);
    }
  };

  return (
    <Box p={4}>
      <List>
        <ListItem>
          <ListItemText primary="Username" secondary={props.values.username} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Name" secondary={props.values.name} />
        </ListItem>
        <ListItem>
          <ListItemText primary="bio" secondary={props.values.bio} />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="instagram"
            secondary={props.values.instagram}
          />
        </ListItem>
        <ListItem>
          <ListItemText primary="twitter" secondary={props.values.twitter} />
        </ListItem>
        <ListItem>
          <ListItemText primary="facebook" secondary={props.values.facebook} />
        </ListItem>
        <ListItem>
          <ListItemText primary="youtube" secondary={props.values.youtube} />
        </ListItem>
      </List>
      <br />
      <Button color="primary" variant="contained" onClick={props.handleBack}>
        Back
      </Button>
      <br />
      <Button color="primary" variant="contained" onClick={attemptContinue}>
        Confirm
      </Button>
    </Box>
  );
}

export function NewAccountFormSuccess(props: {
  values: NewAccountFormState;
  handleNext: () => void;
  handleBack: () => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element {
  return (
    <Box>
      <Typography variant="h5">
        Success! Thanks for joining. We hope you enjoy your time here.
      </Typography>
      <br />
      <Button>
        <Link to="/">Return Home</Link>
      </Button>
    </Box>
  );
}

export function NewAccountForm(): JSX.Element {
  const [newAccountState, setNewAccountState] = useState<NewAccountFormState>({
    _id: "",
    name: "",
    username: "",
    bio: "",
    image: "",
    instagram: "",
    facebook: "",
    twitter: "",
    youtube: "",
  });
  const [step, setStep] = useState(0);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setNewAccountState({
        ...newAccountState,
        [event.target.name]: event.target.value,
      });
    } catch (err) {
      console.log("error handling change", err);
    }
  };

  const returnForm = () => {
    switch (step) {
      case 0:
        return (
          <NewAccountRegisterSection
            values={newAccountState}
            handleNext={handleNext}
            handleBack={handleBack}
            handleChange={handleChange}
          />
        );
      case 1:
        return (
          <NewAccountFormDetailsSection
            values={newAccountState}
            handleNext={handleNext}
            handleBack={handleBack}
            handleChange={handleChange}
          />
        );
      case 2:
        return (
          <NewAccountFormConfirm
            values={newAccountState}
            handleNext={handleNext}
            handleBack={handleBack}
            handleChange={handleChange}
          />
        );

      case 3:
        return (
          <NewAccountFormSuccess
            values={newAccountState}
            handleNext={handleNext}
            handleBack={handleBack}
            handleChange={handleChange}
          />
        );
      default:
        return <></>;
    }
  };

  return <>{returnForm()}</>;
}

export type NewAccountFormState = {
  _id: string;
  name: string;
  username: string;
  bio: string;
  image: string;
  instagram: string;
  facebook: string;
  twitter: string;
  youtube: string;
};
