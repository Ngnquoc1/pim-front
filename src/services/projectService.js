import api from "./api";

const projectService = {
    searchProjects: async (keyword, status, page = 0, size = 10, sort = 'projectNumber,asc') => {
        const params = {
          keyword: (keyword || '').trim(),
          page,
          size,
          sort,
        };
        if (status && status !== 'ALL') {
          params.status = status;
        }
        return await api.get("/projects/search", { params });
    },
    getProjectById: async (id) => {
        return await api.get(`/projects/${id}`);
    },
    createProject: async (projectData) => {
        return await api.post("/projects", projectData);
    },
    updateProject: async (id, projectData) => {
        return await api.put(`/projects/${id}`, projectData);
    },
    deleteProject: async (ids) => {
        return await api.delete("/projects", { data: ids });
    },
    deleteProjects: async (ids) => {
        return await api.delete("/projects", { data: ids });
    }
}
export default projectService;
