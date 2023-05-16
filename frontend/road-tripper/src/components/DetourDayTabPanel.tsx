import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { SpotInfoProps } from "./SpotInfo";
import { categoryToIcon } from "../core/util";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export function groupDetoursByDay(
  chosenDetours: SpotInfoProps[],
  tempDaysDriving: number,
  results: google.maps.DirectionsResult,
  hoursDrivingPerDay: number
): SpotInfoProps[][] {
  // set chosen detours by day to be an array of arrays of length daysDriving
  // each array will contain the detours for that day
  let detoursByDay: SpotInfoProps[][] = [];
  for (let i = 0; i < tempDaysDriving; i++) {
    detoursByDay.push(new Array<SpotInfoProps>());
  }

  let runningDuration = 0;
  let day = 0;

  for (let i = 0; i < results.routes[0].legs.length - 1; i++) {
    // find detour with min distance from results.routes[0].legs[i].end_location

    let minDistDetour = chosenDetours[0];
    let minDist = Number.MAX_VALUE;
    for (let j = 0; j < chosenDetours.length; j++) {
      const distance =
        Math.pow(
          chosenDetours[j].location.lng -
            results.routes[0].legs[i].end_location.lng(),
          2
        ) +
        Math.pow(
          chosenDetours[j].location.lat -
            results.routes[0].legs[i].end_location.lat(),
          2
        );
      if (distance < minDist) {
        minDist = distance;
        minDistDetour = chosenDetours[j];
      }
    }

    const correspondingDetour = minDistDetour;

    const legDuration = results.routes[0].legs[i].duration?.value ?? 0;
    runningDuration = runningDuration + legDuration;
    if (runningDuration > hoursDrivingPerDay * 3600) {
      day++;
      runningDuration = legDuration;
    }
    detoursByDay[day].push(correspondingDetour);
  }

  return detoursByDay;
}

export function DetourDayTabPanel(props: DetourDayTabPanelProps): JSX.Element {
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box mt={4}>
      <Typography variant="h6">A {props.daysDriving} Day Trip</Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="basic tabs example"
        >
          {props.chosenDetoursByDay.map((day, index) => {
            return (
              <Tab
                label={`Day ${index + 1}`}
                {...a11yProps(index)}
                key={index}
              />
            );
          })}
        </Tabs>
      </Box>
      {props.chosenDetoursByDay.map((day, index) => {
        return (
          <TabPanel value={tabValue} index={index} key={index}>
            <List
              dense
              sx={{
                width: "100%",
              }}
            >
              {day.map((detour, index) => {
                return (
                  <ListItem key={detour._id + "_chosenDetourDay"}>
                    <ListItemButton>
                      <ListItemIcon>
                        {categoryToIcon(detour.category)}
                      </ListItemIcon>
                      <ListItemText
                        primary={detour.title}
                        secondary={detour.description}
                      ></ListItemText>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </TabPanel>
        );
      })}
    </Box>
  );
}

export type DetourDayTabPanelProps = {
  daysDriving: number;
  chosenDetoursByDay: SpotInfoProps[][];
};
