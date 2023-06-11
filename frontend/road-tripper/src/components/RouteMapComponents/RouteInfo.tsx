import { Grid, Typography } from "@mui/material";
import { SpotInfoProps } from "../SpotInfo";
import { DetourDayTabPanel } from "../DetourDayTabPanel";

export function RouteInfo(props: {
  routeCreated: boolean;
  distance: string;
  duration: string;
  daysDriving: number;
  chosenDetoursByDay: SpotInfoProps[][];
}): JSX.Element {
  return (
    <>
      {props.routeCreated && (
        <>
          <Grid item xs={6} sx={{ pl: 4, pr: 4 }}>
            <Typography>Distance: {props.distance} </Typography>
          </Grid>
          <Grid item xs={6} sx={{ pl: 4, pr: 4 }}>
            <Typography>Duration: {props.duration} </Typography>
          </Grid>
          <Grid item xs={12} sx={{ pl: 4, pr: 4 }}>
            <DetourDayTabPanel
              daysDriving={props.daysDriving}
              chosenDetoursByDay={props.chosenDetoursByDay}
            />
          </Grid>
        </>
      )}
    </>
  );
}
