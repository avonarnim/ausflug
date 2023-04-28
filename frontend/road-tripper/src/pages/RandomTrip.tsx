import { useParams } from "react-router-dom";
import { RouteMap } from "../components/RouteMap";
import dayjs from "dayjs";

export default function RandomTrip(): JSX.Element {
  const params = useParams();

  console.log("IN RANDOM TRIP", params);

  const origin = params.origin || "";
  const originVal = params.originVal || "";
  const destination = params.origin || "";
  const destinationVal = params.originVal || "";
  const startDate = dayjs().format();
  const endDate = dayjs().format();

  const waypoints = JSON.parse(localStorage.getItem("waypoints") || "[]");

  console.log("WAYPOINTS", waypoints);

  console.log("START DATE", startDate);
  console.log("END DATE", endDate);
  return (
    <div>
      <RouteMap
        origin={origin}
        originVal={originVal}
        destination={destination}
        destinationVal={destinationVal}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
}
