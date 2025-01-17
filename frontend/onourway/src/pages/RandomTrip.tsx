import { useParams } from "react-router-dom";
import { RouteMap } from "../components/RouteMap";
import dayjs from "dayjs";
import { SpotInfoProps } from "../components/SpotInfo";
import { useState } from "react";

export default function RandomTrip(): JSX.Element {
  const params = useParams();
  const [tripId, setTripId] = useState<string>("");

  console.log("IN RANDOM TRIP", params);

  const origin = params.origin || "";
  const originVal = params.originVal || "";
  const destination = params.origin || "";
  const destinationVal = params.originVal || "";
  const startDate = dayjs().format();
  const endDate = dayjs().format();

  const waypoints = JSON.parse(
    localStorage.getItem("waypoints") || "[]"
  ) as unknown as SpotInfoProps[];

  console.log("WAYPOINTS", waypoints);

  console.log("START DATE", startDate);
  console.log("END DATE", endDate);
  return (
    <div>
      <RouteMap
        oneWayRoundTrip="roundTrip"
        origin={origin}
        originVal={originVal}
        destination={destination}
        destinationVal={destinationVal}
        startDate={startDate}
        endDate={endDate}
        waypoints={waypoints}
        tripId={tripId}
        setTripId={setTripId}
      />
    </div>
  );
}
