import { useState, useMemo, useCallback } from "react";

/**
 * Custom Hook for Persistent Cross-Page Selection with Page-Scoped Select All.
 */
export const useProjectSelection = (projects = []) => {
  // Map storing selected projects: { [id]: project }
  const [selectedProjectsMap, setSelectedProjectsMap] = useState({});

  // Current page project IDs
  const currentPageIds = useMemo(() => projects.map((p) => p.id), [projects]);

  // Derived array of selected IDs
  const selectedIds = useMemo(
    () => Object.keys(selectedProjectsMap).map(Number),
    [selectedProjectsMap]
  );

  // Derived array of selected project objects
  const selectedProjects = useMemo(
    () => Object.values(selectedProjectsMap),
    [selectedProjectsMap]
  );

  const selectedCount = selectedIds.length;

  // Check if a specific project ID is selected (O(1) lookup)
  const isSelected = useCallback(
    (id) => Boolean(selectedProjectsMap[id]),
    [selectedProjectsMap]
  );

  // Check if ALL projects on CURRENT PAGE are selected
  const isAllSelected = useMemo(
    () =>
      currentPageIds.length > 0 &&
      currentPageIds.every((id) => Boolean(selectedProjectsMap[id])),
    [currentPageIds, selectedProjectsMap]
  );

  // Check if SOME (but not all) projects on CURRENT PAGE are selected
  const isSomeSelected = useMemo(
    () =>
      currentPageIds.some((id) => Boolean(selectedProjectsMap[id])) &&
      !isAllSelected,
    [currentPageIds, selectedProjectsMap, isAllSelected]
  );

  // Toggle single row selection by ID
  const toggleSelect = useCallback(
    (id) => {
      setSelectedProjectsMap((prev) => {
        const next = { ...prev };
        if (next[id]) {
          delete next[id];
        } else {
          const project = projects.find((p) => p.id === id);
          if (project) {
            next[id] = project;
          }
        }
        return next;
      });
    },
    [projects]
  );

  // Toggle Select All on the CURRENT PAGE
  const toggleSelectAll = useCallback(() => {
    setSelectedProjectsMap((prev) => {
      const next = { ...prev };
      if (isAllSelected) {
        // Deselect only current page items, preserve selections on other pages
        currentPageIds.forEach((id) => delete next[id]);
      } else {
        // Merge current page items into the selection
        projects.forEach((p) => {
          next[p.id] = p;
        });
      }
      return next;
    });
  }, [isAllSelected, currentPageIds, projects]);

  // Remove deleted IDs after successful deletion
  const removeSelectedIds = useCallback((deletedIds = []) => {
    setSelectedProjectsMap((prev) => {
      const next = { ...prev };
      deletedIds.forEach((id) => delete next[id]);
      return next;
    });
  }, []);

  // Clear all selections (e.g. when search filters change)
  const clearSelection = useCallback(() => {
    setSelectedProjectsMap({});
  }, []);

  return {
    selectedIds,
    selectedProjects,
    selectedCount,
    selectedProjectsMap,
    isSelected,
    isAllSelected,
    isSomeSelected,
    toggleSelect,
    toggleSelectAll,
    removeSelectedIds,
    clearSelection,
  };
};

export default useProjectSelection;
