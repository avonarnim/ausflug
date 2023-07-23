import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { CssBaseline, ThemeProvider, Toolbar } from "@mui/material";
import { NavBar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { useTheme } from "./core/theme";
import { Route, Routes } from "react-router-dom";
import {
  About,
  AddSpot,
  Admin,
  // Donate,
  EditTrip,
  Feed,
  Gas,
  Home,
  Login,
  NewTrip,
  Privacy,
  Profile,
  RandomTrip,
  Register,
  Search,
  Spot,
  Settings,
  Terms,
  TripGuide,
  Trips,
} from "./pages/index";
import { AuthProvider } from "./core/AuthContext";

function App() {
  const theme = useTheme();

  console.log("Theme", theme);

  return (
    <div className="app-wrapper">
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <NavBar />
          <Toolbar />
          <div className="routes-wrapper">
            <Routes>
              <Route index element={<React.Suspense children={<Home />} />} />
              <Route
                path="/privacy"
                element={<React.Suspense children={<Privacy />} />}
              />
              <Route
                path="/about"
                element={<React.Suspense children={<About />} />}
              />
              <Route
                path="/trips"
                element={<React.Suspense children={<Trips />} />}
              />
              <Route
                path="/trips/:oneWayRoundTrip/:origin/:originVal/:destination/:destinationVal/:startDate?/:endDate?"
                element={<React.Suspense children={<NewTrip />} />}
              />
              <Route
                path="/trips/:tripId"
                element={<React.Suspense children={<EditTrip />} />}
              />
              <Route
                path="/trips/random/:origin/:originVal"
                element={<React.Suspense children={<RandomTrip />} />}
              />
              <Route
                path="/spots/:spotId"
                element={<React.Suspense children={<Spot />} />}
              />
              <Route
                path="/addSpot"
                element={<React.Suspense children={<AddSpot />} />}
              />
              <Route
                path="/search"
                element={<React.Suspense children={<Search />} />}
              />
              <Route
                path="/activity"
                element={<React.Suspense children={<Feed />} />}
              />
              <Route
                path="/profile"
                element={
                  <React.Suspense children={<Profile indicator={"none"} />} />
                }
              />
              <Route
                path="/profile/:userId"
                element={
                  <React.Suspense children={<Profile indicator={"id"} />} />
                }
              />
              <Route
                path="/profile/u/:username"
                element={
                  <React.Suspense
                    children={<Profile indicator={"username"} />}
                  />
                }
              />
              <Route
                path="/terms"
                element={<React.Suspense children={<Terms />} />}
              />
              <Route
                path="/settings"
                element={<React.Suspense children={<Settings />} />}
              />
              <Route
                path="/admin"
                element={<React.Suspense children={<Admin />} />}
              />
              <Route
                path="/register"
                element={<React.Suspense children={<Register />} />}
              />
              <Route
                path="/login"
                element={<React.Suspense children={<Login />} />}
              />
              <Route
                path="/gas"
                element={<React.Suspense children={<Gas />} />}
              />
              <Route
                path="/guide/:name"
                element={<React.Suspense children={<TripGuide />} />}
              />
              {/* <Route
            path="/donate"
            element={<React.Suspense children={<Donate />} />}
          /> */}
            </Routes>
          </div>
          <Footer />
        </ThemeProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
