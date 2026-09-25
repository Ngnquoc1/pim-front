import { useQuery } from "@tanstack/react-query";
import groupService from "../../services/groupService";

/**
 * Custom query hook for fetching group reference data.
 * Groups are static and rarely change, so cached for 10 minutes (staleTime = 600,000ms).
 */
export const useGroupsQuery = () => {
  return useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const response = await groupService.getAllGroups();
      return response.data || response || [];
    },
    staleTime: 10 * 60 * 1000,
  });
};

export default useGroupsQuery;
