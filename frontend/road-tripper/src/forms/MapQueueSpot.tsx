import {
  Button,
  Dialog,
  Input,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "../core/api";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

export function QueueSpotFormDetailsSection(props: {
  values: MapQueueSpotFormState;
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
  const locationRef = useRef<HTMLInputElement>();

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
      <Autocomplete>
        <Input
          type="text"
          placeholder="Location"
          inputRef={locationRef}
          onChange={props.handleChange}
        />
      </Autocomplete>
      <br />
      <Button color="primary" variant="contained" onClick={attemptContinue}>
        Continue
      </Button>
    </Dialog>
  );
}

export function QueueSpotFormConfirm(props: {
  values: MapQueueSpotFormState;
  handleNext: () => void;
  handleBack: () => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element {
  const createSpot = useMutation("CreateSpot");

  const attemptContinue = async () => {
    try {
      const spotInfo = {
        id: "",
        name: props.values.title,
        description: props.values.description,
        location: {
          latitude: parseInt(props.values.mapLocation),
          longitude: parseInt(props.values.mapLocation),
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
      };
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
          <ListItemText
            primary="MapLocation"
            secondary={props.values.mapLocation}
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
  values: MapQueueSpotFormState;
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
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_MAPS_KEY!,
    libraries: ["places"],
  });

  const [queueSpotState, setQueueSpotState] = useState<MapQueueSpotFormState>({
    title: "",
    description: "",
    mapLocation: "",
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

  return isLoaded ? <>{returnForm()}</> : <></>;
}

export type MapQueueSpotFormState = {
  title: string;
  description: string;
  mapLocation: string;
};
