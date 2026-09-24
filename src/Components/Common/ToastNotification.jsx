import React from "react";
import PropTypes from "prop-types";
import styles from "./ToastNotification.module.css";

const ToastNotification = ({ message }) => {
  if (!message) return null;

  return (
    <div className={styles.toastContainer} role="status">
      <span className={styles.toastIcon}>✓</span>
      <span>{message}</span>
    </div>
  );
};

ToastNotification.propTypes = {
  message: PropTypes.string,
};

export default ToastNotification;
