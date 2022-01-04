import "./App.css";
import Main from "./components/Main.jsx";
import NavBar from "./components/NavBar.jsx";
import React, { Component } from "react";
import PropTypes from "prop-types";

class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <Main />
      </div>
    );
  }
}

export default App;
