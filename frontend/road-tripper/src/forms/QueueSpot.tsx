import {
  Button,
  Dialog,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { SpotInfoProps } from "../components/SpotInfo";
import { useMutation } from "../core/api";

export function QueueSpotFormDetailsSection(props: {
  values: QueueSpotFormState;
  handleNext: () => void;
  handleBack: () => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element {
  const attemptContinue = () => {
    console.log("attempting to continue...", props.values);
    if (props.values.title.length > 0 && props.values.description.length > 0) {
      console.log("continuing...");
      props.handleNext();
    }
  };

  return (
    <Dialog open fullWidth maxWidth="sm">
      <TextField
        placeholder="Enter the Title"
        name="title"
        onChange={props.handleChange}
        defaultValue={props.values.title}
        margin="normal"
        fullWidth
      />
      <br />
      <TextField
        placeholder="Enter the Description"
        name="description"
        onChange={props.handleChange}
        defaultValue={props.values.description}
        margin="normal"
        fullWidth
      />
      <br />
      <TextField
        placeholder="Enter the latitude location"
        name="latitude"
        onChange={props.handleChange}
        defaultValue={props.values.latitude}
        margin="normal"
        fullWidth
      />
      <br />
      <TextField
        placeholder="Enter the longitude location"
        name="longitude"
        onChange={props.handleChange}
        defaultValue={props.values.longitude}
        margin="normal"
        fullWidth
      />
      <br />
      <Button color="primary" variant="contained" onClick={attemptContinue}>
        Continue
      </Button>
    </Dialog>
  );
}

export function QueueSpotFormConfirm(props: {
  values: QueueSpotFormState;
  handleNext: () => void;
  handleBack: () => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element {
  const createSpot = useMutation("CreateSpot");

  const attemptContinue = async () => {
    try {
      const spotInfo = {
        id: "",
        title: props.values.title,
        description: props.values.description,
        location: {
          lat: props.values.latitude,
          lng: props.values.longitude,
        },
        mapLocation: {
          formatted_address: "",
          formatted_phone_number: "",
          geometry: {
            location: {
              lat: props.values.latitude,
              lng: props.values.longitude,
            },
          },
          rating: 0,
          user_ratings_total: 0,
          price_level: 0,
          types: [],
          place_id: "",
        },
        category: "",
        cost: 0,
        specialty: 0,
        quality: 0,
        numberOfRatings: 0,
        avgTimeSpent: 0,
        sponsored: false,
        duration: 0,
        status: "pending",
        openTimes: [new Date().getTime()],
      } as SpotInfoProps;
      const createSpotResponse = await createSpot.commit(spotInfo);
      console.log(createSpotResponse);
      props.handleNext();
    } catch (err) {
      console.log("Sorry, but we were not able to submit this spot.");
      console.log(err);
    }
  };

  return (
    <Dialog open fullWidth maxWidth="sm">
      <List>
        <ListItem>
          <ListItemText primary="Title" secondary={props.values.title} />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Description"
            secondary={props.values.description}
          />
        </ListItem>
        <ListItem>
          <ListItemText primary="Latitude" secondary={props.values.latitude} />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Longitude"
            secondary={props.values.longitude}
          />
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
    </Dialog>
  );
}

export function QueueSpotFormSuccess(props: {
  values: QueueSpotFormState;
  handleNext: () => void;
  handleBack: () => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element {
  return (
    <Dialog open fullWidth maxWidth="sm">
      <Typography variant="h5">
        Success! Thank you for your submission. We'll be reviewing it shortly.
      </Typography>
      <br />
      <Button>
        <Link to="/">Return Home</Link>
      </Button>
    </Dialog>
  );
}

export function QueueSpotForm(): JSX.Element {
  const [queueSpotState, setQueueSpotState] = useState<QueueSpotFormState>({
    title: "",
    description: "",
    latitude: 0,
    longitude: 0,
  });
  const [step, setStep] = useState(0);

  const handleNext = () => {
    console.log("advancing", step);
    setStep(step + 1);
    console.log("advanced", step);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handling change", event);
    setQueueSpotState({
      ...queueSpotState,
      [event.target.name]: event.target.value,
    });
  };

  const returnForm = () => {
    switch (step) {
      case 0:
        return (
          <QueueSpotFormDetailsSection
            values={queueSpotState}
            handleNext={handleNext}
            handleBack={handleBack}
            handleChange={handleChange}
          />
        );
      case 1:
        return (
          <QueueSpotFormConfirm
            values={queueSpotState}
            handleNext={handleNext}
            handleBack={handleBack}
            handleChange={handleChange}
          />
        );
      case 2:
        return (
          <QueueSpotFormSuccess
            values={queueSpotState}
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

export type QueueSpotFormState = {
  title: string;
  description: string;
  latitude: number;
  longitude: number;
};
