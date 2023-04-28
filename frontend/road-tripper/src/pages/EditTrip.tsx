import { useParams } from "react-router-dom";
import { RouteMap } from "../components/RouteMap";
import dayjs from "dayjs";
import { useMutation } from "../core/api";
import React, { useRef, useState, createRef, useEffect } from "react";

export default function EditTrip(): JSX.Element {
  const params = useParams();

  const getTrip = useMutation("GetTrip");

  const [tripResult, setTripResult] = useState<TripProps>();

  useEffect(() => {
    if (!tripResult && params.tripId) {
      console.log("IN EDIT TRIP", params);
      getTripResult();
    } else {
      console.log("no trip id");
    }
  }, []);

  const getTripResult = async () => {
    const trip = await getTrip.commit({ tripId: params.tripId! });
    setTripResult(trip);
  };

  const origin = tripResult?.originPlaceId || "";
  const originVal = tripResult?.originVal || "";
  const destination = tripResult?.destinationPlaceId || "";
  const destinationVal = tripResult?.destinationVal || "";
  const startDate = tripResult?.startDate || dayjs().format();
  const endDate = tripResult?.endDate || dayjs().format();

  return tripResult ? (
    <div>
      <RouteMap
        origin={origin}
        originVal={originVal}
        destination={destination}
        destinationVal={destinationVal}
        startDate={startDate}
        endDate={endDate}
        tripId={params.tripId}
        tripResult={tripResult}
      />
    </div>
  ) : (
    <div>loading</div>
  );
}

export type TripProps = {
  _id: string;
  name: string;
  description: string;
  creatorId: string;
  originPlaceId: string;
  originVal: string;
  destinationPlaceId: string;
  destinationVal: string;
  waypoints: {
    _id: string;
    place_id: string;
    location: { lat: number; lng: number };
    stopover: boolean;
  }[];
  startDate: string;
  endDate: string;
  isPublic: boolean;
  isComplete: boolean;
  isArchived: boolean;
  createdAt: number;
  updatedAt: number;
};
