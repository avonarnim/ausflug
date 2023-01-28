import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Home } from "../pages/Home";
import { EditTripPage } from "../pages/EditTripPage";
import { SpotsPage } from "../pages/SpotsPage";
import { ProfilePage } from "../pages/ProfilePage";

export function Main(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        {/* <Route path="/trips" element={<EditTripPage />}>
          <Route path=":tripId" element={<EditTripPage />} />
        </Route>
        <Route path="/spots" element={<SpotsPage />}></Route>
        <Route path="/profile" element={<ProfilePage />}></Route> */}
      </Routes>
    </BrowserRouter>
  );
}
