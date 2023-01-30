import * as React from "react";
import { auth } from "./firebase";

// #region TypeScript Definitions

type Type =
  | "CreateProject"
  | "GetWalletNFTs"
  | "GetHighlightedCollections"
  | "GetHighlightedNfts"
  | "GetHighlightedProfiles"
  | "GetProfile";

type State<T extends Type> = {
  loading: boolean;
  errors: {
    [key in keyof Input<T> | "_"]?: string[];
  };
};

type GetBasedOnIdentifier = {
  id: string;
  identifier: string;
};

type Input<T extends Type> = T extends "CreateProject"
  ? {
      id: string;
      name: string;
    }
  : T extends "GetWalletNFTs"
  ? GetBasedOnIdentifier
  : T extends "GetHighlightedCollections"
  ? { id: string }
  : T extends "GetHighlightedNfts"
  ? { id: string }
  : T extends "GetHighlightedProfiles"
  ? { id: string }
  : T extends "GetProfile"
  ? GetBasedOnIdentifier
  : null;

export interface SiteData {
  id?: string;
  name?: string;
}

export interface WalletNFTData {
  eth: {
    ownedNfts: {
      rawMetadata: {
        name: string;
        image: string;
        external_link: string;
        description: string;
      };
      tokenType: string;
    }[];
  };
  polygon: {
    ownedNfts: {
      rawMetadata: {
        name: string;
        image: string;
        external_link: string;
        description: string;
      };
      tokenType: string;
    }[];
  };
}

export interface HighlightedCollectionData {
  highlightedCollections: {
    collections: {
      voucher: any;
      nfts: { ipfsPin: string }[];
      userId: string;
      userAddress: string;
      chainId: string;
      collectionId: string;
      collectionName: string;
      collectionDescription: string;
      collectionAvatar: string;
    }[];
    objectID: string;
  };
}
export interface HighlightedNftData {
  highlightedNfts: {
    nfts: {
      objectID: string;
      collectionId: string;
      registrationId: string;
      name: string;
      external_url: string;
      price: any;
      supply: number;
      file: string;
      pin: {
        supply: string;
        bucketFileName: string;
        originalType: string;
        ipfsPinUrl: string;
        type: string;
        originalName: string;
        price: string;
        url: string;
        name: string;
        ipfsPin: string;
      };
    }[];
    objectID: string;
  };
}
export interface HighlightedProfileData {
  highlightedProfiles: {
    profiles: {
      profileId: string;
      name: string;
      bio: string;
      userId: string;
      siteUrl: string;
      avatar: string;
      [key: string]: any;
    }[];
    objectID: string;
  };
}

export interface FirebaseProfileData {
  name: string;
  bio: string;
  avatar: string;
  telegram: string;
  title: string;
  siteUrl: string;
  instagram: string;
  twitter: string;
  address: string;
  project: string;
  userId: string;
  [key: string]: any;
}

type FunctionResponseTypes<T extends Type> = T extends "GetWalletNFTs"
  ? WalletNFTData
  : T extends "GetHighlightedCollections"
  ? HighlightedCollectionData
  : T extends "GetHighlightedNfts"
  ? HighlightedNftData
  : T extends "GetHighlightedProfiles"
  ? HighlightedProfileData
  : T extends "CreateProject"
  ? SiteData | undefined
  : T extends "GetProfile"
  ? FirebaseProfileData
  : any;

export type Mutation<T extends Type> = State<T> & {
  commit: (input: Input<T>) => Promise<FunctionResponseTypes<T>>;
  setState: React.Dispatch<React.SetStateAction<State<T>>>;
};

// #endregion

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
          case "CreateProject":
            res = await fetch(`/api/projects/create`, {
              method: "POST",
              headers,
              body: JSON.stringify({ ...input }),
            });
            break;
          case "GetWalletNFTs": {
            const walletIdentifier = (input as GetBasedOnIdentifier).identifier;
            res = await fetch(
              `/api/nft/walletNFTs/${walletIdentifier}/${input.id}`,
              {
                method: "GET",
                headers,
              }
            );
            break;
          }
          case "GetHighlightedCollections":
            res = await fetch(`api/nft/highlightedCollections/${input.id}`, {
              method: "GET",
              headers,
            });
            break;
          case "GetHighlightedNfts":
            res = await fetch(`api/nft/highlightedNfts/${input.id}`, {
              method: "GET",
              headers,
            });
            break;
          case "GetHighlightedProfiles":
            res = await fetch(`api/nft/highlightedProfiles/${input.id}`, {
              method: "GET",
              headers,
            });
            break;
          case "GetProfile": {
            const profileIdentifier = (input as GetBasedOnIdentifier)
              .identifier;
            res = await fetch(`/api/sites/${profileIdentifier}/${input.id}`, {
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
