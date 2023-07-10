import * as React from "react";
import { auth } from "./firebase";
import { SpotInfoProps } from "../components/SpotInfo";
import { ProfileProps } from "../pages/Profile";
import { TripProps } from "../pages/EditTrip";
import axios, { AxiosProgressEvent, AxiosHeaders, AxiosResponse } from "axios";
import { EventProps } from "../pages/Event";
import { AdminMetrics, FeedbackProps } from "../pages/Admin";
import { SpotInteraction } from "../components/Upvote";
import { PostProps } from "../pages/Feed";
import { GasPriceProps, GasStationProps } from "../pages/Gas";

// #region TypeScript Definitions

type Type =
  | "CreateSpot"
  | "UpdateSpot"
  | "DeleteSpot"
  | "GetSpot"
  | "GetSpots"
  | "GetSpotsAssemblage"
  | "GetSpotsQueue"
  | "GetSpotsList"
  | "GetSpotsByCenter"
  | "GetSpotsInBox"
  | "GetHighlightedSpots"
  | "GetSpotsByHighlightedGroup"
  | "GetSpotsBySource"
  | "SearchSpots"
  | "GetSimilarSpots"
  | "SaveSpotToUser"
  | "UnsaveSpotFromUser"
  | "CreateReview"
  | "GetEventsInBoxTime"
  | "GetEventsByVenue"
  | "CreateProfile"
  | "GetProfile"
  | "GetProfileByUsername"
  | "GetProfiles"
  | "GetStatuses"
  | "DeleteProfile"
  | "UpdateProfile"
  | "FollowProfile"
  | "UnfollowProfile"
  | "SearchProfiles"
  | "GetProfileList"
  | "CreateTrip"
  | "SaveTrip"
  | "DeleteTrip"
  | "UpdateTrip"
  | "GetTrip"
  | "GetUserTrips"
  | "UploadFile"
  | "GetAdminMetrics"
  | "GetPastNDaysMetrics"
  | "GetVote"
  | "SetVote"
  | "CreatePost"
  | "GetPost"
  | "GetUserPosts"
  | "UpdatePost"
  | "DeletePost"
  | "GetFeedPosts"
  | "CreateFeedback"
  | "GetFeedback"
  | "GetGasStationsInBox"
  | "GetGasPriceInBox"
  | "GetGasStation"
  | "AddGasStation"
  | "AddGasPrices";

type State<T extends Type> = {
  loading: boolean;
  errors: {
    [key in keyof Input<T> | "_"]?: string[];
  };
};

type Input<T extends Type> = T extends "CreateSpot"
  ? SpotInfoProps
  : T extends "UpdateSpot"
  ? SpotInfoProps
  : T extends "DeleteSpot"
  ? { spotId: string }
  : T extends "GetSpot"
  ? { spotId: string }
  : T extends "GetSpots"
  ? {}
  : T extends "GetSpotsAssemblage"
  ? {
      locations: {
        longitude: number;
        latitude: number;
        title: string;
      }[];
      sources: { source: string; title: string }[];
      subjects: { subject: string; title: string }[];
      trips: string[];
    }
  : T extends "GetSpotsQueue"
  ? {}
  : T extends "GetSpotsList"
  ? { userId: string }
  : T extends "GetSpotsByCenter"
  ? { longitude: number; latitude: number }
  : T extends "GetSpotsInBox"
  ? {
      longitude1: number;
      latitude1: number;
      longitude2: number;
      latitude2: number;
    }
  : T extends "GetHighlightedSpots"
  ? {}
  : T extends "GetSpotsByHighlightedGroup"
  ? { subject: string }
  : T extends "GetSpotsBySource"
  ? { source: string }
  : T extends "SearchSpots"
  ? { query: string }
  : T extends "GetSimilarSpots"
  ? {
      title: string;
      description: string;
    }
  : T extends "SaveSpotToUser"
  ? { spotId: string; userId: string }
  : T extends "UnsaveSpotFromUser"
  ? { spotId: string; userId: string }
  : T extends "CreateReview"
  ? {
      spotId: string;
      specialty: number;
      quality: number;
      image: string;
      review: string;
    }
  : T extends "GetEventsInBoxTime"
  ? {
      longitude1: number;
      latitude1: number;
      longitude2: number;
      latitude2: number;
      startTime: string;
      endTime: string;
    }
  : T extends "GetEventsByVenue"
  ? { venueId: string }
  : T extends "CreateProfile"
  ? ProfileProps
  : T extends "GetProfile"
  ? { profileId: string }
  : T extends "GetProfileByUsername"
  ? { username: string }
  : T extends "GetStatuses"
  ? { profileId: string }
  : T extends "GetProfiles"
  ? {}
  : T extends "DeleteProfile"
  ? { profileId: string }
  : T extends "UpdateProfile"
  ? ProfileProps
  : T extends "FollowProfile"
  ? { profileId: string; followingId: string }
  : T extends "UnfollowProfile"
  ? { profileId: string; followingId: string }
  : T extends "SearchProfiles"
  ? { query: string }
  : T extends "GetProfileList"
  ? { profileList: string[] }
  : T extends "CreateTrip"
  ? Omit<TripProps, "_id">
  : T extends "SaveTrip"
  ? TripProps
  : T extends "DeleteTrip"
  ? { creatorId: string; tripId: string }
  : T extends "UpdateTrip"
  ? TripProps
  : T extends "GetTrip"
  ? { tripId: string }
  : T extends "GetUserTrips"
  ? { userId: string }
  : T extends "UploadFile"
  ? {
      file: File;
      title: string;
      prevImage: string;
      onUploadProgress: (progressEvent: any) => void;
    }
  : T extends "GetAdminMetrics"
  ? {}
  : T extends "GetPastNDaysMetrics"
  ? { days: number }
  : T extends "GetVote"
  ? { userId: string; spotId: string }
  : T extends "SetVote"
  ? { userId: string; spotId: string; value: boolean }
  : T extends "CreatePost"
  ? PostProps
  : T extends "GetPost"
  ? { postId: string }
  : T extends "GetUserPosts"
  ? { userId: string }
  : T extends "UpdatePost"
  ? PostProps
  : T extends "DeletePost"
  ? { postId: string; userId: string }
  : T extends "GetFeedPosts"
  ? { userId: string }
  : T extends "CreateFeedback"
  ? FeedbackProps
  : T extends "GetGasStationsInBox"
  ? {
      longitude1: number;
      latitude1: number;
      longitude2: number;
      latitude2: number;
    }
  : T extends "GetGasPriceInBox"
  ? {
      longitude1: number;
      latitude1: number;
      longitude2: number;
      latitude2: number;
    }
  : T extends "GetGasStation"
  ? { stationId: string }
  : T extends "AddGasStation"
  ? GasStationProps
  : T extends "AddGasPrices"
  ? {
      _id: string;
      unleaded: number;
      midgrade: number;
      premium: number;
      diesel: number;
      rating: number;
      userId: string;
    }
  : null;

export interface SiteData {
  id?: string;
  name?: string;
}

type FunctionResponseTypes<T extends Type> = T extends "GetTrip"
  ? TripProps
  : T extends "GetProfiles"
  ? ProfileProps[]
  : T extends "GetProfileList"
  ? ProfileProps[]
  : T extends "GetProfile"
  ? ProfileProps
  : T extends "GetProfileByUsername"
  ? ProfileProps
  : T extends "GetStatuses"
  ? {
      _id: string;
      name: string;
      username: string;
      status: string;
      image: string;
    }[]
  : T extends "GetSpot"
  ? SpotInfoProps
  : T extends "GetSpots"
  ? SpotInfoProps[]
  : T extends "GetSpotsAssemblage"
  ? {
      locations: {
        title: string;
        spots: SpotInfoProps[];
      }[];
      sources: {
        title: string;
        spots: SpotInfoProps[];
      }[];
      subjects: {
        title: string;
        spots: SpotInfoProps[];
      }[];
      trips: TripProps[];
    }
  : T extends "GetSpotsQueue"
  ? SpotInfoProps[]
  : T extends "GetSpotsList"
  ? SpotInfoProps[]
  : T extends "GetSpotsByCenter"
  ? SpotInfoProps[]
  : T extends "GetSpotsInBox"
  ? SpotInfoProps[]
  : T extends "GetHighlightedSpots"
  ? SpotInfoProps[]
  : T extends "GetSpotsByHighlightedGroup"
  ? SpotInfoProps[]
  : T extends "GetSpotsByFeaturedSource"
  ? SpotInfoProps[]
  : T extends "SearchSpots"
  ? SpotInfoProps[]
  : T extends "GetSimilarSpots"
  ? SpotInfoProps[]
  : T extends "GetEventsInBoxTime"
  ? EventProps[]
  : T extends "GetEventsByVenue"
  ? EventProps[]
  : T extends "CreateTrip"
  ? TripProps
  : T extends "UpdateTrip"
  ? TripProps
  : T extends "UpdateProfile"
  ? ProfileProps
  : T extends "SearchProfiles"
  ? ProfileProps[]
  : T extends "GetUserTrips"
  ? TripProps[]
  : T extends "UploadFile"
  ? { uploadUrl: String }
  : T extends "GetAdminMetrics"
  ? AdminMetrics
  : T extends "GetPastNDaysMetrics"
  ? AdminMetrics
  : T extends "GetVote"
  ? SpotInteraction
  : T extends "GetPost"
  ? PostProps
  : T extends "GetUserPosts"
  ? PostProps[]
  : T extends "GetFeedPosts"
  ? PostProps[]
  : T extends "GetFeedback"
  ? FeedbackProps[]
  : T extends "GetGasStationsInBox"
  ? GasStationProps[]
  : T extends "GetGasPriceInBox"
  ? GasPriceProps
  : T extends "GetGasStation"
  ? GasStationProps
  : any;

export type Mutation<T extends Type> = State<T> & {
  commit: (input: Input<T>) => Promise<FunctionResponseTypes<T>>;
  setState: React.Dispatch<React.SetStateAction<State<T>>>;
};

// #endregion

const apiBaseUrl =
  process.env.REACT_APP_STAGE === "dev"
    ? "http://localhost:8080"
    : process.env.REACT_APP_PUBLIC_API_URL;

export function useMutation<T extends Type>(type: T): Mutation<T> {
  const [state, setState] = React.useState<State<T>>({
    loading: false,
    errors: {},
  });

  const commit = React.useCallback(
    async (input: Input<T>): Promise<FunctionResponseTypes<T>> => {
      try {
        setState((prev: State<T>) => ({ ...prev, loading: true, errors: {} }));

        const headers = new Headers({ [`Content-Type`]: `application/json` });
        const idToken = await auth.currentUser?.getIdToken();

        // NOTE: This is a hack to get around the issue of a new user signing in but recoil state is not updating
        if (idToken) {
          headers.set("Authorization", `Bearer ${idToken}`);
        }

        let res: Response;

        console.log("sending request");

        switch (type) {
          case "CreateSpot":
            res = await fetch(`${apiBaseUrl}/api/spots`, {
              method: "POST",
              headers,
              body: JSON.stringify({ ...input }),
            });
            break;
          case "UpdateSpot": {
            const spotId = (input as SpotInfoProps)._id;
            res = await fetch(`${apiBaseUrl}/api/spots/update/${spotId}`, {
              method: "POST",
              headers,
              body: JSON.stringify({ update: { ...input } }),
            });
            break;
          }
          case "DeleteSpot": {
            res = await fetch(`${apiBaseUrl}/api/spots`, {
              method: "DELETE",
              headers,
              body: JSON.stringify({ ...input }),
            });
            break;
          }
          case "GetSpot": {
            const spotId = (input as { spotId: string }).spotId;
            res = await fetch(`${apiBaseUrl}/api/spots/single/${spotId}`, {
              method: "GET",
              headers,
            });
            break;
          }
          case "GetSpots": {
            res = await fetch(`${apiBaseUrl}/api/spots`, {
              method: "GET",
              headers,
            });
            break;
          }
          case "GetSpotsQueue": {
            res = await fetch(`${apiBaseUrl}/api/spots/queue`, {
              method: "GET",
              headers,
            });
            break;
          }
          case "GetSpotsAssemblage": {
            res = await fetch(`${apiBaseUrl}/api/spots/assemblage`, {
              method: "POST",
              headers,
              body: JSON.stringify({ ...input }),
            });
            break;
          }
          case "GetSpotsList": {
            const inputCast = input as { userId: string[] };
            res = await fetch(
              `${apiBaseUrl}/api/spots/saved/${inputCast.userId}`,
              {
                method: "GET",
                headers,
              }
            );
            break;
          }
          case "GetSpotsByCenter": {
            const inputCast = input as { longitude: number; latitude: number };
            res = await fetch(
              `${apiBaseUrl}/api/spots/center/${inputCast.latitude}/${inputCast.longitude}`,
              {
                method: "GET",
                headers,
              }
            );
            break;
          }
          case "GetSpotsInBox": {
            const inputCast = input as {
              longitude1: number;
              latitude1: number;
              longitude2: number;
              latitude2: number;
            };
            res = await fetch(
              `${apiBaseUrl}/api/spots/box/${inputCast.latitude1}/${inputCast.longitude1}/${inputCast.latitude2}/${inputCast.longitude2}`,
              {
                method: "GET",
                headers,
              }
            );
            break;
          }
          case "GetHighlightedSpots": {
            res = await fetch(`${apiBaseUrl}/api/spots/highlighted`, {
              method: "GET",
              headers,
            });
            break;
          }
          case "GetSpotsByHighlightedGroup": {
            const inputCast = input as { subject: string };
            res = await fetch(
              `${apiBaseUrl}/api/spots/highlighted/${inputCast.subject}`,
              {
                method: "GET",
                headers,
              }
            );
            break;
          }
          case "GetSpotsBySource": {
            const inputCast = input as { source: string };
            res = await fetch(
              `${apiBaseUrl}/api/spots/source/${inputCast.source}`,
              {
                method: "GET",
                headers,
              }
            );
            break;
          }
          case "SearchSpots": {
            const inputCast = input as { query: string };
            res = await fetch(`${apiBaseUrl}/api/spots/query`, {
              method: "POST",
              headers,
              body: JSON.stringify({ ...inputCast }),
            });
            break;
          }
          case "GetSimilarSpots": {
            const inputCast = input as { title: string; description: string };
            res = await fetch(`${apiBaseUrl}/api/spots/similar`, {
              method: "POST",
              headers,
              body: JSON.stringify({ ...inputCast }),
            });
            break;
          }
          case "SaveSpotToUser": {
            const inputCast = input as { spotId: string; userId: string };
            res = await fetch(
              `${apiBaseUrl}/api/users/saveSpot/${inputCast.userId}/${inputCast.spotId}`,
              {
                method: "PUT",
                headers,
              }
            );
            break;
          }
          case "UnsaveSpotFromUser": {
            const inputCast = input as { spotId: string; userId: string };
            res = await fetch(
              `${apiBaseUrl}/api/users/unsaveSpot/${inputCast.userId}/${inputCast.spotId}`,
              {
                method: "PUT",
                headers,
              }
            );
            break;
          }
          case "CreateReview": {
            res = await fetch(`${apiBaseUrl}/api/spots/review`, {
              method: "POST",
              headers,
              body: JSON.stringify({ ...input }),
            });
            break;
          }
          case "GetEventsInBoxTime": {
            const inputCast = input as {
              longitude1: number;
              latitude1: number;
              longitude2: number;
              latitude2: number;
              startTime: string;
              endTime: string;
            };
            res = await fetch(
              `${apiBaseUrl}/api/events/boxTime/${inputCast.latitude1}/${inputCast.longitude1}/${inputCast.latitude2}/${inputCast.longitude2}/${inputCast.startTime}/${inputCast.endTime}`,
              {
                method: "GET",
                headers,
              }
            );
            break;
          }
          case "GetEventsByVenue": {
            const inputCast = input as { venueId: string };
            res = await fetch(
              `${apiBaseUrl}/api/events/venue/${inputCast.venueId}`,
              {
                method: "GET",
                headers,
              }
            );
            break;
          }
          case "CreateProfile": {
            res = await fetch(`${apiBaseUrl}/api/users`, {
              method: "POST",
              headers,
              body: JSON.stringify({ ...input }),
            });
            break;
          }
          case "GetProfile": {
            const profileId = (input as { profileId: string }).profileId;
            res = await fetch(`${apiBaseUrl}/api/users/${profileId}`, {
              method: "GET",
              headers,
            });
            break;
          }
          case "GetProfileByUsername": {
            const username = (input as { username: string }).username;
            res = await fetch(`${apiBaseUrl}/api/users/username/${username}`, {
              method: "GET",
              headers,
            });
            break;
          }
          case "GetProfiles": {
            res = await fetch(`${apiBaseUrl}/api/users`, {
              method: "GET",
              headers,
            });
            break;
          }
          case "GetProfileList": {
            const inputCast = input as { profileList: string[] };
            res = await fetch(`${apiBaseUrl}/api/users/list`, {
              method: "POST",
              headers,
              body: JSON.stringify({ ...inputCast }),
            });
            break;
          }
          case "UpdateProfile": {
            const profileId = (input as ProfileProps)._id;
            res = await fetch(`${apiBaseUrl}/api/users/update/${profileId}`, {
              method: "POST",
              headers,
              body: JSON.stringify({ ...input }),
            });
            break;
          }
          case "GetStatuses": {
            const profileId = (input as { profileId: string }).profileId;
            res = await fetch(`${apiBaseUrl}/api/users/statuses/${profileId}`, {
              method: "GET",
              headers,
            });
            break;
          }
          case "DeleteProfile": {
            const profileId = (input as { profileId: string }).profileId;
            res = await fetch(`${apiBaseUrl}/api/users/${profileId}`, {
              method: "DELETE",
              headers,
            });
            break;
          }
          case "FollowProfile": {
            const castedInput = input as {
              profileId: string;
              followingId: string;
            };
            res = await fetch(
              `${apiBaseUrl}/api/users/follow/${castedInput.profileId}/${castedInput.followingId}`,
              {
                method: "PUT",
                headers,
              }
            );
            break;
          }
          case "UnfollowProfile": {
            const castedInput = input as {
              profileId: string;
              followingId: string;
            };
            res = await fetch(
              `${apiBaseUrl}/api/users/unfollow/${castedInput.profileId}/${castedInput.followingId}`,
              {
                method: "PUT",
                headers,
              }
            );
            break;
          }
          case "SearchProfiles": {
            const inputCast = input as { query: string };
            res = await fetch(`${apiBaseUrl}/api/users/query`, {
              method: "POST",
              headers,
              body: JSON.stringify({ ...inputCast }),
            });
            break;
          }
          case "CreateTrip": {
            res = await fetch(`${apiBaseUrl}/api/trips`, {
              method: "POST",
              headers,
              body: JSON.stringify({ ...input }),
            });
            break;
          }
          case "SaveTrip": {
            const castedInput = input as { creatorId: string; _id: string };
            res = await fetch(
              `${apiBaseUrl}/api/trips/${castedInput.creatorId}/${castedInput._id}`,
              {
                method: "PUT",
                headers,
              }
            );
            break;
          }
          case "DeleteTrip": {
            const castedInput = input as { creatorId: string; tripId: string };
            res = await fetch(
              `${apiBaseUrl}/api/trips/${castedInput.creatorId}/${castedInput.tripId}`,
              {
                method: "DELETE",
                headers,
              }
            );
            break;
          }
          case "UpdateTrip": {
            const castedInput = input as { creatorId: string; _id: string };
            res = await fetch(
              `${apiBaseUrl}/api/trips/${castedInput.creatorId}/${castedInput._id}`,
              {
                method: "POST",
                headers,
                body: JSON.stringify({ ...input }),
              }
            );
            break;
          }
          case "GetTrip": {
            const tripId = (input as { tripId: string }).tripId;
            res = await fetch(`${apiBaseUrl}/api/trips/${tripId}`, {
              method: "GET",
              headers,
            });
            break;
          }
          case "GetUserTrips": {
            const userId = (input as { userId: string }).userId;
            res = await fetch(`${apiBaseUrl}/api/trips/user/${userId}`, {
              method: "GET",
              headers,
            });
            break;
          }
          case "UploadFile": {
            const castedInput = input as {
              file: File;
              title: string;
              prevImage: string;
              onUploadProgress: (progressEvent: AxiosProgressEvent) => void;
            };
            const formData = new FormData();
            formData.append("file", castedInput.file);
            formData.append("destFileName", castedInput.title);
            formData.append("prevImage", castedInput.prevImage);

            const config = {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
              onUploadProgress: castedInput.onUploadProgress,
            };
            const axiosRes = await axios.post(
              `${apiBaseUrl}/api/util/image`,
              formData,
              config
            );
            res = new Response(JSON.stringify(axiosRes.data), {
              status: axiosRes.status,
              statusText: axiosRes.statusText,
              headers: {
                "content-type": "application/json",
              },
            });
            break;
          }
          case "GetAdminMetrics": {
            res = await fetch(`${apiBaseUrl}/api/admin/metrics`, {
              method: "GET",
              headers,
            });
            break;
          }
          case "GetPastNDaysMetrics": {
            const days = (input as { days: number }).days;
            res = await fetch(
              `${apiBaseUrl}/api/admin/metrics/window/${days}`,
              {
                method: "GET",
                headers,
              }
            );
            break;
          }
          case "GetVote": {
            const castedInput = input as { userId: string; spotId: string };
            res = await fetch(
              `${apiBaseUrl}/api/votes/${castedInput.userId}/${castedInput.spotId}`,
              {
                method: "GET",
                headers,
              }
            );
            break;
          }
          case "SetVote": {
            const castedInput = input as {
              userId: string;
              spotId: string;
              vote: number;
            };
            res = await fetch(
              `${apiBaseUrl}/api/votes/${castedInput.userId}/${castedInput.spotId}`,
              {
                method: "PUT",
                headers,
                body: JSON.stringify({ vote: castedInput.vote }),
              }
            );
            break;
          }
          case "CreatePost": {
            res = await fetch(`${apiBaseUrl}/api/posts`, {
              method: "POST",
              headers,
              body: JSON.stringify({ ...input }),
            });
            break;
          }
          case "GetPost": {
            const postId = (input as { postId: string }).postId;
            res = await fetch(`${apiBaseUrl}/api/posts/${postId}`, {
              method: "GET",
              headers,
            });
            break;
          }
          case "GetUserPosts": {
            const userId = (input as { userId: string }).userId;
            res = await fetch(`${apiBaseUrl}/api/posts/user/${userId}`, {
              method: "GET",
              headers,
            });
            break;
          }
          case "UpdatePost": {
            const castedInput = input as { postId: string };
            res = await fetch(`${apiBaseUrl}/api/posts/${castedInput.postId}`, {
              method: "PUT",
              headers,
              body: JSON.stringify({ ...input }),
            });
            break;
          }
          case "DeletePost": {
            const postId = (input as { postId: string; userId: string }).postId;
            const userId = (input as { postId: string; userId: string }).userId;
            res = await fetch(`${apiBaseUrl}/api/posts/${postId}/${userId}`, {
              method: "DELETE",
              headers,
            });
            break;
          }
          case "GetFeedPosts": {
            const userId = (input as { userId: string }).userId;
            res = await fetch(`${apiBaseUrl}/api/feed/posts/${userId}`, {
              method: "GET",
              headers,
            });
            break;
          }
          case "CreateFeedback": {
            res = await fetch(`${apiBaseUrl}/api/feedback`, {
              method: "POST",
              headers,
              body: JSON.stringify({ ...input }),
            });
            break;
          }
          case "GetFeedback": {
            res = await fetch(`${apiBaseUrl}/api/feedback`, {
              method: "GET",
              headers,
            });
            break;
          }
          case "GetGasStationsInBox": {
            const castedInput = input as {
              longitude1: number;
              latitude1: number;
              longitude2: number;
              latitude2: number;
            };
            res = await fetch(
              `${apiBaseUrl}/api/gas/stations/box/${castedInput.latitude1}/${castedInput.longitude1}/${castedInput.latitude2}/${castedInput.longitude2}`,
              {
                method: "GET",
                headers,
              }
            );
            break;
          }
          case "GetGasPriceInBox": {
            const castedInput = input as {
              longitude1: number;
              latitude1: number;
              longitude2: number;
              latitude2: number;
            };
            res = await fetch(
              `${apiBaseUrl}/api/gas/avgPrice/box/${castedInput.latitude1}/${castedInput.longitude1}/${castedInput.latitude2}/${castedInput.longitude2}`,
              {
                method: "GET",
                headers,
              }
            );
            break;
          }
          case "GetGasStation": {
            const gasStationId = (input as { gasStationId: string })
              .gasStationId;
            res = await fetch(
              `${apiBaseUrl}/api/gas/stations/${gasStationId}`,
              {
                method: "GET",
                headers,
              }
            );
            break;
          }
          case "AddGasStation": {
            res = await fetch(`${apiBaseUrl}/api/gas/stations`, {
              method: "POST",
              headers,
              body: JSON.stringify({ ...input }),
            });
            break;
          }
          case "AddGasPrices": {
            res = await fetch(`${apiBaseUrl}/api/gas/prices`, {
              method: "POST",
              headers,
              body: JSON.stringify({ ...input }),
            });
            break;
          }
          default:
            throw new TypeError();
        }

        if (res.ok) {
          const data =
            res.status === 204
              ? undefined
              : res.headers.get("content-type")?.includes("application/json")
              ? await res.json()
              : await res.text();
          setState((prev: State<T>) => ({
            ...prev,
            loading: false,
            errors: {},
          }));
          return data;
        } else {
          if (res.status === 401 || res.status === 403) {
            // TODO: Show sign in dialog
            // auth.signIn(...).then(...)
            console.log(res.status, res.statusText);
          }

          const errorRes = await res.json();
          const err = new Error(errorRes.message ?? "Something went wrong.");
          Object.defineProperty(err, "errors", { value: errorRes.errors });
          throw err;
        }
      } catch (err) {
        const message = (err as Error)?.message ?? "Something went wrong.";
        setState((prev: State<T>) => ({
          ...prev,
          loading: false,
          errors: (err as { errors: Record<string, string[]> })?.errors ?? {
            _: [message],
          },
        }));
        throw err;
      }
    },
    [type]
  );

  return React.useMemo(() => ({ ...state, commit, setState }), [state, commit]);
}
