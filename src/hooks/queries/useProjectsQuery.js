import { useQuery } from "@tanstack/react-query";
import projectService from "../../services/projectService";
import {
  useSearchCriteria,
  usePagination,
  useSortConfig,
} from "../../store/useProjectStore";

/**
 * Custom query hook for searching projects with dynamic criteria, server-side pagination, and sorting.
 * Automatically synchronizes with client-side filter state stored in Zustand.
 * Uses keepPreviousData for smooth pagination transitions without blank screen flickering.
 */
export const useProjectsQuery = () => {
  const searchCriteria = useSearchCriteria();
  const pagination = usePagination();
  const sortConfig = useSortConfig();

  const sortParam = `${sortConfig.field},${sortConfig.direction}`;

  return useQuery({
    queryKey: [
      "projects",
      searchCriteria,
      pagination.pageNumber,
      pagination.pageSize,
      sortParam,
    ],
    queryFn: () =>
      projectService.searchProjects(
        searchCriteria,
        pagination.pageNumber,
        pagination.pageSize,
        sortParam
      ),
    keepPreviousData: true,
  });
};

export default useProjectsQuery;
