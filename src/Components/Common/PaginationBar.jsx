import React from "react";
import previousPageIcon from "../../Material/Images/previous_page.png";
import nextPageIcon from "../../Material/Images/nextpage_icon.png";
import { usePagination, useProjectActions } from "../../store/useProjectStore";

import styles from "./PaginationBar.module.css";

/**
 * PaginationBar Component
 * 
 */
export const PaginationBar = ({
  pageNumber: propPageNumber,
  totalPages: propTotalPages,
  onPageChange: propOnPageChange,
  maxVisiblePages = 5,
}) => {
  // Read from store unconditionally
  const storePagination = usePagination();
  const storeActions = useProjectActions();

  const pageNumber =
    propPageNumber !== undefined
      ? propPageNumber
      : storePagination?.pageNumber ?? 0;

  const totalPages =
    propTotalPages !== undefined
      ? propTotalPages
      : storePagination?.totalPages ?? 0;

  const handlePageChange = (targetPage) => {
    if (targetPage === pageNumber || targetPage < 0 || targetPage >= totalPages) {
      return;
    }
    if (propOnPageChange) {
      propOnPageChange(targetPage);
    } else if (storeActions?.setPage) {
      storeActions.setPage(targetPage);
    }
  };

  // Do not render pagination bar if there is 1 or 0 pages
  if (totalPages <= 1) {
    return null;
  }

  // Calculate sliding window of page numbers (e.g. [0, 1, 2, 3] for 4 pages)
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    let start = Math.max(0, pageNumber - Math.floor(maxVisiblePages / 2));
    let end = start + maxVisiblePages;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(0, end - maxVisiblePages);
    }

    return Array.from({ length: end - start }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();
  const isFirstPage = pageNumber === 0;
  const isLastPage = pageNumber >= totalPages - 1;

  return (
    <nav
      className={styles.paginationContainer}
      aria-label="Projects list pagination"
    >
      <div className={styles.paginationGroup} role="group" aria-label="Pagination">
        {/* Previous page button («) */}
        <button
          type="button"
          className={`${styles.paginationItem} ${
            isFirstPage ? styles.disabledItem : styles.navButton
          }`}
          onClick={() => handlePageChange(pageNumber - 1)}
          disabled={isFirstPage}
          aria-label="Previous page"
          title="Previous page"
        >
          <span className={styles.iconWrapper}>
            <img src={previousPageIcon} alt="«" />
          </span>
        </button>

        {/* Page number buttons (1, 2, 3, 4...) */}
        {visiblePages.map((p) => {
          const isActive = p === pageNumber;
          return (
            <button
              type="button"
              key={p}
              className={`${styles.paginationItem} ${
                isActive ? styles.activePage : styles.linkPage
              }`}
              onClick={() => handlePageChange(p)}
              disabled={isActive}
              aria-current={isActive ? "page" : undefined}
              aria-label={`Page ${p + 1}`}
            >
              {p + 1}
            </button>
          );
        })}

        {/* Next page button (») */}
        <button
          type="button"
          className={`${styles.paginationItem} ${
            isLastPage ? styles.disabledItem : styles.navButton
          }`}
          onClick={() => handlePageChange(pageNumber + 1)}
          disabled={isLastPage}
          aria-label="Next page"
          title="Next page"
        >
          <span className={styles.iconWrapper}>
            <img src={nextPageIcon} alt="»" />
          </span>
        </button>
      </div>
    </nav>
  );
};

export default PaginationBar;
