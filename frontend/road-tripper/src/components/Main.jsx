import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import EditTripPage from "../pages/EditTripPage";
import SpotsPage from "../pages/SpotsPage";
import ProfilePage from "../pages/ProfilePage";

const Main = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/trips/:tripId?" element={<EditTripPage />}></Route>
        <Route path="/spots" element={<SpotsPage />}></Route>
        <Route path="/profile" element={<ProfilePage />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Main;
