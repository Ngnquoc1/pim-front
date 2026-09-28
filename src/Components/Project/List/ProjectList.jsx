import React, { useState, useMemo, useEffect } from "react";
import { Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Translate from "react-translate-component";
import counterpart from "counterpart";

import TrashIcon from "../../Common/TrashIcon";
import PaginationBar from "../../Common/PaginationBar";
import TableSkeleton from "../../Common/TableSkeleton";
import DeleteConfirmModal from "../../Common/DeleteConfirmModal";
import ToastNotification from "../../Common/ToastNotification";
import EmptyState from "../../Common/EmptyState";
import ProjectListItem from "./ProjectListItem";
import {
  useProjectActions,
  useLocale,
  useSortConfig,
  usePagination,
  useSearchCriteria,
} from "../../../store/useProjectStore";
import {
  useProjectsQuery,
  useDeleteProjectsMutation,
} from "../../../hooks/queries";
import { useProjectSelection } from "../../../hooks/useProjectSelection";

import { sortProjects } from "../../../utils/sortUtils";

import styles from "./ProjectList.module.css";

export const ProjectList = () => {
  useLocale(); // Trigger re-render when language changes
  const sortConfig = useSortConfig();
  const pagination = usePagination();
  const { setSortConfig, setPage } = useProjectActions();

  // 1. Server-side State via TanStack Query
  const { data, isLoading } = useProjectsQuery();
  const deleteMutation = useDeleteProjectsMutation();

  const projects = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const loading = isLoading;

  const searchCriteria = useSearchCriteria();

  // Persistent Cross-Page Selection with Page-Scoped Select All
  const {
    selectedIds,
    selectedCount,
    selectedProjectsMap,
    isSelected,
    isAllSelected,
    isSomeSelected,
    toggleSelect,
    toggleSelectAll,
    removeSelectedIds,
    clearSelection,
  } = useProjectSelection(projects);

  // Automatically reset selections when search criteria/filters change
  useEffect(() => {
    clearSelection();
  }, [searchCriteria, clearSelection]);

  // Custom Delete Modal State
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    ids: [],
    isWarning: false,
  });

  // Success Toast notification state
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3500);
  };

  const location = useLocation();
  const navigate = useNavigate();

  // Listen for flash toast messages from navigation (e.g. Project created or updated)
  useEffect(() => {
    if (location.state?.toastKey) {
      showToast(counterpart.translate(location.state.toastKey));
      navigate(location.pathname, { replace: true, state: {} });
    } else if (location.state?.toastMessage) {
      showToast(location.state.toastMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

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
  };

  // Unified delete trigger (opens professional modal dialog)
  const handleDeleteProjects = (idsToDelete) => {
    if (!idsToDelete || idsToDelete.length === 0) return;

    // Filter projects matching target IDs from cross-page selected map or current projects
    const targetProjects = idsToDelete
      .map((id) => selectedProjectsMap[id] || projects.find((p) => p.id === id))
      .filter(Boolean);

    // Business rule: Only projects with status 'NEW' can be deleted
    const hasNonNewProject = targetProjects.some((p) => p.status !== "NEW");
    if (hasNonNewProject) {
      setDeleteModal({
        show: true,
        ids: idsToDelete,
        isWarning: true,
      });
      return;
    }

    setDeleteModal({
      show: true,
      ids: idsToDelete,
      isWarning: false,
    });
  };

  // Execute deletion confirmed in Modal
  const handleConfirmDelete = async () => {
    const idsToDelete = deleteModal.ids;
    setDeleteModal({ show: false, ids: [], isWarning: false });

    try {
      const result = await deleteMutation.mutateAsync(idsToDelete);
      removeSelectedIds(idsToDelete);

      // Transparency handling: check if any requested IDs were not found / already deleted
      if (result && result.notFoundIds && result.notFoundIds.length > 0) {
        const notFoundText = counterpart.translate("projectList.deletePartialSuccess", {
          ids: result.notFoundIds.join(", "),
        });
        showToast(notFoundText || result.message);
      } else {
        showToast(counterpart.translate("projectList.deleteSuccess"));
      }
    } catch (error) {
      console.error("Delete failed: ", error);
      if (error.response && error.response.status < 500) {
        alert(error.response.data?.message || "Delete failed");
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({ show: false, ids: [], isWarning: false });
  };

  const tableHeaders = [
    { className: "text-center align-middle", style: { width: "40px" }, label: <input type="checkbox" disabled style={{ width: "15px", height: "15px" }} /> },
    { className: "text-right align-middle", style: { width: "100px" }, label: <Translate content="projectList.colNumber" /> },
    { className: "text-left align-middle", label: <Translate content="projectList.colName" /> },
    { className: "text-left align-middle", style: { width: "140px" }, label: <Translate content="projectList.colStatus" /> },
    { className: "text-left align-middle", style: { width: "220px" }, label: <Translate content="projectList.colCustomer" /> },
    { className: "text-center align-middle", style: { width: "130px" }, label: <Translate content="projectList.colStartDate" /> },
    { className: "text-center align-middle", style: { width: "95px" }, label: <Translate content="projectList.colDelete" /> },
  ];

  return (
    <div className="project-list-table-container">
      {/* Toast Notification */}
      <ToastNotification message={toastMessage} />

      {/* Skeleton Shimmer Loading Table */}
      {loading && <TableSkeleton rows={5} headers={tableHeaders} />}

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
                    ref={(input) => {
                      if (input) input.indeterminate = isSomeSelected;
                    }}
                    onChange={toggleSelectAll}
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
                  <td colSpan="7" className="text-center">
                    <EmptyState
                      title={<Translate content="projectList.noDataFound" />}
                      subtitle={<Translate content="projectList.emptyStateHint" />}
                    />
                  </td>
                </tr>
              ) : (
                sortedProjects.map((project) => (
                  <ProjectListItem
                    key={project.id}
                    project={project}
                    isSelected={isSelected(project.id)}
                    onToggleSelected={toggleSelect}
                    onDeleteProject={handleDeleteProjects}
                  />
                ))
              )}
            </tbody>
          </Table>

          {/* Bulk delete banner directly under table per image7.png */}
          {selectedCount > 0 && (
            <div className={styles.bulkDeleteBanner}>
              <span className={styles.selectedCount}>
                {selectedCount} <Translate content="projectList.itemsSelected" />
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

          <PaginationBar
            totalPages={totalPages}
            pageNumber={pagination.pageNumber}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        show={deleteModal.show}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isWarning={deleteModal.isWarning}
        selectedItems={deleteModal.ids}
        itemLabels={projects
          .filter((p) => deleteModal.ids.includes(p.id))
          .map((p) => `#${p.projectNumber}`)}
      />
    </div>
  );
};

export default ProjectList;
