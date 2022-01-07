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

## Scripts:

`nodemon server`

which runs the backend in development mode at http://localhost:3001 and
reloads upon edit.

# Frontend

The frontend was built using React, which starts in the `public/index.html` file.
The `root` div is grabbed in `src/index.js` and replaced by App in `App.js`.
There, Main and NavBar components are rendered. Main routes users to the home
page, profile page, spot creation page, and trip creation page.

There are forms in the home, spot, and trip pages.
The home page lets users sign up for a new account. Password authentication is
done using bcrypt, which has a compareSync method. Password hashing is done by
bcrypt's hashSync method, which automatically generates a salt before hashing.

## Scripts:

`npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.
