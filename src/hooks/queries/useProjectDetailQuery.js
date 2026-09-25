import { useQuery } from "@tanstack/react-query";
import projectService from "../../services/projectService";

/**
 * Custom query hook for fetching a single project's detail by ID.
 * Only executes if ID is provided and truthy.
 */
export const useProjectDetailQuery = (id) => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const response = await projectService.getProjectById(id);
      return response.data || response;
    },
    enabled: Boolean(id),
  });
};

export default useProjectDetailQuery;
