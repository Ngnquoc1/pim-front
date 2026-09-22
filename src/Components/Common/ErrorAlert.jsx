import React from "react";
import Translate from "react-translate-component";
import styles from "./ErrorAlert.module.css";

/**
 * Generic Reusable ErrorAlert Component.
 * Supports i18n translation keys (`content`), dynamic strings (`message`),
 * custom JSX (`children`), dismissible close button (`onDismiss`),
 * and Bootstrap alert variants (default: "danger").
 */
function ErrorAlert({
  show = true,
  content,
  message,
  children,
  onDismiss,
  variant = "danger",
  className = "",
}) {
  // If show is false or there is no content to display, render nothing
  if (!show || (!content && !message && !children)) {
    return null;
  }

  return (
    <div
      className={`alert alert-${variant} ${styles.errorAlert} ${className}`}
      role="alert"
    >
      <span className={styles.alertMessage}>
        {content && <Translate content={content} />}
        {message && message}
        {children}
      </span>

      {onDismiss && (
        <button
          type="button"
          className={styles.closeBtn}
          aria-label="Close"
          onClick={onDismiss}
        >
          &times;
        </button>
      )}
    </div>
  );
}

export default ErrorAlert;
