import { create } from 'zustand';
import counterpart from 'counterpart';
import projectService from '../services/projectService';
import en from '../Material/lang/en';
import fr from '../Material/lang/fr';

// 1. Register translations globally
counterpart.registerTranslations('en', en);
counterpart.registerTranslations('fr', fr);

// 2. Read saved locale from localStorage and synchronize counterpart immediately
const savedLocale = localStorage.getItem('pim_locale') || 'en';
counterpart.setLocale(savedLocale);

export const useProjectStore = create((set, get) => ({
  // 1. Global State
  locale: savedLocale,
  searchCriteria: {
    keyword: '',
    status: 'ALL',
    groupLeaderVisa: '',
    memberVisas: [],
    startDateFrom: '',
    startDateTo: '',
    endDateFrom: '',
    endDateTo: '',
  },
  isAdvancedFilterOpen: false,
  pagination: {
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  },
  sortConfig: {
    field: 'projectNumber',
    direction: 'asc',
  },
  projects: [],
  loading: false,
  error: null,

  // 2. Actions
  actions: {
    // 2.1 Synchronous Actions
    setLocale: (locale) => {
      localStorage.setItem('pim_locale', locale);
      counterpart.setLocale(locale);
      set({ locale });
    },

    setSearchCriteria: (criteria) =>
      set((state) => ({
        searchCriteria: {
          ...state.searchCriteria,
          ...criteria,
        },
      })),

    setIsAdvancedFilterOpen: (isAdvancedFilterOpen) => set({ isAdvancedFilterOpen }),

    resetSearchCriteria: () =>
      set({
        searchCriteria: {
          keyword: '',
          status: 'ALL',
          groupLeaderVisa: '',
          memberVisas: [],
          startDateFrom: '',
          startDateTo: '',
          endDateFrom: '',
          endDateTo: '',
        },
      }),

    setSortConfig: (field) => {
      const state = get();
      const direction =
        state.sortConfig.field === field && state.sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc';
      const newSortConfig = { field, direction };
      set({ sortConfig: newSortConfig });
      get().actions.fetchProjects({ page: 0, sort: `${field},${direction}` });
    },
    resetSortConfig: () =>
      set({
        sortConfig: {
          field: 'projectNumber',
          direction: 'asc',
        },
      }),

    setPage: (pageNumber) => {
      get().actions.fetchProjects({ page: pageNumber });
    },

    setPageSize: (pageSize) => {
      get().actions.fetchProjects({ page: 0, size: pageSize });
    },

    setProjects: (projects) => set({ projects: projects || [] }),

    // 2.2 Asynchronous Actions
    fetchProjects: async (customParams = {}) => {
      set({ loading: true, error: null });
      try {
        const state = get();
        const criteria = customParams.searchCriteria || state.searchCriteria;
        const page = customParams.page !== undefined ? customParams.page : state.pagination.pageNumber;
        const size = customParams.size !== undefined ? customParams.size : state.pagination.pageSize;
        const sort = customParams.sort || `${state.sortConfig.field},${state.sortConfig.direction}`;

        const data = await projectService.searchProjects(
          criteria,
          page,
          size,
          sort
        );

        set({
          projects: data.content || [],
          pagination: {
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            first: data.first,
            last: data.last,
          },
          loading: false
        });
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
export const useLocale = () => useProjectStore((state) => state.locale);
export const useSortConfig = () => useProjectStore((state) => state.sortConfig);
export const usePagination = () => useProjectStore((state) => state.pagination);
export const useIsAdvancedFilterOpen = () => useProjectStore((state) => state.isAdvancedFilterOpen);
export const useProjectActions = () => useProjectStore((state) => state.actions);