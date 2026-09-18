import { create } from 'zustand';
import projectService from '../services/projectService';

export const useProjectStore = create((set, get) => ({
  // 1. Global State
  searchCriteria: {
    keyword: '',
    status: 'ALL',
  },
  projects: [],
  loading: false,
  error: null,

  // 2. Actions
  actions: {
    // 2.1 Synchronous Actions
    setSearchCriteria: (criteria) =>
      set((state) => ({
        searchCriteria: {
          ...state.searchCriteria,
          ...criteria,
        },
      })),

    resetSearchCriteria: () =>
      set({
        searchCriteria: {
          keyword: '',
          status: 'ALL',
        },
      }),

    setProjects: (projects) => set({ projects: projects || [] }),

    // 2.2 Asynchronous Actions
    fetchProjects: async (customCriteria) => {
      set({ loading: true, error: null });
      try {
        const criteria = customCriteria !== undefined ? customCriteria : get().searchCriteria;
        const data = await projectService.searchProjects(criteria.keyword, criteria.status);
        set({ projects: data || [], loading: false });
        return data;
      } catch (err) {
        console.error('Failed to fetch projects in store:', err);
        set({ error: err, loading: false });
        throw err;
      }
    },

    // 2.3 Asynchronous Actions
    deleteProjects: async (ids) => {
      set({ loading: true, error: null });
      try {
        await projectService.deleteProjects(ids);
        await get().actions.fetchProjects();
      } catch (err) {
        console.error('Failed to delete projects in store:', err);
        set({ error: err, loading: false });
        throw err;
      }
    },
  },


}));

export const useProjects = () => useProjectStore((state) => state.projects);
export const useSearchCriteria = () => useProjectStore((state) => state.searchCriteria);
export const useProjectLoading = () => useProjectStore((state) => state.loading);
export const useProjectError = () => useProjectStore((state) => state.error);

export const useProjectActions = () => useProjectStore((state) => state.actions);