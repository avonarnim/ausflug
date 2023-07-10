# Road Tripper

#### Overview

Road-Tripper is a full-stack app designed to help users plan a route through
multiple intermediary stops. Users can:

1. Create an account, log-in to the account, and log-out of the account
2. Add spots to the spot database
3. Create, edit, and save a trip that goes between start and end destinations.
4. View their profile, containing links to their saved trips and other users they
   follow

When creating a trip, potential stops are suggested if they are within a certain
bounding box of the start and end points. The bounding box is calculated with the
expectation that Manhattan travel distances correlate exactly with drive times. A
travel time variable is also calculated based on the average time spent at each
given stop. Users can also specify max costs and minimum ratings when requesting
potential stops.

It was built using the MERN stack: MongoDB, Express, React, and Node JS.

# Backend

The backend was built using MongoDB, Express, and Node JS. Start by looking at
the `server.js` file, which instantiates a connection to the MongoDB database and
creates an Express-backed API which relies on the `routes.js` file to route
requests to their controllers. The controllers rely on the models to answer post/
put/get/update/delete requests.

Keys should be placed both in `env.yaml` (for GCP to recognize process.env.\_\_\_)
as well as `.env` for local development.

Dependencies are handled by npm

## Scripts:

`nodemon server`

which runs the backend in development mode at http://localhost:3001 and
reloads upon edit.
To ensure successful runs, make sure a MongoDB cluster is connected, and a
current IP address is whitelisted.

# Frontend

The frontend was built using React, which starts in the `public/index.html` file.
The `root` div is grabbed in `src/index.js` and replaced by App in `App.js`.
There, Main and NavBar components are rendered. Main routes users to the home
page, profile page, spot creation page, and trip creation page.

There are forms in the home, spot, and trip pages.
The home page lets users sign up for a new account. Password authentication is
done using bcrypt, which has a compareSync method. Password hashing is done by
bcrypt's hashSync method, which automatically generates a salt before hashing.

Note that the important typings that are copied from the backend are found in the following files:
`frontend/road-tripper/src/components/SpotInfo.tsx`
`pages/EditTrip.tsx`
`pages/Profile.tsx`

## Scripts:

`npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Deploying the Backend

The backend API server is hosted in GCP. It is built using Docker. The following commands are used (running from the `backend` folder):

```
<!-- This creates an image named backend -->
1  docker build -t backend .
<!-- This will show that the backend image has been created -->
2  docker images
<!-- This will run the image in a container -->
3  PORT=8080 && docker run --rm backend
4  gcloud run deploy --env-vars-file=env.yaml
<!-- Options: deploying from source w default name, region 37 -->
```

## Deploying the Frontend

Vercel is used to serve the frontend. Vercel is mostly a frontend-oriented hosting service. It is automatically updated when the master branch is pushed-to. This connection was established from the Vercel dashboard.
