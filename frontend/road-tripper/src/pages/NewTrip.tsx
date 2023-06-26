import { useParams } from "react-router-dom";
import { RouteMap } from "../components/RouteMap";
import dayjs from "dayjs";
import { useState } from "react";

export default function NewTrip(): JSX.Element {
  const params = useParams();
  const [tripId, setTripId] = useState<string>("");

  console.log("IN NEW TRIP", params);

  const origin = params.origin || "";
  const originVal = params.originVal || "";
  const destination = params.destination || "";
  const destinationVal = params.destinationVal || "";
  const startDate = params.startDate || dayjs().format();
  const endDate = params.endDate || dayjs().format();

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
        tripId={tripId}
        setTripId={setTripId}
      />
    </div>
  );
}
