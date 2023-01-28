import "./App.css";
import { Main } from "./components/Main";
import { NavBar } from "./components/NavBar";
import React, { Component } from "react";
import PropTypes from "prop-types";

export function App(): JSX.Element {
  return (
    <div>
      <NavBar />
      <Main />
    </div>
  );
}
