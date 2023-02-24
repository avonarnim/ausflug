import * as React from "react";
import { auth } from "./firebase";
import { SpotInfoProps } from "../components/SpotInfo";
import { ProfileProps } from "../pages/Profile";
import { TripProps } from "../pages/EditTrip";

// #region TypeScript Definitions

type Type =
  | "CreateSpot"
  | "UpdateSpot"
  | "DeleteSpot"
  | "GetSpot"
  | "GetSpots"
  | "GetSpotsByCenter"
  | "GetSpotsInBox"
  | "CreateProfile"
  | "GetProfile"
  | "GetProfiles"
  | "DeleteProfile"
  | "UpdateProfile"
  | "FollowProfile"
  | "UnfollowProfile"
  | "SaveTrip"
  | "DeleteTrip"
  | "UpdateTrip"
  | "GetTrip";

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
  : T extends "GetSpotsByCenter"
  ? { longitude: number; latitude: number }
  : T extends "GetSpotsInBox"
  ? {
      longitude1: number;
      latitude1: number;
      longitude2: number;
      latitude2: number;
    }
  : T extends "CreateProfile"
  ? ProfileProps
  : T extends "GetProfile"
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
  : T extends "SaveTrip"
  ? TripProps
  : T extends "DeleteTrip"
  ? { creatorId: string; tripId: string }
  : T extends "UpdateTrip"
  ? TripProps
  : T extends "GetTrip"
  ? { tripId: string }
  : null;

export interface SiteData {
  id?: string;
  name?: string;
}

type FunctionResponseTypes<T extends Type> = T extends "GetTrip"
  ? TripProps
  : T extends "GetProfiles"
  ? ProfileProps[]
  : T extends "GetProfile"
  ? ProfileProps
  : T extends "GetSpot"
  ? SpotInfoProps
  : T extends "GetSpots"
  ? SpotInfoProps[]
  : T extends "GetSpotsByCenter"
  ? SpotInfoProps[]
  : T extends "GetSpotsInBox"
  ? SpotInfoProps[]
  : any;

export type Mutation<T extends Type> = State<T> & {
  commit: (input: Input<T>) => Promise<FunctionResponseTypes<T>>;
  setState: React.Dispatch<React.SetStateAction<State<T>>>;
};

// #endregion

const apiBaseUrl =
  process.env.REACT_APP_STAGE === "dev"
    ? "http://localhost:3001"
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

        switch (type) {
          case "CreateSpot":
            res = await fetch(`${apiBaseUrl}/api/spots`, {
              method: "POST",
              headers,
              body: JSON.stringify({ ...input }),
            });
            break;
          case "UpdateSpot": {
            const spotId = (input as SpotInfoProps).id;
            res = await fetch(`${apiBaseUrl}/api/spots/${spotId}`, {
              method: "UPDATE",
              headers,
              body: JSON.stringify({ ...input }),
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
            res = await fetch(`${apiBaseUrl}/api/spots/${spotId}`, {
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
          case "GetSpotsByCenter": {
            const inputCast = input as { longitude: number; latitude: number };
            res = await fetch(
              `${apiBaseUrl}/api/spots/${inputCast.latitude}/${inputCast.longitude}`,
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
              `${apiBaseUrl}/api/spots/${inputCast.latitude1}/${inputCast.longitude1}/${inputCast.latitude2}/${inputCast.longitude2}`,
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
          case "GetProfiles": {
            res = await fetch(`${apiBaseUrl}/api/users`, {
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
          case "SaveTrip": {
            const castedInput = input as { creatorId: string; id: string };
            res = await fetch(
              `${apiBaseUrl}/api/trips/${castedInput.creatorId}/${castedInput.id}`,
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
            const castedInput = input as { creatorId: string; id: string };
            res = await fetch(
              `${apiBaseUrl}/api/trips/${castedInput.id}/${castedInput.creatorId}`,
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
