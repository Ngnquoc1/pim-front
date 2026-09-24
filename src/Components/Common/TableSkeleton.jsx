import React from "react";
import PropTypes from "prop-types";
import { Table } from "react-bootstrap";
import styles from "./TableSkeleton.module.css";

const TableSkeleton = ({ rows = 5, headers = [] }) => {
  return (
    <Table hover responsive bordered className={`project-grid-table mb-2 ${styles.skeletonTable}`}>
      {headers && headers.length > 0 && (
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className={h.className} style={h.style}>
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {Array.from({ length: rows }).map((_, idx) => (
          <tr key={idx}>
            <td className="text-center align-middle">
              <span className={styles.skeletonBox} style={{ width: "16px", height: "16px" }} />
            </td>
            <td className="text-right align-middle">
              <span className={styles.skeletonLine} style={{ width: "45px" }} />
            </td>
            <td className="text-left align-middle">
              <span className={styles.skeletonLine} style={{ width: `${55 + (idx * 9) % 35}%` }} />
            </td>
            <td className="text-left align-middle">
              <span className={styles.skeletonLine} style={{ width: "65px" }} />
            </td>
            <td className="text-left align-middle">
              <span className={styles.skeletonLine} style={{ width: `${45 + (idx * 13) % 40}%` }} />
            </td>
            <td className="text-center align-middle">
              <span className={styles.skeletonLine} style={{ width: "75px" }} />
            </td>
            <td className="text-center align-middle">
              <span className={styles.skeletonBox} style={{ width: "18px", height: "18px" }} />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

TableSkeleton.propTypes = {
  rows: PropTypes.number,
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node,
      className: PropTypes.string,
      style: PropTypes.object,
    })
  ),
};

export default TableSkeleton;
