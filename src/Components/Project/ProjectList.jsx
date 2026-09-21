import React, { useState } from "react";
import { Table, Spinner } from "react-bootstrap";
import Translate from "react-translate-component";
import counterpart from "counterpart";

import TrashIcon from "../Common/TrashIcon";
import ProjectListItem from "./ProjectListItem";
import { useProjects, useProjectLoading, useProjectActions, useLocale } from "../../store/useProjectStore";

import styles from "./ProjectList.module.css";

export const ProjectList = () => {
  useLocale(); // Trigger re-render when language changes
  const projects = useProjects();
  const loading = useProjectLoading();
  const { deleteProjects } = useProjectActions();

  // Selected project IDs state
  const [selectedIds, setSelectedIds] = useState([]);

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
                <th className="text-right align-middle" style={{ width: "100px" }}>
                  <Translate content="projectList.colNumber" />
                </th>

                {/* Name column */}
                <th className="text-left align-middle">
                  <Translate content="projectList.colName" />
                </th>

                {/* Status column */}
                <th className="text-left align-middle" style={{ width: "140px" }}>
                  <Translate content="projectList.colStatus" />
                </th>

                {/* Customer column */}
                <th className="text-left align-middle" style={{ width: "220px" }}>
                  <Translate content="projectList.colCustomer" />
                </th>

                {/* Start date column */}
                <th className="text-center align-middle" style={{ width: "130px" }}>
                  <Translate content="projectList.colStartDate" />
                </th>

                {/* Delete column */}
                <th className="text-center align-middle" style={{ width: "95px" }}>
                  <Translate content="projectList.colDelete" />
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    <Translate content="projectList.noDataFound" />
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
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

          {/* Bulk delete banner */}
          {selectedIds.length > 0 && (
            <div className="bulk-delete-banner d-flex align-items-center mt-3 py-2 bg-light border">
              {/* Left section: Selected items count */}
              <div className="flex-grow-1 pl-3">
                <span className="text-primary font-weight-bold">
                  {selectedIds.length} <Translate content="projectList.itemsSelected" />
                </span>
              </div>

              {/* Action link: Delete selected items */}
              <div className="pr-2">
                <button
                  type="button"
                  onClick={() => handleDeleteProjects(selectedIds)}
                  className="btn btn-link text-danger p-0 font-weight-bold text-decoration-none"
                >
                  <Translate content="projectList.deleteSelected" />
                </button>
              </div>

              {/* Trash icon container: Exactly 70px width and centered to align with the table's Delete column */}
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ width: "70px", flexShrink: 0 }}
              >
                <TrashIcon onClick={() => handleDeleteProjects(selectedIds)} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectList;
