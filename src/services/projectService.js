import api from "./api";

const projectService = {
    searchProjects: async (criteriaOrKeyword, statusOrPage = 0, pageOrSize = 10, sizeOrSort = 'projectNumber,asc', legacySort) => {
        let criteria = {};
        let page = 0;
        let size = 10;
        let sort = 'projectNumber,asc';

        if (typeof criteriaOrKeyword === 'object' && criteriaOrKeyword !== null) {
            criteria = criteriaOrKeyword;
            page = statusOrPage !== undefined ? statusOrPage : 0;
            size = pageOrSize !== undefined ? pageOrSize : 10;
            sort = sizeOrSort || 'projectNumber,asc';
        } else {
            criteria = {
                keyword: criteriaOrKeyword,
                status: statusOrPage,
            };
            page = pageOrSize !== undefined ? pageOrSize : 0;
            size = sizeOrSort !== undefined ? sizeOrSort : 10;
            sort = legacySort || 'projectNumber,asc';
        }

        const params = {
            page,
            size,
            sort,
        };

        if (criteria.keyword && criteria.keyword.trim()) {
            params.keyword = criteria.keyword.trim();
        }
        if (criteria.status && criteria.status !== 'ALL') {
            params.status = criteria.status;
        }
        if (criteria.groupLeaderVisa && criteria.groupLeaderVisa.trim()) {
            params.groupLeaderVisa = criteria.groupLeaderVisa.trim();
        }
        const visas = criteria.memberVisas !== undefined ? criteria.memberVisas : criteria.memberVisa;
        if (visas) {
            if (Array.isArray(visas) && visas.length > 0) {
                params.memberVisas = Array.from(new Set(visas)).filter(Boolean).join(",");
            } else if (visas instanceof Set && visas.size > 0) {
                params.memberVisas = Array.from(visas).filter(Boolean).join(",");
            } else if (typeof visas === "string" && visas.trim()) {
                params.memberVisas = visas.trim();
            }
        }
        if (criteria.startDateFrom) {
            params.startDateFrom = criteria.startDateFrom;
        }
        if (criteria.startDateTo) {
            params.startDateTo = criteria.startDateTo;
        }
        if (criteria.endDateFrom) {
            params.endDateFrom = criteria.endDateFrom;
        }
        if (criteria.endDateTo) {
            params.endDateTo = criteria.endDateTo;
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
