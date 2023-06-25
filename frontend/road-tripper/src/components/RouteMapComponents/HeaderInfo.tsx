import { Button, Grid, IconButton, Input, Typography } from "@mui/material";
import { SpotInfoProps } from "../SpotInfo";
import { DetourDayTabPanel } from "../DetourDayTabPanel";
import { Link } from "react-router-dom";
import { PhotoUploader } from "../PhotoUploader";
import { Delete } from "@mui/icons-material";
import { useMutation } from "../../core/api";
import { useRef, useState } from "react";
import TripPostDialog from "../../dialogs/TripPostDialog";

export function HeaderInfo(props: {
  currentUser: any;
  image: string;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  cumulativeDuration: number;
  cumulativeDistance: number;
  clearRoute: () => void;
  originRef: any;
  destinationRef: any;
  originPlace: any;
  destinationPlace: any;
  chosenDetours: SpotInfoProps[];
  tripCreatorId: string | undefined;
  tripResultId: string;
  completed: boolean;
}): JSX.Element {
  const [completed, setCompleted] = useState<boolean>(props.completed);

  const createTrip = useMutation("CreateTrip");
  const updateTrip = useMutation("UpdateTrip");

  const nameRef = useRef<HTMLInputElement>();
  const descriptionRef = useRef<HTMLInputElement>();

  return (
    <Grid item container direction="row" xs={12} sx={{ p: 4 }}>
      {props.currentUser ? (
        <>
          <Grid item xs={4}>
            {props.image ? (
              <img
                src={props.image}
                alt={"trip photo"}
                style={{
                  borderRadius: "50%",
                  width: "200px",
                  height: "200px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <PhotoUploader
                id={`${props.currentUser.uid} ${Date.now()}`}
                setImageString={props.handleImageChange}
                prevImageString={props.image}
              />
            )}
          </Grid>

          <Grid item container direction="column" xs={4} sx={{ pl: 4, pr: 4 }}>
            <Input type="text" defaultValue={props.name} inputRef={nameRef} />
            <Input
              type="text"
              defaultValue={props.description}
              inputRef={descriptionRef}
            />
            <Grid container direction="row">
              <Button
                onClick={() => {
                  let tripDetails = {
                    name: nameRef.current?.value || "Unnamed Trip",
                    description: descriptionRef.current?.value || "",
                    creatorId: props.currentUser.uid,
                    originPlaceId: props.originPlace?.place_id || "",
                    originVal: props.originRef.current?.value || "",
                    destinationPlaceId: props.destinationPlace?.place_id || "",
                    destinationVal: props.destinationRef.current?.value || "",
                    waypoints: props.chosenDetours.map((spot) => {
                      return {
                        _id: spot._id,
                        place_id: spot.place_id,
                        location: {
                          lat: spot.location.lat,
                          lng: spot.location.lng,
                        },
                        stopover: true,
                      };
                    }),
                    startDate: props.startDate,
                    endDate: props.endDate,
                    isPublic: false,
                    completed: false,
                    posted: false,
                    isArchived: false,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    completedAt: 0,
                    duration: props.cumulativeDuration,
                    distance: props.cumulativeDistance,
                    image: props.image,
                  };
                  if (props.tripCreatorId !== props.currentUser.uid) {
                    createTrip.commit(tripDetails);
                  } else {
                    updateTrip.commit({
                      ...tripDetails,
                      _id: props.tripResultId,
                    });
                  }
                }}
              >
                {props.tripCreatorId === undefined ||
                props.tripCreatorId === props.currentUser.uid
                  ? "Save"
                  : "Clone as mine"}
              </Button>
              {props.tripResultId !== "" && completed && (
                <TripPostDialog tripId={props.tripResultId} />
              )}
              {!completed && (
                <Button
                  onClick={async () => {
                    let tripDetails = {
                      name: nameRef.current?.value || "Unnamed Trip",
                      description: descriptionRef.current?.value || "",
                      creatorId: props.currentUser.uid,
                      originPlaceId: props.originPlace?.place_id || "",
                      originVal: props.originRef.current?.value || "",
                      destinationPlaceId:
                        props.destinationPlace?.place_id || "",
                      destinationVal: props.destinationRef.current?.value || "",
                      waypoints: props.chosenDetours.map((spot) => {
                        return {
                          _id: spot._id,
                          place_id: spot.place_id,
                          location: {
                            lat: spot.location.lat,
                            lng: spot.location.lng,
                          },
                          stopover: true,
                        };
                      }),
                      startDate: props.startDate,
                      endDate: props.endDate,
                      isPublic: false,
                      completed: true,
                      posted: false,
                      isArchived: false,
                      createdAt: Date.now(), // TODO: change to trip creation date
                      updatedAt: Date.now(),
                      completedAt: Date.now(),
                      duration: props.cumulativeDuration,
                      distance: props.cumulativeDistance,
                      image: props.image,
                    };
                    updateTrip.commit({
                      ...tripDetails,
                      _id: props.tripResultId,
                    });
                    setCompleted(true);
                  }}
                >
                  Mark complete
                </Button>
              )}
              <IconButton aria-label="delete route" onClick={props.clearRoute}>
                <Delete />
              </IconButton>
            </Grid>
          </Grid>
        </>
      ) : (
        <Link to={`/login`} style={{ textDecoration: "none" }}>
          <Button>Log in to save your trip</Button>
        </Link>
      )}
    </Grid>
  );
}
