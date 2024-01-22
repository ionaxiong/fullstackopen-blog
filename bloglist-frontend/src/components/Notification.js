import React from "react";
import { Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectNotification } from "../reducers/notificationReducer";

const Notification = () => {
  const { message, type } = useSelector(selectNotification);

  const variant = type === "error" ? "danger" : "success";
  if (message !== "") {
    return <Alert variant={variant}> hello {message} </Alert>;
  }
};

export default Notification;
