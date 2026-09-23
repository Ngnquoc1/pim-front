import React, { useState, useMemo } from "react";
import { Table, Spinner } from "react-bootstrap";
import Translate from "react-translate-component";
import counterpart from "counterpart";

import TrashIcon from "../Common/TrashIcon";
import PaginationBar from "../Common/PaginationBar";
import ProjectListItem from "./ProjectListItem";
import { useProjects, useProjectLoading, useProjectActions, useLocale, useSortConfig } from "../../store/useProjectStore";

import { sortProjects } from "../../utils/sortUtils";

import styles from "./ProjectList.module.css";

export const ProjectList = () => {
  useLocale(); // Trigger re-render when language changes
  const projects = useProjects();
  const loading = useProjectLoading();
  const sortConfig = useSortConfig();
  const { deleteProjects, setSortConfig } = useProjectActions();

  // Selected project IDs state
  const [selectedIds, setSelectedIds] = useState([]);

  const sortedProjects = useMemo(() => {
    return sortProjects(projects, sortConfig);
  }, [projects, sortConfig]);

  const renderSortIcon = (field) => {
    const isActive = sortConfig.field === field;
    if (isActive) {
      return (
        <span className={`${styles.sortIcon} ${styles.sortIconActive}`}>
          {sortConfig.direction === "asc" ? "▲" : "▼"}
        </span>
      );
    }
    return (
      <span className={`${styles.sortIcon} ${styles.sortIconInactive}`}>
        ↕
      </span>
    );
  }

  // Toggle single row selection
  const handleToggleSelected = (id) => {
    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((selectedId) => selectedId !== id)
        : [...prevSelectedIds, id]
    );
  };

  // Check if all projects are currently selected
  const isAllSelected = projects.length > 0 && selectedIds.length === projects.length;

  // Toggle select / deselect all rows
  const handleToggleAllSelected = () => {
    setSelectedIds(isAllSelected ? [] : projects.map((project) => project.id));
  };

  // Unified delete handler (single delete and bulk delete)
  const handleDeleteProjects = async (idsToDelete) => {
    if (!idsToDelete || idsToDelete.length === 0) return;

    // Filter projects matching the target IDs to delete
    const targetProjects = projects.filter((project) => idsToDelete.includes(project.id));

    // Business rule: Only projects with status 'NEW' can be deleted
    const hasNonNewProject = targetProjects.some((p) => p.status !== "NEW");
    if (hasNonNewProject) {
      alert(counterpart.translate("projectList.warningDeleteNewOnly"));
      return;
    }

    // Confirmation dialog before deletion
    const confirmed = window.confirm(counterpart.translate("projectList.confirmDelete"));
    if (!confirmed) return;

    try {
      await deleteProjects(idsToDelete);
      // Remove deleted IDs from selected IDs
      setSelectedIds((prev) => prev.filter((id) => !idsToDelete.includes(id)));
    } catch (error) {
      console.error("Delete failed: ", error);
      // Handle business errors (4xx) with user alert (5xx errors are handled globally by api.js)
      if (error.response && error.response.status < 500) {
        alert(error.response.data?.message || "Delete failed");
      }
    }
  };

  return (
    <div className="project-list-table-container">
      {/* Loading spinner */}
      {loading && (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )}

      {/* Project grid table */}
      {!loading && (
        <>
          <Table hover responsive bordered className={`project-grid-table mb-2 ${styles.projectGridTable}`}>
            <thead>
              <tr>
                {/* Header checkbox */}
                <th className="text-center align-middle" style={{ width: "40px" }}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleAllSelected}
                    style={{ width: "15px", height: "15px", cursor: "pointer" }}
                  />
                </th>

                {/* Number column */}
                <th
                  className={`text-right align-middle ${styles.sortableHeader}`}
                  style={{ width: "100px" }}
                  onClick={() => setSortConfig("projectNumber")}
                  aria-sort={sortConfig.field === "projectNumber"
                    ? sortConfig.direction === "asc" ? "ascending" : "descending"
                    : "none"
                  }>
                  <Translate content="projectList.colNumber" />
                  {renderSortIcon("projectNumber")}
                </th>

                {/* Name column */}
                <th
                  className={`text-left align-middle ${styles.sortableHeader}`}
                  onClick={() => setSortConfig("name")}
                  aria-sort={sortConfig.field === "name"
                    ? sortConfig.direction === "asc" ? "ascending" : "descending"
                    : "none"
                  }
                >
                  <Translate content="projectList.colName" />
                  {renderSortIcon("name")}
                </th>

                {/* Status column */}
                <th
                  className={`text-left align-middle ${styles.sortableHeader}`}
                  style={{ width: "140px" }}
                  onClick={() => setSortConfig("status")}
                  aria-sort={
                    sortConfig.field === "status"
                      ? sortConfig.direction === "asc" ? "ascending" : "descending"
                      : "none"
                  }
                >
                  <Translate content="projectList.colStatus" />
                  {renderSortIcon("status")}
                </th>

                {/* Customer column */}
                <th
                  className={`text-left align-middle ${styles.sortableHeader}`}
                  style={{ width: "220px" }}
                  onClick={() => setSortConfig("customer")}
                  aria-sort={
                    sortConfig.field === "customer"
                      ? sortConfig.direction === "asc" ? "ascending" : "descending"
                      : "none"
                  }
                >
                  <Translate content="projectList.colCustomer" />
                  {renderSortIcon("customer")}
                </th>

                {/* Start date column */}
                <th
                  className={`text-center align-middle ${styles.sortableHeader}`}
                  style={{ width: "130px" }}
                  onClick={() => setSortConfig("startDate")}
                  aria-sort={
                    sortConfig.field === "startDate"
                      ? sortConfig.direction === "asc" ? "ascending" : "descending"
                      : "none"
                  }
                >
                  <Translate content="projectList.colStartDate" />
                  {renderSortIcon("startDate")}
                </th>

                {/* Delete column */}
                <th className="text-center align-middle" style={{ width: "95px" }}>
                  <Translate content="projectList.colDelete" />
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedProjects.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    <Translate content="projectList.noDataFound" />
                  </td>
                </tr>
              ) : (
                sortedProjects.map((project) => (
                  <ProjectListItem
                    key={project.id}
                    project={project}
                    isSelected={selectedIds.includes(project.id)}
                    onToggleSelected={handleToggleSelected}
                    onDeleteProject={handleDeleteProjects}
                  />
                ))
              )}
            </tbody>
          </Table>

          {/* Bulk delete banner directly under table per image7.png */}
          {selectedIds.length > 0 && (
            <div className={styles.bulkDeleteBanner}>
              <span className={styles.selectedCount}>
                {selectedIds.length} <Translate content="projectList.itemsSelected" />
              </span>

              <button
                type="button"
                onClick={() => handleDeleteProjects(selectedIds)}
                className="btn-pim-danger-link"
              >
                <span>
                  <Translate content="projectList.deleteSelected" />
                </span>
                <TrashIcon size={16} />
              </button>
            </div>
          )}

          <PaginationBar />
        </>
      )}
    </div>
  );
};

export default ProjectList;
