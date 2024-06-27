import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";

class Tostify extends Component {
  notify = () => {
    toast.success("Successfully logged in!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  render() {
    return (
      <div>
        <button onClick={this.notify}>Notify!</button>
        <ToastContainer />
      </div>
    );
  }
}

export default Tostify;
