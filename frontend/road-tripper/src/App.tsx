import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { CssBaseline, ThemeProvider, Toolbar } from "@mui/material";
import { NavBar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { useTheme } from "./core/theme";
import { Route, Routes } from "react-router-dom";
import {
  AddSpot,
  Admin,
  // Donate,
  EditTrip,
  Home,
  Login,
  Privacy,
  Profile,
  Register,
  Search,
  Spot,
  Settings,
  Terms,
} from "./pages/index";
import { AuthProvider } from "./core/AuthContext";

function App() {
  const theme = useTheme();

  console.log("Theme", theme);

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NavBar />
        <Toolbar />
        <Routes>
          <Route index element={<React.Suspense children={<Home />} />} />
          <Route
            path="/privacy"
            element={<React.Suspense children={<Privacy />} />}
          />
          <Route
            path="/trips/:tripId"
            element={<React.Suspense children={<EditTrip />} />}
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
            path="/profile"
            element={<React.Suspense children={<Profile />} />}
          />
          <Route
            path="/profile/:userId"
            element={<React.Suspense children={<Profile />} />}
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
          {/* <Route
            path="/donate"
            element={<React.Suspense children={<Donate />} />}
          /> */}
        </Routes>
        <Footer />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
