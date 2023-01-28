// import { atom, RecoilState, useRecoilValueLoadable } from "recoil";
// import React from "react";
// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";

// // Use ENV variables to abstract, perhaps?
// // Give users option to save to their own DB while still making my API call
// export const app = initializeApp({
//   projectId: "chainfuse",
//   authDomain: "chainfuse.com",
//   appId: "1:370459782396:web:b906c1397aa085ce62fb79",
//   apiKey: "AIzaSyApwYy2O33hvwo2G3OSt1Vi0TTjvW45UVU",
// });

// const auth = getAuth(app);
// const provider = new GoogleAuthProvider();

// export { auth, provider };

// export const CurrentUser = atom<User | null>({
//   key: "CurrentUser",
//   dangerouslyAllowMutability: true,
//   default: null,
//   effects: [
//     (ctx) => {
//       if (ctx.trigger === "get") {
//         return auth.onAuthStateChanged((user) => {
//           ctx.setSelf(user);
//         });
//       }

//       return undefined;
//     },
//   ],
// });

// export const CurrentUserSelector: RecoilState<User | null> = selector({
//   key: "setCurrentUser", // unique ID (with respect to other atoms/selectors)
//   get: ({ get }) => get(CurrentUser),
//   set: ({ set }, userValue) => {
//     console.log("SETTING STATE!!!!!!!!!!!!!!!!!");

//     set(CurrentUser, userValue);
//   },
// });

// export function useCurrentUser() {
//   const value = useRecoilValueLoadable(CurrentUser);
//   return value.state === "loading" ? undefined : value.valueOrThrow();
// }

// export const FirebaseError = FirebaseErrorObject;
// export type FirebaseError = FirebaseErrorObject;

// export function useGoogleSignIn() {
//   return React.useCallback(async function signIn() {
//     const provider = new GoogleAuthProvider();
//     provider.addScope("profile");
//     provider.addScope("email");

//     const credential = await signInWithPopup(auth, provider);
//     const idToken = await credential.user.getIdToken();

//     fetch("/api/session", {
//       method: "POST",
//       credentials: "include",
//       headers: { Authorization: `Bearer ${idToken}` },
//     });

//     return credential;
//   }, []);
// }

// export function useEmailAndPasswordSignIn() {
//   return React.useCallback(async function signIn(
//     email: string,
//     password: string
//   ) {
//     const credential = await signInWithEmailAndPassword(auth, email, password);

//     const idToken = await credential.user.getIdToken();

//     await fetch("/api/session", {
//       method: "POST",
//       credentials: "include",
//       headers: { Authorization: `Bearer ${idToken}` },
//     });

//     return credential;
//   },
//   []);
// }

// export function useEmailAndPasswordSignUp() {
//   return React.useCallback(async function signIn(
//     email: string,
//     password: string
//   ) {
//     const credential = await createUserWithEmailAndPassword(
//       auth,
//       email,
//       password
//     );

//     const idToken = await credential.user.getIdToken();

//     await fetch("/api/session", {
//       method: "POST",
//       credentials: "include",
//       headers: { Authorization: `Bearer ${idToken}` },
//     });

//     return credential;
//   },
//   []);
// }

// export function useAnonymousSignIn() {
//   return React.useCallback(async function signIn() {
//     const credential = await signInAnonymously(auth);
//     const idToken = await credential.user.getIdToken();

//     console.log("Anonymous sign in", idToken);

//     await fetch("/api/session", {
//       method: "POST",
//       credentials: "include",
//       headers: { Authorization: `Bearer ${idToken}` },
//     });

//     return credential;
//   }, []);
// }

// export function useTwitterSignIn() {
//   return React.useCallback(async function signIn() {
//     const provider = new TwitterAuthProvider();
//     const result = await signInWithPopup(auth, provider);
//     const credential = TwitterAuthProvider.credentialFromResult(result);
//     const user = result.user;
//     const idToken = await user.getIdToken();

//     await fetch("/api/session", {
//       method: "POST",
//       credentials: "include",
//       headers: { Authorization: `Bearer ${idToken}` },
//     });

//     return credential;
//   }, []);
// }

// export function useFacebookSignIn() {
//   return React.useCallback(async function signIn() {
//     const provider = new FacebookAuthProvider();

//     // provider.addScope("profile");
//     // provider.addScope("email");

//     const result = await signInWithPopup(auth, provider);
//     const credential = TwitterAuthProvider.credentialFromResult(result);
//     const user = result.user;
//     const idToken = await user.getIdToken();

//     await fetch("/api/session", {
//       method: "POST",
//       credentials: "include",
//       headers: { Authorization: `Bearer ${idToken}` },
//     });

//     return credential;
//   }, []);
// }

// export function useYahooSignIn() {
//   return React.useCallback(async function signIn() {
//     const provider = new OAuthProvider("yahoo.com");

//     provider.addScope("profile");
//     provider.addScope("email");

//     const result = await signInWithPopup(auth, provider);
//     const credential = OAuthProvider.credentialFromResult(result);
//     const user = result.user;
//     const idToken = await user.getIdToken();

//     await fetch("/api/session", {
//       method: "POST",
//       credentials: "include",
//       headers: { Authorization: `Bearer ${idToken}` },
//     });

//     return credential;
//   }, []);
// }

// export function useSignOut() {
//   return React.useCallback(function signOut() {
//     return auth.signOut().then(() =>
//       fetch("/api/session", {
//         method: "DELETE",
//         credentials: "include",
//       }).then(() => undefined)
//     );
//   }, []);
// }

export function sayHi() {
  console.log("Hi");
}
