import { useMutation, useQueryClient } from "@tanstack/react-query";
import projectService from "../../services/projectService";

/**
 * Custom mutation hook for deleting projects by IDs.
 * Automatically invalidates 'projects' query cache upon successful execution.
 */
export const useDeleteProjectsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids) => projectService.deleteProjects(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

/**
 * Custom mutation hook for creating a new project.
 * Automatically invalidates 'projects' query cache upon successful creation.
 */
export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectData) => projectService.createProject(projectData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

/**
 * Custom mutation hook for updating an existing project.
 * Automatically invalidates 'projects' list and specific project detail cache upon success.
 */
export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, projectData }) => projectService.updateProject(id, projectData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", variables.id] });
    },
  });
};
