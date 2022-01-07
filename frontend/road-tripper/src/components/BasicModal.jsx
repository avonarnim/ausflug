import React, { Component, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Modal from "react-modal";
import axios from "axios";

export default class BasicModal extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      showModal: false,
    };
  }

  render() {
    if (!this.props.showModal) {
      return null;
    } else {
      this.state.showModal = true;
    }
    const showClassName = this.state.showModal
      ? "modals"
      : "modals display-none";

    return (
      <div className={showClassName}>
        <div className="modal-main">{this.props.children}</div>
      </div>
    );
  }
}
