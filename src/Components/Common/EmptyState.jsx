import React from "react";
import PropTypes from "prop-types";
import styles from "./EmptyState.module.css";

const EmptyState = ({ title, subtitle, icon }) => {
  return (
    <div className={styles.emptyStateContainer}>
      <div className={styles.emptyStateIconWrapper}>
        {icon || (
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        )}
      </div>
      <h4 className={styles.emptyStateTitle}>{title}</h4>
      {subtitle && <p className={styles.emptyStateSubtext}>{subtitle}</p>}
    </div>
  );
};

EmptyState.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  icon: PropTypes.node,
};

export default EmptyState;
